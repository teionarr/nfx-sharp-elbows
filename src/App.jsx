import { HashRouter, Routes, Route } from 'react-router-dom'
import { SimulationProvider } from './hooks/useSimulation.js'
import HomePage from './pages/HomePage.jsx'
import SnapshotPage from './pages/SnapshotPage.jsx'

export default function App() {
  return (
    <HashRouter>
      <SimulationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/snapshot" element={<SnapshotPage />} />
        </Routes>
      </SimulationProvider>
    </HashRouter>
  )
}
