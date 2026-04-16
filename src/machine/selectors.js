import { S } from './reducer.js'

export function getActivePersonas(state) {
  return state.availablePersonas.filter(p => state.selectedPersonaIds.includes(p.id))
}

export function canStart(state) {
  return state.phase === S.READY
}

export function isLoading(state) {
  return state.phase === S.LOADING
}

export function isComplete(state) {
  return state.phase === S.COMPLETE
}
