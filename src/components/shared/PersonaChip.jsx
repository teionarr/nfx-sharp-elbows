import { cx, getInitials, getAvatarColor } from '../../utils.js'

export default function PersonaChip({ persona, selected, onClick, disabled }) {
  const initials = getInitials(persona.name)
  const color = getAvatarColor(persona.id)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'relative flex items-center gap-3 p-3.5 rounded text-left w-full',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        selected
          ? 'bg-accent/8 border border-accent/40'
          : 'bg-surface border border-border hover:border-border-strong hover:bg-surface-2',
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar photoUrl={persona.photoUrl} initials={initials} color={color} size={38} />
        {selected && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-accent-text" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="font-bold text-sm text-white truncate">{persona.name}</div>
        <div className="text-xs text-muted truncate">{persona.role}</div>
      </div>
    </button>
  )
}

export function Avatar({ photoUrl, initials, color, size = 40, className }) {
  return (
    <div
      className={cx('rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-white', className)}
      style={{ width: size, height: size, backgroundColor: '#1a1f2e', fontSize: size * 0.33 }}
    >
      {photoUrl ? (
        <img src={photoUrl} alt={initials} className="w-full h-full object-cover"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex') }}
        />
      ) : null}
      <span className={cx('w-full h-full flex items-center justify-center', photoUrl ? 'hidden' : '')}
        style={{ backgroundColor: color }}>
        {initials}
      </span>
    </div>
  )
}
