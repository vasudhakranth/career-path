import { Link } from 'react-router-dom'
import './AuthPages.css'

export default function GetStartedPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <span className="auth-badge">Get Started</span>
          <h1>Ready to grow with EduMind?</h1>
          <p>Start your journey with a personalized roadmap, resume builder, and AI-powered career support.</p>
        </div>

        <div className="auth-form">
          <Link to="/register" className="auth-button" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Create an account
          </Link>
          <Link to="/login" className="auth-switch" style={{ textDecoration: 'none' }}>
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  )
}
