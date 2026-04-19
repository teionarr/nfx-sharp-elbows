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

// ─── Legacy: decompress old ?d= URL-hash snapshots ───────────────────────────
export async function loadLegacySnapshot(b64url) {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4) b64 += '='
  const binary = atob(b64)
  const bytes  = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  const stream = new DecompressionStream('gzip')
  const writer = stream.writable.getWriter()
  writer.write(bytes)
  writer.close()

  const reader = stream.readable.getReader()
  const chunks = []
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  const total  = chunks.reduce((s, c) => s + c.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length }
  return JSON.parse(new TextDecoder().decode(result))
}
