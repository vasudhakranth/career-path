import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import RoadmapPage from './RoadmapPage'
import SkillsHubPage from './SkillsHubPage'
import AiChatModal from '../components/AiChatModal'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Mic2,
  Lightbulb,
  Calendar,
  FileText,
  Settings,
  Search,
  Bell,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Code2,
  Database,
  GitBranch,
  Cloud,
  Brain,
  BarChart3,
  Clock,
  User,
  LogOut,
} from 'lucide-react'
import './DashboardPage.css'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Map, label: 'Roadmaps', id: 'roadmaps' },
  { icon: BookOpen, label: 'Skills Hub', id: 'skills' },
  { icon: Mic2, label: 'Mock Interview', id: 'interview' },
  { icon: Lightbulb, label: 'Project Ideas', id: 'projects' },
  { icon: Calendar, label: 'Time Table', id: 'timetable' },
  { icon: FileText, label: 'Resume Builder', id: 'resume' },
  { icon: Settings, label: 'Settings', id: 'settings' },
]

const skillsCatalog = [
  {
    name: 'Python',
    icon: Code2,
    difficulty: 'Intermediate',
    description: 'Learn Python programming basics and advanced concepts',
  },
  {
    name: 'SQL',
    icon: Database,
    difficulty: 'Beginner',
    description: 'Master database queries and management',
  },
  {
    name: 'JavaScript',
    icon: Code2,
    difficulty: 'Beginner',
    description: 'Frontend and backend JavaScript development',
  },
  {
    name: 'React',
    icon: Code2,
    difficulty: 'Intermediate',
    description: 'Build modern UI with React.js',
  },
  {
    name: 'Node.js',
    icon: Code2,
    difficulty: 'Intermediate',
    description: 'Backend development with Node.js',
  },
  {
    name: 'Git & GitHub',
    icon: GitBranch,
    difficulty: 'Beginner',
    description: 'Version control and collaboration',
  },
  {
    name: 'MongoDB',
    icon: Database,
    difficulty: 'Intermediate',
    description: 'NoSQL database design and queries',
  },
  {
    name: 'Machine Learning',
    icon: Brain,
    difficulty: 'Advanced',
    description: 'ML algorithms and implementations',
  },
  {
    name: 'AI',
    icon: Sparkles,
    difficulty: 'Advanced',
    description: 'Artificial Intelligence fundamentals',
  },
  {
    name: 'Cloud Computing',
    icon: Cloud,
    difficulty: 'Intermediate',
    description: 'AWS, Azure, and cloud platforms',
  },
]

