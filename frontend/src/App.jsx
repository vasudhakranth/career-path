import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import LandingPage from './pages/LandingPage'
import GetStartedPage from './pages/GetStartedPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<div className="p-6 text-slate-600">Coming soon.</div>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

