/**
 * Snapshot Service
 * Serializes feedback state to a compressed, base64url-encoded URL hash.
 * Share URL format: <origin>/#/snapshot?d=<compressed_base64url>
 */

// ─── Compression helpers ──────────────────────────────────────────────────────
async function compress(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)

  const stream = new CompressionStream('gzip')
  const writer = stream.writable.getWriter()
  writer.write(data)
  writer.close()

  const reader = stream.readable.getReader()
  const chunks = []
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  const total = chunks.reduce((s, c) => s + c.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length }

  let binary = ''
  for (let i = 0; i < result.length; i++) binary += String.fromCharCode(result[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function decompress(b64url) {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4) b64 += '='

  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
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

  const total = chunks.reduce((s, c) => s + c.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length }

  return new TextDecoder().decode(result)
}

// ─── Serialize ────────────────────────────────────────────────────────────────
function serializeState(state) {
  return {
    version: 2,
    savedAt: new Date().toISOString(),
    selectedPersonaIds: state.selectedPersonaIds,
    deckFile: state.deckFile ? { name: state.deckFile.name, size: state.deckFile.size } : null,
    feedbacks: state.feedbacks ?? {},
    interests: state.interests ?? {},
    // Omit: deckBase64 (too large)
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function saveSnapshot(state) {
  const payload = serializeState(state)
  const json    = JSON.stringify(payload)
  const encoded = await compress(json)
  const base    = window.location.href.split('#')[0]
  return `${base}#/snapshot?d=${encoded}`
}

export async function loadSnapshot(encoded) {
  const json = await decompress(encoded)
  return JSON.parse(json)
}
