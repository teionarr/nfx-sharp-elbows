import { useState, useRef, useCallback } from 'react'
import { cx } from '../../utils.js'

export default function FileDropZone({ onFile, accept, children, className }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = useCallback(e => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }, [onFile])

  const handleDragOver  = useCallback(e => { e.preventDefault(); setDragging(true) }, [])
  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleChange = useCallback(e => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }, [onFile])

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cx(
        'cursor-pointer rounded border transition-all duration-150',
        dragging
          ? 'border-accent bg-accent/6 shadow-gold'
          : 'border-dashed border-border hover:border-accent/40 hover:bg-surface',
        className,
      )}
    >
      {children}
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="sr-only" />
    </div>
  )
}
