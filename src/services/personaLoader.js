/**
 * Load all personas from public/personas/manifest.json
 * Each persona's .txt file is fetched and parsed.
 */
export async function loadPersonas() {
  const manifest = await fetch('/personas/manifest.json').then(r => {
    if (!r.ok) throw new Error('Could not load personas manifest.')
    return r.json()
  })

  const personas = await Promise.all(
    manifest.personas.map(async meta => {
      try {
        const txt = await fetch(`/personas/${meta.txtFile}`).then(r => r.text())
        const systemPrompt = parseTxtBody(txt)
        return {
          ...meta,
          photoUrl: `/personas/${meta.photo}`,
          systemPrompt,
        }
      } catch {
        return {
          ...meta,
          photoUrl: null,
          systemPrompt: `You are ${meta.name} from ${meta.firm}. Evaluate startup pitches from your investment perspective.`,
        }
      }
    })
  )

  return personas
}

/**
 * The .txt format:
 *   NAME: ...
 *   FIRM: ...
 *   ---
 *   [system prompt content]
 *
 * Everything after "---" is the system prompt.
 */
function parseTxtBody(txt) {
  const sep = txt.indexOf('---')
  return sep === -1 ? txt.trim() : txt.slice(sep + 3).trim()
}
