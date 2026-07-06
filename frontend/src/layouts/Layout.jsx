import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isSkillRoute = location.pathname === '/skills' || location.pathname.startsWith('/skills/')

  const SidebarLink = ({ to, label, isActive }) => (
    <Link

      to={to}
      className={
        'group flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-semibold transition ' +
        (isActive
          ? 'bg-violet-500/15 ring-1 ring-violet-500/40 text-violet-200'
          : 'text-slate-300 hover:bg-slate-900/60 hover:text-white')
      }
    >
      <span>{label}</span>
      <span className="text-xs text-slate-500 group-hover:text-slate-300">›</span>
    </Link>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      <header className="sticky top-0 z-20">
        {/* Top nav */}
        <div className="border-b border-slate-200 bg-white/90 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-200">
                {/* simple education/coding logo */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
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
                <Link to="/" className="text-xl font-bold text-slate-900">
                  EduMind
                </Link>
                <p className="text-xs text-slate-500">AI-Powered Career Roadmaps</p>
              </div>
            </div>

            {/* Right links */}
            <nav className="hidden items-center gap-4 xl:flex">
              {user ? (
                <button
                  onClick={logout}
                  className="rounded-full border border-blue-200 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full border border-blue-200 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Category strip (show only on skill pages) */}
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-10 lg:grid-cols-[260px_1fr]">
        {/* Left sidebar */}
        <aside className="hidden lg:order-1 lg:block">
          <div className="sticky top-[96px] rounded-3xl border border-slate-200 bg-white/80 p-4">
            <nav className="space-y-1" />
          </div>
        </aside>

        <main className="order-1 lg:order-2">{children}</main>
      </div>


    </div>
  )
}
