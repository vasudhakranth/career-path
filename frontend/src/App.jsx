import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import DashboardShell from './layouts/DashboardShell'

import LandingPage from './pages/LandingPage'
import GetStartedPage from './pages/GetStartedPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SkillsHubPage from './pages/SkillsHubPage'
import SkillLearningPage from './pages/SkillLearningPage'
import CompilerPracticePage from './pages/CompilerPracticePage'
import MockInterviewPage from './pages/MockInterviewPage'
import InterviewSessionPage from './pages/InterviewSessionPage'
import InterviewReportPage from './pages/InterviewReportPage'
import ResumeBuilderPage from './pages/ResumeBuilderPage'
import SmartTimeTablePage from './pages/SmartTimeTablePage'
import SettingsPage from './pages/SettingsPage'
import AskAIPage from './pages/AskAIPage'

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
          <Route path="/skills-hub" element={<DashboardShell><SkillsHubPage /></DashboardShell>} />
          <Route
            path="/settings"
            element={
              <DashboardShell>
                <SettingsPage />
              </DashboardShell>
            }
          />

          <Route path="/skill-learning/:skill" element={<SkillLearningPage />} />
          <Route path="/compiler" element={<CompilerPracticePage />} />
          <Route
            path="/mock-interview"
            element={
              <DashboardShell>
                <MockInterviewPage />
              </DashboardShell>
            }
          />

          <Route path="/interview-session/:roleId" element={<InterviewSessionPage />} />
          <Route path="/interview-report" element={<InterviewReportPage />} />
          <Route
            path="/resume-builder"
            element={
              <DashboardShell>
                <ResumeBuilderPage />
              </DashboardShell>
            }
          />

          <Route
            path="/resume-builder/ai"
            element={
              <DashboardShell>
                <ResumeBuilderPage />
              </DashboardShell>
            }
          />

          <Route
            path="/resume-builder/manual"
            element={
              <DashboardShell>
                <ResumeBuilderPage />
              </DashboardShell>
            }
          />

          <Route
            path="/smart-time-table"
            element={
              <DashboardShell>
                <SmartTimeTablePage />
              </DashboardShell>
            }
          />

          <Route
            path="/ask-ai"
            element={
              <DashboardShell>
                <AskAIPage />
              </DashboardShell>
            }
          />

          <Route path="*" element={<div className="p-6 text-slate-600">Coming soon.</div>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

