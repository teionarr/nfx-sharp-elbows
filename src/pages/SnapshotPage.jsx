import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { loadSnapshot, loadLegacySnapshot } from '../services/snapshotService.js'
import { loadPersonas } from '../services/personaLoader.js'
import FeedbackCard from '../components/feedback/FeedbackCard.jsx'

export default function SnapshotPage() {
  const location = useLocation()
  const [snapshot, setSnapshot] = useState(null)
  const [personas, setPersonas] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const params  = new URLSearchParams(location.search)
    const id      = params.get('id')
    const legacyD = params.get('d')

    if (!id && !legacyD) {
      setError('No snapshot found in URL.')
      setLoading(false)
      return
    }

    const snapPromise = id
      ? loadSnapshot(id)
      : loadLegacySnapshot(legacyD)

    Promise.all([snapPromise, loadPersonas()])
      .then(([snap, loadedPersonas]) => {
        setSnapshot(snap)
        setPersonas(loadedPersonas)
        setLoading(false)
      })
      .catch(err => {
        setError(`Failed to load snapshot: ${err.message}`)
        setLoading(false)
      })
  }, [location.search])

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted">
          <svg className="animate-spin w-7 h-7" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="text-sm">Loading snapshot…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-red-400 font-bold mb-2">Snapshot Error</div>
          <div className="text-sm text-muted">{error}</div>
          <a href="/" className="mt-5 inline-block text-sm text-accent hover:underline">← Back to Sharp Elbows</a>
        </div>
      </div>
    )
  }

  if (!snapshot) return null

  const activePersonas = personas.filter(p => snapshot.selectedPersonaIds?.includes(p.id))

  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-base/96 backdrop-blur border-b border-border flex items-center px-5 gap-3" style={{ height: '52px' }}>
        <img src="/logo.svg" alt="NFX" className="h-6 w-auto opacity-90" />
        <span className="text-sm font-bold text-white/80 tracking-wide">Sharp Elbows</span>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-muted">
          Snapshot · {snapshot.savedAt ? new Date(snapshot.savedAt).toLocaleString() : ''}
        </span>
        <div className="flex-1" />
        <a href="/" className="text-xs text-accent hover:underline">Try it yourself →</a>
      </header>

      {/* Deck info */}
      {snapshot.deckFile && (
        <div className="max-w-3xl mx-auto px-5 pt-6">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded border border-border bg-surface text-xs text-muted">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h7l3 3v7H2V2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span>{snapshot.deckFile.name}</span>
            {snapshot.deckFile.size && (
              <span className="ml-auto">{(snapshot.deckFile.size / 1024).toFixed(0)} KB</span>
            )}
          </div>
        </div>
      )}

      {/* Feedback cards */}
      <div className="max-w-3xl mx-auto px-5 py-6 space-y-4">
        {activePersonas.length === 0 && (
          <p className="text-sm text-muted text-center py-12">No partner feedback found in this snapshot.</p>
        )}
        {activePersonas.map(persona => (
          <FeedbackCard
            key={persona.id}
            persona={persona}
            text={snapshot.feedbacks?.[persona.id] ?? ''}
            streaming={false}
            interested={snapshot.interests?.[persona.id]}
            defaultCollapsed={true}
          />
        ))}
      </div>
    </div>
  )
}
