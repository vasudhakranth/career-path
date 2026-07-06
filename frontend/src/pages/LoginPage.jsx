import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getErrorMessage = (err) => {
    if (err?.response?.data?.detail) return err.response.data.detail
    if (err?.request) return 'Unable to reach the backend server. Please make sure the API is running at http://localhost:8000.'
    return err?.message || 'Unable to sign in. Please try again.'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email: formData.email, password: formData.password })
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <span className="auth-badge">EduMind</span>
          <h1>Welcome back</h1>
          <p>Continue building your future with AI-guided career roadmaps.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
