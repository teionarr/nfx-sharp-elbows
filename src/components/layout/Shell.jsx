import TopBar from './TopBar.jsx'
import SetupPanel from '../setup/SetupPanel.jsx'
import FeedbackPanel from '../feedback/FeedbackPanel.jsx'

export default function Shell() {
  return (
    <div className="flex flex-col h-screen bg-base">
      <TopBar />

      {/* Two-column layout below the topbar */}
      <div className="flex flex-1 overflow-hidden mt-[52px]">

        {/* Left — sticky setup panel */}
        <aside className="w-80 shrink-0 border-r border-border overflow-y-auto">
          <SetupPanel />
        </aside>

        {/* Right — scrollable feedback panel */}
        <main className="flex-1 overflow-y-auto">
          <FeedbackPanel />
        </main>

      </div>
    </div>
  )
}
