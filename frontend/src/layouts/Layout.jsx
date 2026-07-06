import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-100">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path d="M12 3L2 8l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M2 8v8l10 5 10-5V8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-lg font-semibold text-slate-900">EduMind</p>
              <p className="text-xs text-slate-500">AI Career Mentor</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={logout}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600">
                Login
              </Link>
            )}
            <Link to="/register" className="hidden rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 sm:inline-flex">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
