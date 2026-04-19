/**
 * Snapshot Service
 * Stores feedback state server-side and returns a short share URL.
 * Share URL format: <origin>/#/snapshot?id=<8-char-id>
 */

const API_BASE = '/api/snap'

// ─── Serialize ────────────────────────────────────────────────────────────────
function serializeState(state) {
  return {
    version: 3,
    savedAt: new Date().toISOString(),
    selectedPersonaIds: state.selectedPersonaIds,
    deckFile: state.deckFile ? { name: state.deckFile.name, size: state.deckFile.size } : null,
    feedbacks: state.feedbacks ?? {},
    interests: state.interests ?? {},
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function saveSnapshot(state) {
  const payload = serializeState(state)

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`Server error: ${res.status}`)

  const { id } = await res.json()
  const base = window.location.href.split('#')[0]
  return `${base}#/snapshot?id=${id}`
}

export async function loadSnapshot(id) {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) throw new Error(`Snapshot not found (${res.status})`)
  return res.json()
}
