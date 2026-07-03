import { useEffect, useMemo, useState } from 'react'
import { getProjects, completeProject } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import PageHero from '../components/PageHero'

const difficultyClasses = {
  Beginner: 'bg-green-500/10 text-green-200',
  Intermediate: 'bg-yellow-500/10 text-yellow-200',
  Advanced: 'bg-red-500/10 text-red-200',
}

const ALL_TECH_STACKS = [
  'HTML',
  'CSS',
  'JavaScript',
  'React.js',
  'Node.js',
  'Express.js',
  'Python',
  'Django',
  'Flask',
  'FastAPI',
  'Java',
  'Spring Boot',
  'PHP',
  'Laravel',
  'SQL',
  'MySQL',
  'MongoDB',
  'Firebase',
  'Bootstrap',
  'Tailwind CSS',
]

const normalizeTech = (t) =>
  t
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const normalizeRole = (r) =>
  r
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const normalizeProjectKey = (name) => normalizeRole(name)

const TECH_SYNONYMS = {
  'node': ['node.js'],
  'react': ['react.js'],
  'postgres': ['sql'],
}

const expandTechSet = (techs) => {
  const out = new Set(techs.map(normalizeTech))
  Object.entries(TECH_SYNONYMS).forEach(([k, arr]) => {
    if (out.has(normalizeTech(k))) {
      arr.forEach((x) => out.add(normalizeTech(x)))
    }
  })
  return out
}

