import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { cx, getInitials, getAvatarColor } from '../../utils.js'
import { Avatar } from '../shared/PersonaChip.jsx'

export default function FeedbackCard({ persona, text, streaming, interested, defaultCollapsed = false }) {
  const isEmpty = !text
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const borderColor = streaming
    ? 'rgba(255,255,255,0.08)'
    : interested === true
      ? 'rgba(52,211,153,0.55)'
      : interested === false
        ? 'rgba(248,113,113,0.55)'
        : 'var(--color-border, rgba(255,255,255,0.1))'

  return (
    <div
      className="bg-surface border rounded p-5 flex flex-col gap-4 animate-fade-in"
      style={{ borderColor, transition: 'border-color 0.5s ease' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => !streaming && setCollapsed(c => !c)}>
        <Avatar
          photoUrl={persona.photoUrl}
          initials={getInitials(persona.name)}
          color={getAvatarColor(persona.id)}
          size={36}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate">{persona.name}</div>
          <div className="text-xs text-muted truncate">{persona.role}</div>
        </div>
        {streaming && (
          <div className="flex items-center gap-0.5 shrink-0">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-1 h-1 rounded-full bg-accent animate-pulse"
                style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
          </div>
        )}
        {!streaming && (
          <svg
            className="w-4 h-4 text-muted shrink-0 transition-transform duration-200"
            style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
            viewBox="0 0 16 16" fill="none"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Body */}
      {!collapsed && <div className="text-sm text-white/85 leading-relaxed min-h-[3rem] prose-feedback">
        {isEmpty && streaming ? (
          <span className="text-muted/50 italic animate-pulse">Reading the materials…</span>
        ) : isEmpty ? (
          <span className="text-muted/40 italic">Waiting…</span>
        ) : (
          <>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-base font-bold text-white mt-4 mb-1 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold text-white mt-3 mb-1 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold text-white/90 mt-3 mb-1 first:mt-0">{children}</h3>,
                p:  ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                em: ({ children }) => <span>{children}</span>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-accent/40 pl-3 text-white/60 italic my-2">{children}</blockquote>,
                code: ({ children }) => <code className="bg-white/10 rounded px-1 py-0.5 text-xs font-mono">{children}</code>,
                hr: () => <hr className="border-border my-3" />,
              }}
            >
              {text}
            </ReactMarkdown>
            {streaming && text && (
              <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-text-bottom animate-blink" />
            )}
          </>
        )}
      </div>}
    </div>
  )
}
