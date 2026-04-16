import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL   = 'gemini-2.5-flash'

let genAI = null

function getClient() {
  if (!genAI) {
    if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY is not set.')
    genAI = new GoogleGenerativeAI(API_KEY)
  }
  return genAI
}

async function withRetry(fn, signal, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    try {
      return await fn()
    } catch (err) {
      if (err.name === 'AbortError' || signal?.aborted) throw err
      if (attempt === maxRetries - 1) throw err
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)))
    }
  }
}

// ─── Classify partner interest (boolean) ─────────────────────────────────────
export async function classifyInterest(feedbackText, signal) {
  const client = getClient()
  const model  = client.getGenerativeModel({ model: MODEL })

  const prompt = `You are classifying whether a VC investor would take a meeting or move forward based on their feedback.

Rules:
- YES = the investor is genuinely excited or intrigued and wants to dig deeper into this specific company
- NO = the investor could not evaluate (e.g. no real deck, just a logo), is dismissive, sees fundamental blockers, or is just being politely encouraging without real interest

Important: "I look forward to seeing your deck" or "send me more" when no real deck was submitted = NO (they haven't seen anything yet).

Feedback:
${feedbackText}

Answer with only YES or NO:`

  const result = await withRetry(() => model.generateContent(prompt), signal)
  const answer = result.response.text().trim().toUpperCase()
  console.log('[interest]', answer.startsWith('YES') ? '🟢 YES' : '🔴 NO', '|', answer)
  return answer.startsWith('YES')
}

// ─── Single-shot feedback from one partner ────────────────────────────────────
export async function generatePartnerFeedback({
  persona,       // { name, role, systemPrompt }
  deckBase64,    // base64 string of the full PDF or image
  deckMimeType,  // 'application/pdf' | 'image/png' | etc.
  onChunk,       // (text: string) => void
  onDone,        // () => void
  signal,
}) {
  const client = getClient()
  const model  = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: persona.systemPrompt,
  })

  const parts = [
    { inlineData: { mimeType: deckMimeType, data: deckBase64 } },
    { text: 'Please review this pitch deck and share your honest, detailed feedback. Be specific, direct, and true to your investment perspective.' },
  ]

  const result = await withRetry(() => model.generateContentStream(parts), signal)

  let fullText = ''
  for await (const chunk of result.stream) {
    if (signal?.aborted) break
    const text = chunk.text()
    fullText += text
    onChunk(text)
  }

  onDone(fullText)
  return fullText
}