const PROJECT_CATALOG = [
  {
    project_name: 'Task Management API',
    description: 'Build a REST API for tasks with authentication, CRUD, and role-based access.',
    difficulty: 'Intermediate',
    technologies: ['Node.js', 'Express.js', 'MongoDB'],
    features: ['JWT authentication', 'Task CRUD with filters', 'Role-based permissions', 'Pagination + sorting'],
    learning_outcomes: ['Design clean REST endpoints', 'Implement auth and authorization', 'Handle database queries efficiently'],
    resume_impact: 'Strong backend fundamentals and security experience (auth + permissions).',
    github_structure_idea: ['/backend', '/backend/routes', '/backend/controllers', '/backend/models', '/backend/tests', '/README.md'],
  },
  {
    project_name: 'Attendance Management System',
    description: 'Create an attendance tracking system for students/employees with dashboards and reporting.',
    difficulty: 'Beginner',
    technologies: ['Python', 'Django', 'MySQL'],
    features: ['Admin dashboard', 'Attendance marking workflow', 'CSV export', 'Student-wise reports'],
    learning_outcomes: ['Build CRUD with Django', 'Create dashboards', 'Generate reports and exports'],
    resume_impact: 'Shows end-to-end CRUD + reporting and admin workflows.',
    github_structure_idea: ['/backend', '/backend/app', '/backend/app/views', '/backend/app/models', '/backend/app/tests', '/README.md'],
  },
  {
    project_name: 'E-commerce Backend',
    description: 'Develop product catalog, cart, orders, and checkout APIs for an e-commerce platform.',
    difficulty: 'Advanced',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'SQL'],
    features: ['Product catalog + search', 'Cart + order lifecycle', 'Order history per user', 'Webhook-ready design'],
    learning_outcomes: ['Model domains for e-commerce', 'Implement robust APIs', 'Design stateful workflows'],
    resume_impact: 'Demonstrates real-world backend complexity and scalable API design.',
    github_structure_idea: ['/.env.example', '/src/routes', '/src/services', '/src/models', '/src/controllers', '/src/tests', '/src/docs'],
  },
  {
    project_name: 'Resume Builder App',
    description: 'Create a resume builder with form logic, templates, and export-ready data.',
    difficulty: 'Intermediate',
    technologies: ['React.js', 'Node.js', 'MongoDB'],
    features: ['Editable sections', 'Auto-preview', 'Template selection', 'Export JSON/PDF-ready data'],
    learning_outcomes: ['State management for complex forms', 'API integration', 'Data modeling for profile content'],
    resume_impact: 'Shows product thinking + full-stack integration.',
    github_structure_idea: ['/client', '/server', '/client/components', '/server/routes', '/server/models', '/README.md'],
  },
  {
    project_name: 'Chat Application',
    description: 'Build a chat app with real-time messaging and message history.',
    difficulty: 'Advanced',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Firebase'],
    features: ['Real-time messages', 'Unread indicators', 'Message persistence', 'Auth + user profiles'],
    learning_outcomes: ['Real-time/event-driven design', 'Security for messaging', 'Schema design for chat'],
    resume_impact: 'Highlights scalable communication systems (real-time + auth).',
    github_structure_idea: ['/server', '/server/socket', '/server/routes', '/server/models', '/client', '/README.md'],
  },
  {
    project_name: 'Student Management System',
    description: 'Manage student records with enrollment, grades, and admin views.',
    difficulty: 'Beginner',
    technologies: ['Python', 'Django', 'MySQL'],
    features: ['Student CRUD', 'Grade tracking', 'Role-based admin actions', 'Reporting screens'],
    learning_outcomes: ['Django admin patterns', 'Model relationships', 'Building practical dashboards'],
    resume_impact: 'Good signal for backend CRUD + admin/reporting workflows.',
    github_structure_idea: ['/backend', '/backend/student', '/backend/templates', '/backend/static', '/backend/tests', '/README.md'],
  },
  {
    project_name: 'Job Portal',
    description: 'Build a job portal with search, saved jobs, and job application workflow.',
    difficulty: 'Intermediate',
    technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
    features: ['Job listings + filters', 'Saved jobs', 'Application flow', 'Admin management'],
    learning_outcomes: ['Design end-to-end user journeys', 'Implement search & filters', 'Build multi-collection data flows'],
    resume_impact: 'Strong full-stack project showing user flows.',
    github_structure_idea: ['/client', '/client/src/pages', '/server/src/routes', '/server/src/models', '/server/src/controllers', '/README.md'],
  },
  {
    project_name: 'Blog Platform',
    description: 'Create a blogging platform with posts, comments, and moderation.',
    difficulty: 'Intermediate',
    technologies: ['Python', 'Flask', 'MySQL'],
    features: ['Post CRUD', 'Commenting system', 'Markdown support', 'Admin moderation'],
    learning_outcomes: ['API or server-rendered patterns', 'Auth for content', 'Moderation workflows'],
    resume_impact: 'Shows content systems + auth + moderation features.',
    github_structure_idea: ['/app', '/app/routes', '/app/models', '/app/templates', '/tests', '/README.md'],
  },
  {
    project_name: 'Expense Tracker',
    description: 'Track expenses with categories, charts, budgets, and monthly reports.',
    difficulty: 'Beginner',
    technologies: ['Python', 'FastAPI', 'MongoDB'],
    features: ['Expense CRUD', 'Category budgets', 'Monthly summaries', 'CSV export'],
    learning_outcomes: ['Build clean APIs with FastAPI', 'Data aggregation', 'Reporting endpoints'],
    resume_impact: 'Good product-style backend work with analytics/reporting.',
    github_structure_idea: ['/backend/app', '/backend/app/routes', '/backend/app/schemas', '/backend/app/models', '/README.md'],
  },
  {
    project_name: 'AI Interview Assistant',
    description: 'Create an interview assistant that stores questions, answers, and feedback workflows.',
    difficulty: 'Advanced',
    technologies: ['Python', 'FastAPI', 'MongoDB'],
    features: ['Question bank', 'Mock interview sessions', 'Feedback storage', 'Resume-ready question coverage summary'],
    learning_outcomes: ['Backend for AI workflows', 'Session modeling', 'APIs for structured data'],
    resume_impact: 'Shows advanced backend + AI-adjacent workflow design.',
    github_structure_idea: ['/backend/app', '/backend/app/routes', '/backend/app/services', '/backend/app/models', '/backend/app/tests', '/README.md'],
  },
  {
    project_name: 'Portfolio Website',
    description: 'Build a modern portfolio UI with sections, projects showcase, and contact flow.',
    difficulty: 'Beginner',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Bootstrap'],
    features: ['Responsive layout', 'Project gallery', 'Contact form', 'SEO-friendly structure'],
    learning_outcomes: ['Modern UI layout', 'Responsive design', 'Client-side form handling'],
    resume_impact: 'Demonstrates clean frontend fundamentals and UI polish.',
    github_structure_idea: ['/src', '/src/components', '/src/pages', '/styles', '/README.md'],
  },
  {
    project_name: 'Admin Dashboard',
    description: 'Create an admin dashboard with charts, tables, filters, and role-based views.',
    difficulty: 'Intermediate',
    technologies: ['React.js', 'JavaScript', 'Tailwind CSS'],
    features: ['Charts + widgets', 'Filterable tables', 'Detail drawer', 'Stateful UI'],
    learning_outcomes: ['Advanced React UI patterns', 'Data visualization', 'UX for admin tools'],
    resume_impact: 'Strong UI engineering and UX for dashboards.',
    github_structure_idea: ['/client/src', '/client/src/components', '/client/src/pages', '/client/src/state', '/README.md'],
  },
  {
    project_name: 'Task Management UI',
    description: 'Design and implement a task management frontend with drag/drop and status views.',
    difficulty: 'Beginner',
    technologies: ['React.js', 'JavaScript', 'CSS', 'Tailwind CSS'],
    features: ['Task board view', 'Status filters', 'Add/edit tasks', 'Local persistence (optional)'],
    learning_outcomes: ['Component architecture', 'State management', 'Interactive UI design'],
    resume_impact: 'Great for showing frontend UI state handling.',
    github_structure_idea: ['/src/components', '/src/pages', '/src/utils', '/README.md'],
  },
  {
    project_name: 'Weather Dashboard',
    description: 'Build a weather dashboard that displays forecasts and locations with a clean UI.',
    difficulty: 'Beginner',
    technologies: ['React.js', 'JavaScript', 'Bootstrap'],
    features: ['Location search', 'Forecast display', 'User favorites', 'Clean component layout'],
    learning_outcomes: ['API integration', 'Frontend state modeling', 'UI/UX design'],
    resume_impact: 'Shows real API integration + user-friendly UI.',
    github_structure_idea: ['/src', '/src/api', '/src/components', '/README.md'],
  },
  {
    project_name: 'Sales Dashboard Analysis',
    description: 'Analyze sales datasets and generate KPI dashboards with charts and insights.',
    difficulty: 'Intermediate',
    technologies: ['Python', 'SQL'],
    features: ['Data cleaning', 'KPI calculations', 'Dashboard-ready datasets', 'Insight summary'],
    learning_outcomes: ['ETL fundamentals', 'SQL analysis', 'Insight communication'],
    resume_impact: 'Demonstrates analytics skills and KPI reporting.',
    github_structure_idea: ['/notebooks', '/sql', '/reports', '/README.md'],
  },
  {
    project_name: 'Customer Churn Prediction',
    description: 'Build an ML pipeline to predict customer churn using historical behavior data.',
    difficulty: 'Advanced',
    technologies: ['Python', 'SQL'],
    features: ['Feature engineering', 'Model training', 'Evaluation metrics', 'Prediction endpoint (optional)'],
    learning_outcomes: ['ML workflow basics', 'Model evaluation', 'Reproducible pipelines'],
    resume_impact: 'Shows end-to-end ML/data science engineering.',
    github_structure_idea: ['/notebooks', '/src', '/src/features', '/src/models', '/src/api', '/README.md'],
  },
]

