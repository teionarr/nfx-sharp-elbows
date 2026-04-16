// ─── STATE NAMES ─────────────────────────────────────────────────────────────
export const S = {
  IDLE:     'IDLE',
  READY:    'READY',
  LOADING:  'LOADING',
  COMPLETE: 'COMPLETE',
  ERROR:    'ERROR',
}

// ─── EVENT NAMES ─────────────────────────────────────────────────────────────
export const E = {
  PERSONAS_LOADED:   'PERSONAS_LOADED',
  DECK_UPLOADED:     'DECK_UPLOADED',
  PERSONAS_SELECTED: 'PERSONAS_SELECTED',
  START_FEEDBACK:    'START_FEEDBACK',
  FEEDBACK_COMPLETE:    'FEEDBACK_COMPLETE',
  INTEREST_CLASSIFIED:  'INTEREST_CLASSIFIED',
  SNAPSHOT_SAVED:    'SNAPSHOT_SAVED',
  ERROR_OCCURRED:    'ERROR_OCCURRED',
  RESET:             'RESET',
}

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
export const initialState = {
  phase: S.IDLE,

  availablePersonas: [],
  selectedPersonaIds: [],

  deckFile: null,       // { name, size, type }
  deckBase64: null,     // full file as base64 string
  deckMimeType: null,   // 'application/pdf' | 'image/png' etc.

  feedbacks: {},        // { [personaId]: string }
  interests: {},        // { [personaId]: true | false }
  snapshotUrl: null,
  error: null,
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function isReady(state) {
  return !!state.deckFile && state.selectedPersonaIds.length >= 1
}

// ─── REDUCER ──────────────────────────────────────────────────────────────────
export function reducer(state, event) {
  // Global events
  if (event.type === E.PERSONAS_LOADED) {
    return { ...state, availablePersonas: event.payload.personas }
  }
  if (event.type === E.ERROR_OCCURRED) {
    return { ...state, phase: S.ERROR, error: event.payload.message }
  }
  if (event.type === E.RESET) {
    return { ...initialState, availablePersonas: state.availablePersonas }
  }
  if (event.type === E.SNAPSHOT_SAVED) {
    return { ...state, snapshotUrl: event.payload.url }
  }
  if (event.type === E.INTEREST_CLASSIFIED) {
    return { ...state, interests: { ...state.interests, [event.payload.personaId]: event.payload.interested } }
  }

  switch (state.phase) {
    case S.IDLE:
    case S.READY: {
      if (event.type === E.DECK_UPLOADED) {
        const next = {
          ...state,
          deckFile: event.payload.file,
          deckBase64: event.payload.deckBase64,
          deckMimeType: event.payload.deckMimeType,
          feedbacks: {},
          snapshotUrl: null,
        }
        next.phase = isReady(next) ? S.READY : S.IDLE
        return next
      }
      if (event.type === E.PERSONAS_SELECTED) {
        const next = { ...state, selectedPersonaIds: event.payload.ids }
        next.phase = isReady(next) ? S.READY : S.IDLE
        return next
      }
      if (event.type === E.START_FEEDBACK && state.phase === S.READY) {
        return { ...state, phase: S.LOADING, feedbacks: {}, snapshotUrl: null }
      }
      break
    }

    case S.COMPLETE: {
      // Allow re-running with new selection without full reset
      if (event.type === E.PERSONAS_SELECTED) {
        const next = { ...state, selectedPersonaIds: event.payload.ids, feedbacks: {}, interests: {}, snapshotUrl: null }
        next.phase = isReady(next) ? S.READY : S.IDLE
        return next
      }
      if (event.type === E.DECK_UPLOADED) {
        const next = {
          ...state,
          deckFile: event.payload.file,
          deckBase64: event.payload.deckBase64,
          deckMimeType: event.payload.deckMimeType,
          feedbacks: {},
          interests: {},
          snapshotUrl: null,
        }
        next.phase = isReady(next) ? S.READY : S.IDLE
        return next
      }
      break
    }

    case S.LOADING: {
      if (event.type === E.FEEDBACK_COMPLETE) {
        return { ...state, phase: S.COMPLETE, feedbacks: event.payload.feedbacks }
      }
      break
    }

    default: break
  }

  return state
}
