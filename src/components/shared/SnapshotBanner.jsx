import { useState } from 'react'

export default function SnapshotBanner({ url, loading }) {
  const [copied, setCopied] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-surface text-xs text-muted animate-pulse">
        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Generating link…
      </div>
    )
  }

  if (!url) return null

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-accent/25 bg-accent/6 animate-fade-in">
      <span className="text-xs text-muted font-mono truncate flex-1">{url.slice(0, 55)}…</span>
      <button onClick={copyUrl}
        className="shrink-0 text-xs px-2 py-0.5 rounded bg-accent/15 hover:bg-accent/25 text-accent font-bold transition-colors">
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}