const scoreCatalogProject = (catalogProject, role, techSet) => {
  const roleN = normalizeRole(role)
  const pName = normalizeProjectKey(catalogProject.project_name)
  const techs = expandTechSet(catalogProject.technologies)

  let score = 0

  // Role heuristics
  const roleRules = [
    {
      when: ['backend', 'back-end', 'server'],
      addIfAnyTechMatch: 6,
      addIfNameMatch: 2,
      nameHints: ['api', 'management', 'system', 'backend', 'cms'],
    },
    {
      when: ['frontend', 'front-end', 'ui', 'react'],
      addIfAnyTechMatch: 6,
      addIfNameMatch: 2,
      nameHints: ['ui', 'dashboard', 'website', 'frontend', 'portfolio', 'clone'],
    },
    {
      when: ['full stack', 'full-stack'],
      addIfAnyTechMatch: 7,
      addIfNameMatch: 1,
      nameHints: ['portal', 'chat', 'e-commerce', 'delivery', 'event'],
    },
    {
      when: ['data analyst', 'data', 'analyst'],
      addIfAnyTechMatch: 7,
      addIfNameMatch: 2,
      nameHints: ['analysis', 'dashboard', 'prediction', 'churn', 'trend'],
    },
  ]

  const matchedRule = roleRules.find((r) => r.when.some((kw) => roleN.includes(kw)))
  if (matchedRule) {
    const anyTech = [...techSet].some((t) => techs.has(t))
    if (anyTech) score += matchedRule.addIfAnyTechMatch

    if (matchedRule.nameHints.some((h) => pName.includes(normalizeRole(h)))) score += matchedRule.addIfNameMatch
  }

  // Tech overlap
  const overlapCount = [...techSet].filter((t) => techs.has(t)).length
  score += overlapCount * 3

  // If no tech provided, lightly rank by role-name fit
  if (techSet.size === 0) {
    if (roleN.includes('backend') && /api|backend|system|management/.test(pName)) score += 5
    if ((roleN.includes('frontend') || roleN.includes('react') || roleN.includes('ui')) && /dashboard|website|ui|portfolio/.test(pName)) score += 5
    if (roleN.includes('data') && /analysis|dashboard|prediction|churn|trend/.test(pName)) score += 5
  }

  return score
}

