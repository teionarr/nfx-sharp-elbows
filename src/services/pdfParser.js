import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const MAX_CHARS = 15000

/**
 * Extract text from a PDF File object.
 * Returns plain text, truncated to MAX_CHARS.
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise

  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map(item => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (pageText) pages.push(`[Slide ${i}] ${pageText}`)
  }

  const full = pages.join('\n\n')
  if (full.length > MAX_CHARS) {
    return full.slice(0, MAX_CHARS) + '\n\n[... content truncated for context window ...]'
  }
  return full
}

/**
 * Convert an image File to base64 string (without the data URL prefix).
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Detect whether a file is a PDF or an image.
 */
export function getDeckType(file) {
  if (file.type === 'application/pdf') return 'pdf'
  if (file.type.startsWith('image/')) return 'image'
  return 'unknown'
}
