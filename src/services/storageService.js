const KEY = 'shadow-board-session-v1'

function serializeForStorage(state) {
  // eslint-disable-next-line no-unused-vars
  const { streamBuffers, deckBase64, ...rest } = state
  return {
    ...rest,
    deckFile: rest.deckFile
      ? { name: rest.deckFile.name, size: rest.deckFile.size, type: rest.deckFile.type }
      : null,
  }
}

export function saveToStorage(state) {
  try {
    const serialized = serializeForStorage(state)
    localStorage.setItem(KEY, JSON.stringify(serialized))
  } catch (e) {
    // Quota exceeded or private browsing — silently ignore
    console.warn('[storage] Could not save session:', e.message)
  }
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearStorage() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function hasSavedSession() {
  try {
    return localStorage.getItem(KEY) !== null
  } catch {
    return false
  }
}
