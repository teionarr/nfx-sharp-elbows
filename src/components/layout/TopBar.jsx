export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base/96 backdrop-blur border-b border-border flex items-center px-5 gap-3" style={{ height: '52px' }}>
      {/* Logo + title */}
      <a href="/" className="flex items-center gap-2.5 shrink-0">
        <img src="/logo.svg" alt="NFX" className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity" />
        <span className="text-sm font-bold text-white/80 tracking-wide">Sharp Elbows</span>
      </a>

      <div className="flex-1" />

      {/* Disclaimer */}
      <span className="text-[10px] text-muted/50 tracking-wide uppercase hidden sm:block">
        Unofficial AI simulator · not affiliated with NFX
      </span>
    </header>
  )
}
