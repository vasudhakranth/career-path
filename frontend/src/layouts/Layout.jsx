import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isSkillRoute = location.pathname === '/skills' || location.pathname.startsWith('/skills/')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20">
        {/* Top nav */}
        <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/30">
                {/* simple education/coding logo */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-violet-300"
                >
                  <path
                    d="M12 3L2 8l10 5 10-5-10-5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 8v8l10 5 10-5V8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="leading-tight">
                <Link to="/" className="text-xl font-bold text-white">
                  EduMind
                </Link>
                <p className="text-xs text-slate-400">AI-Powered Career Roadmaps</p>
              </div>
            </div>

            {/* Left menu items (Home / Roadmap / Skills / Projects / Resume + Tutorial links) */}
            <nav className="hidden items-center gap-4 lg:flex">
              <Link to="/" className="text-slate-300 hover:text-white">
                Home
              </Link>
              <Link to="/roadmap" className="text-slate-300 hover:text-white">
                Roadmaps
              </Link>
              <Link to="/skills" className="text-slate-300 hover:text-white">
                Skills
              </Link>
              <Link to="/projects" className="text-slate-300 hover:text-white">
                Projects
              </Link>
              <Link to="/resume" className="text-slate-300 hover:text-white">
                Resume
              </Link>

            </nav>


            {/* Center search */}
            <div className="hidden w-full max-w-md items-center md:flex">
              <div className="flex w-full items-center gap-2 rounded-full bg-slate-950/60 px-4 py-2 ring-1 ring-slate-700 focus-within:ring-violet-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-400"
                >
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search tutorials, skills..."
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Right links */}
            <nav className="hidden items-center gap-4 xl:flex">
              {user ? (
                <button
                  onClick={logout}
                  className="rounded-full border border-violet-500 px-4 py-2 text-sm text-violet-200 hover:bg-violet-500/10"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full border border-violet-500 px-4 py-2 text-sm text-violet-200 hover:bg-violet-500/10"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Category strip (show only on skill pages) */}

      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>

    </div>
  )
}
