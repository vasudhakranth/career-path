import { useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Mic2,
  Lightbulb,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Search,
  Bell,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import './DashboardShell.css'
import { useAuth } from '../context/AuthContext'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
  { icon: Map, label: 'Roadmaps', id: 'roadmaps', path: '/dashboard' },
  { icon: BookOpen, label: 'Skills Hub', id: 'skills-hub', path: '/skills-hub' },
  { icon: Mic2, label: 'Mock Interview', id: 'mock-interview', path: '/mock-interview' },
  { icon: Lightbulb, label: 'Project Ideas', id: 'projects', path: '/dashboard' },
  { icon: Calendar, label: 'Time Table', id: 'time-table', path: '/smart-time-table' },
  { icon: FileText, label: 'Resume Builder', id: 'resume-builder', path: '/resume-builder' },
  { icon: Settings, label: 'Settings', id: 'settings', path: '/settings' },
]

function getActiveId(pathname) {
  if (pathname.startsWith('/mock-interview')) return 'mock-interview'
  if (pathname.startsWith('/smart-time-table')) return 'time-table'
  if (pathname.startsWith('/resume-builder')) return 'resume-builder'
  return 'dashboard'
}

export default function DashboardShell({ children }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const activeId = useMemo(() => getActiveId(location.pathname), [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleSidebar = () => setSidebarOpen((v) => !v)

  const handleNavigation = (item) => {
    if (item.id === 'roadmaps' || item.id === 'dashboard' || item.id === 'projects' || item.id === 'settings') {
      // Keep Roadmap/other dashboard-internal views inside DashboardPage
      if (item.id === 'settings') navigate('/settings')
      else navigate('/dashboard')
      return
    }


    if (item.path) navigate(item.path)
  }

  return (
    <div className="dashboard-shell">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
            <div className="logo-icon">
              <Sparkles size={24} className="text-indigo-600" />
            </div>
            {sidebarOpen && <span className="logo-text">EduMind</span>}
          </div>
          <button onClick={toggleSidebar} className="toggle-btn" aria-label="Toggle sidebar">
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeId === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
                onClick={() => handleNavigation(item)}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>


      <div className="main-content">
        <header className="top-nav">
          <div className="nav-left">
            <button onClick={toggleSidebar} className="menu-btn" aria-label="Open menu">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search skills, projects, or ask anything..." />
            </div>
          </div>

          <div className="nav-right">
            <button className="ask-ai-btn" onClick={() => navigate('/ask-ai')}>
              <Sparkles size={18} /> Ask AI
            </button>
            <button className="notification-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="profile-menu">
              <button className="profile-btn" onClick={() => {}}>
                <div className="avatar">V</div>
              </button>
            </div>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </div>

    </div>
  )
}