const normalizeToCatalogTech = (tech) => {
  const n = normalizeTech(tech)
  // Keep canonical from ALL_TECH_STACKS by normalized match
  const hit = ALL_TECH_STACKS.find((x) => normalizeTech(x) === n)
  return hit || tech
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  // Recommendation inputs
  const [roleInput, setRoleInput] = useState('')
  const [selectedTechs, setSelectedTechs] = useState([])
  const [recommended, setRecommended] = useState([])

  // Project details modal state
  const [activeProject, setActiveProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Tech dropdown
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false)

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data)).catch(() => setProjects([]))
  }, [])

  const completedSet = new Set(user?.completed_projects || [])

  const backendProjectByName = useMemo(() => {
    const m = new Map()
    projects.forEach((p) => m.set(normalizeProjectKey(p.project_name), p))
    return m
  }, [projects])

  const techSet = useMemo(() => new Set(selectedTechs.map(normalizeTech)), [selectedTechs])

  const recommend = () => {
    const role = roleInput.trim()
    const inputTechs = selectedTechs.map(normalizeToCatalogTech)
    const tset = expandTechSet(inputTechs)

    const scored = PROJECT_CATALOG.map((p) => ({
      project: p,
      score: scoreCatalogProject(p, role, tset),
    }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.project)

    const unique = []
    const seen = new Set()
    for (const p of scored) {
      const key = normalizeProjectKey(p.project_name)
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(p)
      }
      if (unique.length >= 10) break
    }

    setRecommended(unique)
  }

  const handleToggleTech = (tech) => {
    const canonical = normalizeToCatalogTech(tech)
    setSelectedTechs((prev) => {
      const exists = prev.some((t) => normalizeTech(t) === normalizeTech(canonical))
      if (exists) return prev.filter((t) => normalizeTech(t) !== normalizeTech(canonical))
      return [...prev, canonical]
    })
  }

  const handleComplete = async (projectId) => {
    try {
      await completeProject(projectId)
      setMessage('Project marked as completed successfully.')
      setProjects((prev) => [...prev])
    } catch {
      setMessage('Unable to complete project. Please login and try again.')
    }
  }

  const openDetails = (project) => {
    setActiveProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setActiveProject(null)
  }

  const modalCompleted = useMemo(() => {
    if (!activeProject) return false
    const key = normalizeProjectKey(activeProject.project_name)
    const backend = backendProjectByName.get(key)
    if (!backend) return false
    return completedSet.has(backend.id)
  }, [activeProject, backendProjectByName, completedSet])

  return (
    <div className="space-y-8">
      {/* Top Section / Hero / Search Area */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <p className="mt-3 text-slate-400">Recommend hands-on projects using your role and selected technologies.</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1fr_auto] lg:items-end">
          <div>
            <label className="text-sm font-semibold text-slate-300">Search role</label>
            <input
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="Enter a role (e.g. Backend Developer, Frontend Developer, Data Analyst...)"
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300">Tech Stack (multi-select)</label>

            <div className="relative mt-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setIsTechDropdownOpen((v) => !v)}
                className="w-full text-left"
                aria-haspopup="listbox"
                aria-expanded={isTechDropdownOpen}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {selectedTechs.length === 0 ? (
                    <span className="text-xs text-slate-500">Select technologies…</span>
                  ) : (
                    selectedTechs.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200 border border-violet-500/30"
                      >
                        {tech}
                        <span
                          role="button"
                          tabIndex={0}
                          aria-label={`Remove ${tech}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleTech(tech)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              e.stopPropagation()
                              handleToggleTech(tech)
                            }
                          }}
                          className="-mr-0.5 cursor-pointer text-violet-200/90"
                        >
                          ✕
                        </span>
                      </span>
                    ))
                  )}

                  <span className="ml-auto text-slate-400 text-sm">▾</span>
                </div>
              </button>

              {/* Dropdown */}
              {isTechDropdownOpen && (
                <div
                  className="absolute left-3 right-3 z-20 mt-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 shadow-2xl shadow-black/30"
                  role="listbox"
                >
                  <div className="max-h-56 overflow-auto pr-1">
                    {ALL_TECH_STACKS.map((tech) => {
                      const active = selectedTechs.some((t) => normalizeTech(t) === normalizeTech(tech))
                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => handleToggleTech(tech)}
                          className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-slate-900"
                        >
                          <span className={`text-sm font-semibold ${active ? 'text-violet-200' : 'text-slate-300'}`}>{tech}</span>
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded border text-xs font-bold transition ${
                              active
                                ? 'border-violet-500/50 bg-violet-500/20 text-violet-200'
                                : 'border-slate-700 bg-slate-900/40 text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    {selectedTechs.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setSelectedTechs([])}
                        className="text-xs font-semibold text-slate-300 hover:text-white"
                      >
                        Clear
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">Choose one or multiple technologies.</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsTechDropdownOpen(false)}
                      className="text-xs font-semibold text-violet-200 hover:text-white"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={recommend}
            className="h-[48px] w-full rounded-xl bg-violet-500 hover:bg-violet-400 px-5 py-3 font-semibold text-white lg:w-auto"
          >
            Recommend Projects
          </button>
        </div>
      </div>

      {/* Suggested Prompt Box */}
      <div className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-5 text-violet-200">
        <p className="text-sm font-semibold">Suggested prompt</p>
        <p className="mt-2 text-sm text-violet-100">
          Enter your target role and choose technologies you want to work with. EduMind will recommend the best projects to strengthen your resume and help you prepare for interviews.
        </p>
      </div>

      {message && <div className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-4 text-violet-200">{message}</div>}

      <PageHero caption="Track hands-on projects and complete your portfolio." />

      {/* Recommendations Area */}
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Recommended Projects</h2>
          <div className="text-sm text-slate-400">
            {recommended.length > 0 ? `${recommended.length} suggestions` : 'Use the form above to generate recommendations.'}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {recommended.map((project) => {
            const key = normalizeProjectKey(project.project_name)
            const backend = backendProjectByName.get(key)
            const isCompleted = backend ? completedSet.has(backend.id) : false

            return (
              <div key={key}>
                <Card title={project.project_name} description={project.description}>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        difficultyClasses[project.difficulty] || 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      {project.difficulty}
                    </span>
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() => openDetails(project)}
                      className="inline-flex rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      View Details
                    </button>

                    {backend ? (
                      <button
                        onClick={() => handleComplete(backend.id)}
                        disabled={isCompleted}
                        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white ${
                          isCompleted ? 'bg-slate-600 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-400'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Mark as Completed'}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">(Not found in EduMind backend dataset)</span>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeModal}>
          <div
            className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-black/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{activeProject.project_name}</h3>
                <p className="mt-2 text-slate-300">{activeProject.description}</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyClasses[activeProject.difficulty] || 'bg-slate-700 text-slate-100'}`}>
                {activeProject.difficulty}
              </span>
              {activeProject.technologies.map((tech) => (
                <span key={tech} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-sm font-semibold text-white">Features</p>
                <ul className="mt-3 space-y-2 text-slate-300">
                  {activeProject.features?.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-violet-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-sm font-semibold text-white">Learning Outcomes</p>
                <ul className="mt-3 space-y-2 text-slate-300">
                  {activeProject.learning_outcomes?.map((o) => (
                    <li key={o} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 lg:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Resume Impact</p>
                    <p className="mt-2 text-slate-300">{activeProject.resume_impact}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Completion</p>
                    {(() => {
                      const key = normalizeProjectKey(activeProject.project_name)
                      const backend = backendProjectByName.get(key)
                      if (!backend) return <p className="mt-1 text-xs text-slate-500">No backend mapping</p>
                      return (
                        <button
                          onClick={() => handleComplete(backend.id)}
                          disabled={modalCompleted}
                          className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white ${
                            modalCompleted ? 'bg-slate-600 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-400'
                          }`}
                        >
                          {modalCompleted ? 'Completed' : 'Mark as Completed'}
                        </button>
                      )
                    })()}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-white">GitHub structure idea</p>
                  <div className="mt-2 rounded-xl bg-slate-950/70 border border-slate-800 px-4 py-3">
                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                      {activeProject.github_structure_idea?.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

