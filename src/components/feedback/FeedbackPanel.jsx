import { useSimulationContext } from '../../hooks/useSimulation.jsx'
import { S } from '../../machine/reducer.js'
import { getActivePersonas } from '../../machine/selectors.js'
import FeedbackCard from './FeedbackCard.jsx'
import SnapshotBanner from '../shared/SnapshotBanner.jsx'
import Button from '../shared/Button.jsx'
import { useState, useCallback } from 'react'

export default function FeedbackPanel() {
  const { state, streamDisplay, saveSnapshot } = useSimulationContext()
  const { phase, feedbacks, interests, snapshotUrl } = state
  const [snapshotLoading, setSnapshotLoading] = useState(false)

  const activePersonas = getActivePersonas(state)
  const isLoading  = phase === S.LOADING
  const isComplete = phase === S.COMPLETE

  const handleSnapshot = useCallback(async () => {
    setSnapshotLoading(true)
    await saveSnapshot()
    setSnapshotLoading(false)
  }, [saveSnapshot])

  // Empty state
  if (!isLoading && !isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-10 gap-4">
        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
          <svg className="w-5 h-5 text-muted/40" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 4v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-white/60 mb-1">Feedback will appear here</p>
          <p className="text-xs text-muted/50">Upload a deck and choose partners to begin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">

      {/* ── Save & Share header ───────────────────────────────── */}
      {isComplete && (
        <div className="flex items-center justify-between mb-2">
          <span className="label-xs text-emerald-400">
            {activePersonas.length} feedback{activePersonas.length !== 1 ? 's' : ''} ready
          </span>
          {snapshotUrl ? (
            <SnapshotBanner url={snapshotUrl} />
          ) : (
            <Button
              size="sm"
              variant="ghost"
              loading={snapshotLoading}
              onClick={handleSnapshot}
              icon={<svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 5l3 3 3-3M2 9v2h8V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>}
            >
              Save &amp; Share
            </Button>
          )}
        </div>
      )}

      {/* ── Feedback cards ────────────────────────────────────── */}
      {activePersonas.map(persona => {
        const streamText   = streamDisplay[persona.id] ?? ''
        const finalText    = feedbacks[persona.id] ?? ''
        const streaming    = isLoading && streamText.length > 0
        const text         = isComplete ? finalText : streamText

        return (
          <FeedbackCard
            key={persona.id}
            persona={persona}
            text={text}
            streaming={isLoading}
            interested={interests[persona.id]}
          />
        )
      })}
    </div>
  )
}
