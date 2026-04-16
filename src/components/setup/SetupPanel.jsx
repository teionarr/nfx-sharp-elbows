import { useSimulationContext } from '../../hooks/useSimulation.js'
import { E, S } from '../../machine/reducer.js'
import { canStart, isComplete, isLoading } from '../../machine/selectors.js'
import PersonaChip from '../shared/PersonaChip.jsx'
import FileDropZone from '../shared/FileDropZone.jsx'
import Button from '../shared/Button.jsx'

export default function SetupPanel() {
  const { state, dispatch, uploadDeck } = useSimulationContext()
  const { availablePersonas, selectedPersonaIds, deckFile } = state

  const ready    = canStart(state)
  const loading  = isLoading(state)
  const complete = isComplete(state)
  const busy     = loading || complete

  const togglePersona = (id) => {
    if (busy) return
    const next = selectedPersonaIds.includes(id)
      ? selectedPersonaIds.filter(p => p !== id)
      : [...selectedPersonaIds, id]
    dispatch({ type: E.PERSONAS_SELECTED, payload: { ids: next } })
  }

  return (
    <div className="flex flex-col h-full p-6 gap-7">

      {/* ── Deck upload ──────────────────────────────────────── */}
      <div>
        <div className="label-xs mb-3">Pitch deck</div>
        {deckFile && !busy ? (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded border border-emerald-500/25 bg-emerald-500/6">
            <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h7l3 3v7H2V2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-xs text-white truncate flex-1">{deckFile.name}</span>
            <button
              onClick={() => dispatch({ type: E.RESET })}
              className="text-[10px] text-muted hover:text-accent transition-colors shrink-0"
            >
              Change
            </button>
          </div>
        ) : deckFile && busy ? (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded border border-border bg-surface">
            <svg className="w-3.5 h-3.5 text-muted shrink-0" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h7l3 3v7H2V2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-xs text-muted truncate flex-1">{deckFile.name}</span>
          </div>
        ) : (
          <FileDropZone onFile={uploadDeck} accept=".pdf,image/*" className="py-6 flex flex-col items-center gap-2.5">
            <svg className="w-5 h-5 text-muted/40" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V8m0 0l-3 3m3-3l3 3M5 20h14a1 1 0 001-1V9l-6-6H5a1 1 0 00-1 1v15a1 1 0 001 1z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-center">
              <p className="text-xs text-white font-bold">Drop deck here</p>
              <p className="text-[10px] text-muted mt-0.5">PDF, PNG, JPG, WEBP</p>
            </div>
          </FileDropZone>
        )}
      </div>

      {/* ── Partner selection ─────────────────────────────────── */}
      <div className="flex-1">
        <div className="label-xs mb-3">
          Choose partners
          {selectedPersonaIds.length > 0 && (
            <span className="text-accent ml-1.5">{selectedPersonaIds.length} selected</span>
          )}
        </div>

        {availablePersonas.length === 0 ? (
          <div className="flex items-center gap-2 py-8 justify-center">
            <div className="w-4 h-4 border border-border rounded-full animate-pulse" />
            <p className="text-xs text-muted">Loading…</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {availablePersonas.map(persona => (
              <PersonaChip
                key={persona.id}
                persona={persona}
                selected={selectedPersonaIds.includes(persona.id)}
                onClick={() => togglePersona(persona.id)}
                disabled={busy}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="border-t border-border pt-5">
        {complete ? (
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="md"
              className="w-full justify-center"
              onClick={() => dispatch({ type: E.RESET })}
            >
              Start over
            </Button>
            {ready && (
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => dispatch({ type: E.START_FEEDBACK })}
                icon={<svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
              >
                Run again
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            disabled={!ready}
            loading={loading}
            onClick={() => dispatch({ type: E.START_FEEDBACK })}
            icon={!loading && <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>}
          >
            {loading ? 'Generating…' : 'Get Feedback'}
          </Button>
        )}
        {!deckFile && !loading && (
          <p className="text-[10px] text-muted/50 text-center mt-2">Upload a deck to begin</p>
        )}
        {deckFile && selectedPersonaIds.length === 0 && !loading && (
          <p className="text-[10px] text-muted/50 text-center mt-2">Select at least one partner</p>
        )}
      </div>

    </div>
  )
}
