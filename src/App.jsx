import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Flame from './pages/Flame'
import Home from './pages/Home'
import Legal from './pages/Legal'
import Docs from './pages/Docs'
import Faq from './pages/Faq'
import Opportunity from './pages/Opportunity'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/staking" element={<Navigate to="/flame" replace />} />
        <Route path="/investors" element={<Navigate to="/flame" replace />} />
        <Route path="/opportunity" element={<Opportunity />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/news" element={<Navigate to="/faq" replace />} />
        <Route path="/news/:slug" element={<Navigate to="/faq" replace />} />
        <Route path="/flame" element={<Flame />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sol-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/eth-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/contact" element={<Navigate to="/" replace />} />
        <Route path="/privacy-policy" element={<Legal kind="privacy" />} />
        <Route path="/terms-of-use" element={<Legal kind="terms" />} />
      </Route>
    </Routes>
  )
}
