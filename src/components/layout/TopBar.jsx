export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base/96 backdrop-blur border-b border-border flex items-center px-5 gap-3" style={{ height: '52px' }}>
      {/* Logo + title */}
      <a href="/" className="flex items-center gap-2.5 shrink-0">
        <img src="/logo.svg" alt="NFX" className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity" />
        <span className="text-sm font-bold text-white/80 tracking-wide">Sharp Elbows</span>
      </a>

      <div className="flex-1" />

      {/* Disclaimer + credits */}
      <div className="flex flex-col items-end gap-0.5 hidden sm:flex">
        <span className="text-[10px] text-muted/50 tracking-wide uppercase">
          Unofficial AI simulator · not affiliated with NFX
        </span>
        <span className="text-[10px] text-muted/40 tracking-wide">
          Created by{' '}
          <a href="https://levitin.io" target="_blank" rel="noopener noreferrer" className="hover:text-muted/70 transition-colors">levitin.io</a>
          {' · '}
          <a href="https://github.com/teionarr/nfx-sharp-elbows" target="_blank" rel="noopener noreferrer" className="hover:text-muted/70 transition-colors">open source</a>
        </span>
      </div>
    </header>
  )
}
