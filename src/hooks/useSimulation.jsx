import { createContext, useContext, useReducer, useEffect, useRef, useState, useCallback } from 'react'
import { reducer, initialState, S, E } from '../machine/reducer.js'
import { getActivePersonas } from '../machine/selectors.js'
import { generatePartnerFeedback, classifyInterest } from '../services/gemini.js'
import { saveSnapshot as saveSnapshotToUrl } from '../services/snapshotService.js'
import { loadPersonas } from '../services/personaLoader.js'
import { fileToBase64 } from '../services/pdfParser.js'

export const SimulationContext = createContext(null)

export function SimulationProvider({ children }) {
  const [state, dispatch]   = useReducer(reducer, initialState)
  const streamBuffersRef    = useRef({})   // { [personaId]: string } — raw accumulated text
  const [streamDisplay, setStreamDisplay] = useState({})
  const abortRef            = useRef(null)
  const classifyAbortRef    = useRef(null)

  // ── Load personas on mount ────────────────────────────────────────────────
  useEffect(() => {
    loadPersonas()
      .then(personas => dispatch({ type: E.PERSONAS_LOADED, payload: { personas } }))
      .catch(err => console.error('[feedback] Failed to load personas:', err))
  }, [])

  // ── Throttle stream display (~12fps) ─────────────────────────────────────
  useEffect(() => {
    if (state.phase !== S.LOADING) return
    const timer = setInterval(() => {
      setStreamDisplay({ ...streamBuffersRef.current })
    }, 80)
    return () => clearInterval(timer)
  }, [state.phase])

  // ── LOADING → fire all feedback calls in parallel ────────────────────────
  useEffect(() => {
    if (state.phase !== S.LOADING) return

    const controller = new AbortController()
    abortRef.current = controller
    const classifyController = new AbortController()
    classifyAbortRef.current = classifyController

    const activePersonas = getActivePersonas(state)
    streamBuffersRef.current = {}
    setStreamDisplay({})

    // Simple concurrency limiter — max 3 Gemini calls at once to avoid rate limits
    const CONCURRENCY = 3
    const semaphore = { running: 0, queue: [] }
    function acquire() {
      return new Promise(resolve => {
        if (semaphore.running < CONCURRENCY) { semaphore.running++; resolve() }
        else semaphore.queue.push(resolve)
      })
    }
    function release() {
      semaphore.running--
      if (semaphore.queue.length) { semaphore.running++; semaphore.queue.shift()() }
    }

    const run = async () => {
      try {
        const feedbacks = {}

        await Promise.all(
          activePersonas.map(async persona => {
            streamBuffersRef.current[persona.id] = ''
            await acquire()
            try {
              // 2-minute timeout per request — prevents silent hangs
              const timeoutSignal = AbortSignal.timeout(120_000)
              const combinedSignal = AbortSignal.any
                ? AbortSignal.any([controller.signal, timeoutSignal])
                : controller.signal

              await generatePartnerFeedback({
                persona,
                deckBase64:   state.deckBase64,
                deckMimeType: state.deckMimeType,
                onChunk: (text) => {
                  streamBuffersRef.current[persona.id] =
                    (streamBuffersRef.current[persona.id] ?? '') + text
                },
                onDone: (fullText) => {
                  feedbacks[persona.id] = fullText
                  classifyInterest(fullText, classifyController.signal)
                    .then(result => {
                      dispatch({ type: E.INTEREST_CLASSIFIED, payload: { personaId: persona.id, interested: result } })
                    })
                    .catch(err => console.error('[interest] error', persona.id, err))
                },
                signal: combinedSignal,
              })
            } catch (err) {
              if (err.name === 'AbortError') {
                // Timeout — show a message rather than silent "Waiting…"
                if (!controller.signal.aborted)
                  feedbacks[persona.id] = '_Request timed out. Try again with fewer partners._'
                return
              }
              const msg = err?.message ?? String(err)
              console.error(`[feedback] ${persona.name} error:`, msg)
              feedbacks[persona.id] = `_Could not load feedback: ${msg}_`
            } finally {
              release()
            }
          })
        )

        if (controller.signal.aborted) return

        // Final display sync
        setStreamDisplay({ ...streamBuffersRef.current })
        dispatch({ type: E.FEEDBACK_COMPLETE, payload: { feedbacks } })
      } catch (err) {
        if (err.name !== 'AbortError') {
          dispatch({ type: E.ERROR_OCCURRED, payload: { message: err.message } })
        }
      }
    }

    run()
    return () => { controller.abort() }
  }, [state.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Upload handler (converts file → base64 before dispatching) ───────────
  const uploadDeck = useCallback(async (file) => {
    try {
      const deckBase64   = await fileToBase64(file)
      const deckMimeType = file.type || 'application/pdf'
      dispatch({
        type: E.DECK_UPLOADED,
        payload: {
          file:     { name: file.name, size: file.size, type: file.type },
          deckBase64,
          deckMimeType,
        },
      })
    } catch (err) {
      dispatch({ type: E.ERROR_OCCURRED, payload: { message: `Failed to read file: ${err.message}` } })
    }
  }, [])

  // ── Snapshot ─────────────────────────────────────────────────────────────
  const saveSnapshot = useCallback(async () => {
    const url = await saveSnapshotToUrl(state)
    dispatch({ type: E.SNAPSHOT_SAVED, payload: { url } })
    return url
  }, [state])

  const value = {
    state,
    dispatch,
    streamDisplay,
    uploadDeck,
    saveSnapshot,
  }

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulationContext() {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error('useSimulationContext must be used inside SimulationProvider')
  return ctx
}