const recentActivities = [
  { activity: 'Completed Python Module 5', time: '2 hours ago', icon: BookOpen },
  { activity: 'Solved 3 coding challenges', time: '4 hours ago', icon: Code2 },
  { activity: 'Updated Resume Profile', time: '1 day ago', icon: FileText },
  { activity: 'Attended Mock Interview', time: '2 days ago', icon: Mic2 },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // Keep sidebar state resilient across route changes
  const openSidebar = () => setSidebarOpen(true)

  const [profileOpen, setProfileOpen] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [aiOpen, setAiOpen] = useState(false)
  const carouselRef = useRef(null)

  const handleNavigation = (itemId) => {
    // Keep sidebar usable by default: open it when navigating away from the dashboard-internal views.
    if (itemId) setSidebarOpen(true)

    if (itemId === 'interview') {
      navigate('/mock-interview')
    } else if (itemId === 'skills') {
      setActiveView('skills')
    } else if (itemId === 'roadmaps') {
      setActiveView('roadmaps')
    } else if (itemId === 'resume') {
      navigate('/resume-builder')
    } else if (itemId === 'timetable') {
      navigate('/smart-time-table')
    } else {
      setActiveView(itemId)
    }
  }


  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const startedSkillNames = Array.isArray(user?.completed_skills)
    ? user.completed_skills
        .map((skill) => typeof skill === 'string' ? skill : skill?.skill_name || skill?.name || '')
        .filter(Boolean)
    : []

  const skillProgressMap = {
    Python: 72,
    SQL: 45,
    JavaScript: 58,
    React: 68,
    'Node.js': 52,
    'Git & GitHub': 85,
    MongoDB: 64,
    'Machine Learning': 38,
    AI: 32,
    'Cloud Computing': 42,
  }

  const recommendedSkillCards = skillsCatalog.map((skill) => ({
    ...skill,
    started: startedSkillNames.includes(skill.name),
    progress: startedSkillNames.includes(skill.name) ? skillProgressMap[skill.name] || 0 : 0,
  }))

  const userName = user?.name || 'there'
  const userInitial = (user?.name || 'U').charAt(0).toUpperCase()
  const supportedProgress = Number(user?.resume_completion || 0)
  const roadmapProgress = Number(user?.roadmap_completion || 0)
  const skillProgress = startedSkillNames.length > 0
    ? Math.min(100, Math.round((startedSkillNames.length / Math.max(skillsCatalog.length, 1)) * 100))
    : 0
  const careerProgress = Math.min(100, Math.round((supportedProgress + roadmapProgress + skillProgress) / 3))

  return (
    <div className="dashboard-page">
      {/* Left Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Sparkles size={24} className="text-indigo-600" />
            </div>
            {sidebarOpen && <span className="logo-text">EduMind</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

<nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
                onClick={() => handleNavigation(item.id)}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="nav-item sidebar-logout-btn"
            onClick={() => { logout(); navigate('/'); }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Navigation */}
        <header className="top-nav">
          <div className="nav-left">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-btn">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search skills, projects, or ask anything..." />
            </div>
          </div>

          <div className="nav-right">
            <button className="ask-ai-btn" type="button" onClick={() => setAiOpen(true)}>
              <Sparkles size={18} />
              Ask AI
            </button>
            <button className="notification-btn" type="button">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="profile-menu">
              <button
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="avatar">{userInitial}</div>
              </button>
              {profileOpen && (
                <div className="dropdown-menu">
                  <a href="#profile">
                    <User size={18} />
                    Profile
                  </a>
                  <a href="#settings">
                    <Settings size={18} />
                    Settings
                  </a>
                  <hr />
                  <a href="#logout">
                    <LogOut size={18} />
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {activeView === 'roadmaps' ? (
            <RoadmapPage />
          ) : activeView === 'skills' ? (
            <SkillsHubPage />
          ) : (
            <>
          {/* Welcome Banner */}
          <section className="welcome-section">
            <div className="welcome-banner">
              <div>
                <h1 className="welcome-title">Welcome back, {userName}! 👋</h1>
                <p className="welcome-subtitle">You're making great progress on your career journey</p>
              </div>
              <button className="continue-btn">
                Continue Learning
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Career Progress Card */}
            <div className="progress-card">
              <div className="progress-header">
                <h3>Career Progress</h3>
                <TrendingUp size={20} className="text-emerald-500" />
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${careerProgress}%` }}
                  />
                </div>
              </div>
              <div className="progress-text">
                <span className="progress-value">{careerProgress}%</span>
                <span className="progress-label">to your next milestone</span>
              </div>
            </div>
          </section>

          {/* Skills Carousel Section */}
          <section className="skills-section">
            <div className="section-header">
              <h2>Recommended Skills</h2>
              <p>Continue building your career with these skills</p>
            </div>

            <div className="carousel-container">
              <button
                className="carousel-btn carousel-btn-left"
                onClick={() => scroll('left')}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="carousel" ref={carouselRef}>
                {recommendedSkillCards.map((skill) => {
                  const IconComponent = skill.icon
                  const difficultyColor =
                    skill.difficulty === 'Beginner'
                      ? 'text-green-500'
                      : skill.difficulty === 'Intermediate'
                        ? 'text-blue-500'
                        : 'text-red-500'

                  const progressColor =
                    skill.progress >= 70
                      ? 'bg-emerald-500'
                      : skill.progress >= 40
                        ? 'bg-blue-500'
                        : 'bg-orange-500'

                  return (
                    <div key={skill.name} className="skill-card">
                      <div className="skill-icon">
                        <IconComponent size={28} />
                      </div>
                      <h3 className="skill-name">{skill.name}</h3>
                      <p className={`skill-difficulty ${difficultyColor}`}>
                        {skill.difficulty}
                      </p>
                      <p className="skill-description">{skill.description}</p>

                      <div className="skill-progress">
                        <div className="progress-bar-small">
                          <div
                            className={`progress-fill-small ${progressColor}`}
                            style={{ width: `${skill.progress}%` }}
                          />
                        </div>
                        <span className="progress-percent">{skill.progress}%</span>
                      </div>

                      <button className="continue-learning-btn">
                        {skill.started ? 'Continue Learning' : 'Start Learning'}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>

              <button
                className="carousel-btn carousel-btn-right"
                onClick={() => scroll('right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </section>

          {/* Bottom Section */}
          <section className="bottom-section">
            {/* Recent Activity */}
            <div className="activity-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentActivities.map((item, index) => {
                  const ActivityIcon = item.icon
                  return (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <ActivityIcon size={18} />
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">{item.activity}</p>
                        <p className="activity-time">
                          <Clock size={14} />
                          {item.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="progress-chart-card">
              <h3>Weekly Progress</h3>
              <div className="chart-placeholder">
                <BarChart3 size={48} className="text-indigo-300" />
                <p>Your weekly learning chart</p>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="recommendations-card">
              <h3>AI Recommendations</h3>
              <div className="recommendation-item">
                <Sparkles size={20} className="text-indigo-600" />
                <div>
                  <p className="recommendation-title">Master React Hooks</p>
                  <p className="recommendation-desc">Based on your progress, you're ready for advanced React concepts</p>
                </div>
              </div>
              <div className="recommendation-item">
                <Brain size={20} className="text-purple-600" />
                <div>
                  <p className="recommendation-title">Start Machine Learning</p>
                  <p className="recommendation-desc">Your Python skills are strong enough to begin ML journey</p>
                </div>
              </div>
            </div>
          </section>
            </>
          )}
        </div>

        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-section">
              <a href="#about">About</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-section">
              <a href="#github">GitHub</a>
              <a href="#linkedin">LinkedIn</a>
            </div>
            <div className="footer-copyright">
              <p>© 2026 EduMind. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      <AiChatModal open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}
