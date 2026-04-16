import { cx } from '../../utils.js'

const variants = {
  primary: 'bg-accent hover:bg-accent-dim text-accent-text border border-accent/80 font-bold',
  ghost:   'bg-transparent hover:bg-subtle text-white border border-border hover:border-border-strong',
  danger:  'bg-transparent hover:bg-danger/10 text-red-400 border border-danger/30',
  muted:   'bg-surface-2 hover:bg-surface-3 text-muted border border-border',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-7 py-3 text-base',
}

export default function Button({
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center gap-2 rounded transition-all duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner />
          {children}
        </span>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
