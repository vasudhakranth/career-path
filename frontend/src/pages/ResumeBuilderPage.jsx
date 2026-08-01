import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  AlertCircle,
  Bot,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  Database,
  Download,
  FileText,
  Layers3,
  Maximize2,
  MonitorPlay,
  Printer,
  RefreshCw,
  Save,
  Share2,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react'
import ResumeBuilder from '../components/ResumeBuilder'
import ResumePreview from '../components/ResumePreview'
import { uploadResumeFile } from '../services/api'

const roleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Python Developer',
  'Java Developer',
  'React Developer',
  'Flutter Developer',
  'Data Analyst',
  'DevOps Engineer',
  'UI/UX Designer',
]

const companyOptions = [
  'Google',
  'Microsoft',
  'Amazon',
  'Infosys',
  'TCS',
  'Accenture',
  'Deloitte',
  'IBM',
  'Zoho',
  'Flipkart',
  'Capgemini',
  'Meta',
]

const projectSuggestions = {
  'Frontend Developer': [
    { title: 'Portfolio Website', difficulty: 'Intermediate', stack: 'React • Tailwind • Framer Motion', time: '5 days' },
    { title: 'E-Commerce Website', difficulty: 'Advanced', stack: 'React • Redux • Node.js', time: '10 days' },
    { title: 'AI Dashboard', difficulty: 'Advanced', stack: 'Next.js • TypeScript • Chart.js', time: '8 days' },
  ],
  'Backend Developer': [
    { title: 'API Gateway', difficulty: 'Intermediate', stack: 'Node.js • Express • MongoDB', time: '7 days' },
    { title: 'Realtime Chat System', difficulty: 'Advanced', stack: 'Socket.io • Redis • PostgreSQL', time: '11 days' },
    { title: 'Microservices Platform', difficulty: 'Advanced', stack: 'FastAPI • Docker • Kafka', time: '12 days' },
  ],
  'Full Stack Developer': [
    { title: 'Task Manager', difficulty: 'Intermediate', stack: 'React • Express • MongoDB', time: '6 days' },
    { title: 'Learning Platform', difficulty: 'Advanced', stack: 'Next.js • Prisma • Supabase', time: '9 days' },
    { title: 'SaaS Dashboard', difficulty: 'Advanced', stack: 'Vite • Node.js • Postgres', time: '10 days' },
  ],
  'Python Developer': [
    { title: 'Automation Toolkit', difficulty: 'Intermediate', stack: 'Python • Flask • SQLite', time: '6 days' },
    { title: 'Data Pipeline', difficulty: 'Advanced', stack: 'Python • Pandas • Airflow', time: '9 days' },
    { title: 'ML Experiment Studio', difficulty: 'Advanced', stack: 'Python • Scikit-learn • Streamlit', time: '10 days' },
  ],
  'Data Analyst': [
    { title: 'Sales Insights Dashboard', difficulty: 'Intermediate', stack: 'SQL • Power BI • Python', time: '6 days' },
    { title: 'Customer Analytics App', difficulty: 'Advanced', stack: 'Python • Tableau • Snowflake', time: '9 days' },
    { title: 'ETL Automation Suite', difficulty: 'Advanced', stack: 'SQL • Pandas • Airflow', time: '8 days' },
  ],
  'UI/UX Designer': [
    { title: 'Design System Library', difficulty: 'Intermediate', stack: 'Figma • Design Tokens • Storybook', time: '5 days' },
    { title: 'Mobile App Redesign', difficulty: 'Advanced', stack: 'Figma • Framer • Principle', time: '8 days' },
    { title: 'Product Landing Experience', difficulty: 'Advanced', stack: 'Figma • Prototyping • Motion', time: '7 days' },
  ],
}

const emptyResumeData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  github: '',
  portfolio: '',
  careerObjective: '',
  skills: [],
  education: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
  languages: [],
  interests: '',
}

const steps = ['Reading Resume', 'Extracting Skills', 'Matching Company Requirements', 'Identifying Missing Keywords', 'Improving Formatting', 'Enhancing Resume Content', 'Optimizing ATS Compatibility', 'Generating Final Resume']

const resumePageTheme = `
  .resume-page-shell { background: #ffffff !important; color: #0f172a; }
  .resume-page-shell .bg-slate-950,
  .resume-page-shell .bg-slate-900,
  .resume-page-shell .bg-slate-900\/80,
  .resume-page-shell .bg-slate-900\/70,
  .resume-page-shell .bg-slate-900\/50,
  .resume-page-shell .bg-slate-800,
  .resume-page-shell .bg-slate-800\/50,
  .resume-page-shell .bg-slate-800\/40,
  .resume-page-shell .bg-slate-950\/80,
  .resume-page-shell .bg-slate-950\/70,
  .resume-page-shell .bg-slate-950\/60 { background-color: #ffffff !important; }
  .resume-page-shell .border-slate-800,
  .resume-page-shell .border-slate-700,
  .resume-page-shell .border-slate-600,
  .resume-page-shell .border-slate-750 { border-color: #e8ecf6 !important; }
  .resume-page-shell .text-slate-100,
  .resume-page-shell .text-slate-200,
  .resume-page-shell .text-slate-300,
  .resume-page-shell .text-slate-400,
  .resume-page-shell .text-slate-500,
  .resume-page-shell .text-slate-600 { color: #0f172a !important; }
  .resume-page-shell .text-slate-900 { color: #0f172a !important; }
  .resume-page-shell .text-white { color: #ffffff !important; }
  .resume-page-shell .shadow-2xl,
  .resume-page-shell .shadow-black\/20,
  .resume-page-shell .shadow-black\/10 { box-shadow: 0 18px 40px -24px rgba(148, 163, 184, 0.54) !important; }
  .resume-page-shell select,
  .resume-page-shell input,
  .resume-page-shell textarea { background-color: #ffffff !important; color: #0f172a !important; border-color: #d9e2f0 !important; }
  .resume-page-shell .bg-slate-50 { background-color: #f8fafc !important; }
  .resume-page-shell .hover\:bg-slate-100:hover { background-color: #f4f7fb !important; }
  .resume-page-shell .bg-white { background-color: #ffffff !important; }
  .resume-page-shell .text-slate-700 { color: #475569 !important; }
  .resume-page-shell .bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_40%),linear-gradient(135deg,_#f8fbff_0%,_#eef2ff_45%,_#f8fafc_100%)] { background: #ffffff !important; }
`

function ResumeBuilderPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const carouselRef = useRef(null)
  const progressTimerRef = useRef(null)
  const [selectedRole, setSelectedRole] = useState('Frontend Developer')
  const [selectedCompany, setSelectedCompany] = useState('Google')
  const [resumeFile, setResumeFile] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progressStep, setProgressStep] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Preparing your resume workflow')
  const [generatedResume, setGeneratedResume] = useState(null)
  const [resumeData, setResumeData] = useState(emptyResumeData)
  const [analysisData, setAnalysisData] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const isAiView = location.pathname === '/resume-builder/ai'
  const isManualView = location.pathname === '/resume-builder/manual'
  const isLandingView = location.pathname === '/resume-builder' || location.pathname === '/resume-builder/'

  // Progress bar animation - runs independently while isGenerating is true
  useEffect(() => {
    if (!isGenerating) {
      return undefined
    }

    if (progressStep >= steps.length) {
      // Don't setIsGenerating(false) here - that's handled by the API call's finally block
      setProgressLabel('Finalizing...')
      return undefined
    }

    progressTimerRef.current = window.setTimeout(() => {
      setProgressLabel(steps[progressStep])
      setProgressStep((value) => value + 1)
    }, 900)

    return () => {
      if (progressTimerRef.current) {
        window.clearTimeout(progressTimerRef.current)
      }
    }
  }, [isGenerating, progressStep])

  const suggestedProjects = useMemo(() => projectSuggestions[selectedRole] || projectSuggestions['Frontend Developer'], [selectedRole])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const analyzeUploadedResume = async () => {
    if (!resumeFile) {
      setErrorMessage('Please upload a resume file first (PDF or DOCX).')
      return
    }

    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('resume_file', resumeFile)
      formData.append('role', selectedRole)
      formData.append('company', selectedCompany)

      console.log('[ResumeBuilder] Calling uploadResumeFile API...')
      console.log('[ResumeBuilder] File:', resumeFile.name, 'Role:', selectedRole, 'Company:', selectedCompany)

      const response = await uploadResumeFile(formData)
      console.log('[ResumeBuilder] API Response received:', response.status)

      const uploadedResume = response?.data?.resume_data || null
      const analysis = response?.data?.analysis || null

      if (!uploadedResume || !analysis) {
        throw new Error('The upload response did not include a parsed resume or ATS analysis payload.')
      }

      console.log('[ResumeBuilder] Setting generated resume and analysis data')
      setGeneratedResume(uploadedResume)
      setResumeData(uploadedResume)
      setAnalysisData(analysis)
    } catch (error) {
      console.error('[ResumeBuilder] Resume analysis failed:', error)
      const errorMsg = error?.response?.data?.detail || error.message || 'Unknown error occurred'
      setErrorMessage(`Resume analysis failed: ${errorMsg}`)
      setGeneratedResume(null)
      setResumeData(emptyResumeData)
      setAnalysisData({
        ats_score: 0,
        missing_keywords: [],
        matched_keywords: [],
        skill_gap_analysis: ['The uploaded file could not be analyzed. Please upload a valid PDF or DOCX file.'],
        recommended_skills: [],
        recommended_projects: [],
        recommended_certifications: [],
        resume_strengths: [],
        areas_for_improvement: ['Retry with a clean PDF or DOCX resume.'],
        improvement_summary: ['The uploaded resume could not be parsed. No demo resume data is shown.'],
        keywords: [],
      })
    }
  }

  const handleGenerate = async () => {
    setProgressStep(0)
    setProgressLabel(steps[0])
    setIsGenerating(true)
    setGeneratedResume(null)
    setAnalysisData(null)

    try {
      await analyzeUploadedResume()
    } finally {
      setIsGenerating(false)
    }
  }

  const handleScrollProjects = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' })
    }
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const score = analysisData?.ats_score ?? 92
  const scoreTone = score >= 90 ? 'text-emerald-500' : score >= 80 ? 'text-amber-500' : 'text-rose-500'
  const displayProjects = analysisData?.recommended_projects || suggestedProjects
  const displaySkills = analysisData?.recommended_skills || []
  const aiResultVisible = Boolean(generatedResume || analysisData)
  const previewData = generatedResume || resumeData || emptyResumeData

  if (isLandingView) {
    return (
      <div className="resume-page-shell min-h-screen bg-white px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <style>{resumePageTheme}</style>
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)] sm:p-10 lg:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                  AI Resume Studio
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Build an ATS-Friendly
                </h1>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  Create a professional resume from scratch or upload your existing resume and let AI optimize it for your dream company with ATS compatibility analysis, scoring, and recommendations.
                </p>
              </div>
              <button
                onClick={() => navigate('/resume-builder/ai')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
              >
                Start with AI Optimizer
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <article className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-7 text-slate-800 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)] transition duration-300 hover:-translate-y-1 hover:border-indigo-200">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_55%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                    <Upload className="h-7 w-7" />
                  </div>
                  <h2 className="text-3xl font-semibold">Upload Resume</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                    Upload your existing resume and let AI analyze, optimize, and rebuild it into a professional ATS-friendly resume tailored to your target company.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/resume-builder/ai')}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition group-hover:scale-[1.02]"
                >
                  Upload Resume
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)] transition duration-300 hover:-translate-y-1 hover:border-indigo-200">
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
                    <FileText className="h-7 w-7" />
                  </div>
                  <h2 className="text-3xl font-semibold text-slate-900">Build Resume Manually</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                    Create a professional ATS-friendly resume from scratch with AI assistance and a real-time live preview to keep every section polished.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/resume-builder/manual')}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition group-hover:scale-[1.02]"
                >
                  Start Building
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          </section>
        </div>
      </div>
    )
  }

  if (isAiView) {
    return (
      <div className="resume-page-shell min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
        <style>{resumePageTheme}</style>
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
            <div>
              <button onClick={() => navigate('/resume-builder')} className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                <ChevronLeft className="h-4 w-4" />
                Back to resume options
              </button>
              <h1 className="text-3xl font-semibold text-slate-900">AI Resume Optimizer</h1>
              <p className="mt-1 text-sm text-slate-500">Optimize your resume for any company with AI-powered ATS analysis.</p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Live AI workflow
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Step 1', label: 'Upload Resume', desc: 'PDF or DOCX files are supported.', icon: Upload, iconClass: 'bg-indigo-500/15 text-indigo-600' },
              { title: 'Step 2', label: 'Target Role', desc: 'Tailor the resume for the role you want.', icon: BrainCircuit, iconClass: 'bg-cyan-500/15 text-cyan-600' },
              { title: 'Step 3', label: 'Target Company', desc: 'Add role-specific company keywords.', icon: MonitorPlay, iconClass: 'bg-fuchsia-500/15 text-fuchsia-600' },
            ].map((step) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${step.iconClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{step.title}</p>
                      <h2 className="text-lg font-semibold text-slate-900">{step.label}</h2>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              )
            })}
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-indigo-400 hover:bg-white">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-lg font-semibold text-slate-900">Drag & drop or browse files</p>
                <p className="mt-2 text-sm text-slate-500">PDF, DOCX</p>
                <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
              </label>
              {resumeFile && <p className="mt-3 text-sm text-emerald-600">Loaded: {resumeFile.name}</p>}
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
              <div className="mb-4">
                <p className="text-sm text-slate-500">Target role</p>
                <h2 className="text-lg font-semibold text-slate-900">Choose the role you want to optimize for</h2>
              </div>
              <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0">
                {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
              <div className="mb-4">
                <p className="text-sm text-slate-500">Target company</p>
                <h2 className="text-lg font-semibold text-slate-900">Tailor keywords for the right employer</h2>
              </div>
              <select value={selectedCompany} onChange={(event) => setSelectedCompany(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0">
                {companyOptions.map((company) => <option key={company} value={company}>{company}</option>)}
              </select>
            </section>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-5 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isGenerating ? <><Sparkles className="h-5 w-5 animate-pulse" /> Processing resume...</> : <><Wand2 className="h-5 w-5" /> Generate ATS-Friendly Resume</>}
            </button>

            {isGenerating && (
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
                <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
                  <span>AI workflow</span>
                  <span className="text-cyan-700">{progressLabel}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all" style={{ width: `${Math.min(100, ((progressStep + 1) / steps.length) * 100)}%` }} />
                </div>
              </div>
            )}

{errorMessage && (
              <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-rose-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-rose-800 text-sm">Error</p>
                    <p className="text-rose-700 text-sm mt-1">{errorMessage}</p>
                    <button
                      onClick={() => { setErrorMessage(null); handleGenerate(); }}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-100 hover:bg-rose-200 px-4 py-2 text-sm font-medium text-rose-800 transition"
                    >
                      <RefreshCw className="h-4 w-4" /> Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {aiResultVisible ? (
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
                <div className="mb-6 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Generated Resume</p>
                  <h2 className="text-xl font-semibold text-slate-900">ATS-ready preview</h2>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-white p-3 text-slate-900">
                  <ResumePreview data={previewData} />
                </div>

                <div className="mt-5 flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">ATS Score</p>
                    <h3 className={`text-3xl font-semibold ${scoreTone}`}>{score} / 100</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={toggleFullscreen} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-400"><Maximize2 className="mr-2 inline h-4 w-4" /> Full-screen preview</button>
                    <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-400"><Download className="mr-2 inline h-4 w-4" /> Download PDF</button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Improvement Summary</p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(analysisData?.improvement_summary || []).map((item) => (
                        <li key={item} className="list-disc pl-5">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {(analysisData?.missing_keywords || []).length > 0 ? (
                        (analysisData?.missing_keywords || []).map((keyword) => (
                          <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{keyword}</span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No missing keywords detected.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Matched Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {(analysisData?.matched_keywords || []).map((keyword) => (
                        <span key={keyword} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{keyword}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Skill Gap Analysis</p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(analysisData?.skill_gap_analysis || []).map((item) => (
                        <li key={item} className="list-disc pl-5">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Recommended Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {displaySkills.map((skill) => (
                        <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Resume Strengths</p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(analysisData?.resume_strengths || []).map((item) => (
                        <li key={item} className="list-disc pl-5">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Areas for Improvement</p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(analysisData?.areas_for_improvement || []).map((item) => (
                        <li key={item} className="list-disc pl-5">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Optimized Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {(analysisData?.keywords || []).map((keyword) => (
                        <span key={keyword} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{keyword}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
                <p className="text-lg font-semibold text-slate-900">Your generated resume will appear here.</p>
                <p className="mt-2 text-sm">Once AI completes the workflow, the professional A4 preview and ATS analysis will appear instantly.</p>
              </section>
            )}
          </div>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Recommended Projects</p>
                <h2 className="text-xl font-semibold text-slate-900">Based on your target role</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleScrollProjects('left')} className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:border-indigo-400">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => handleScrollProjects('right')} className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:border-indigo-400">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div ref={carouselRef} className="flex gap-4 overflow-x-auto pb-2">
              {displayProjects.map((project) => (
                <article key={project.title || project.name} className="min-w-[260px] rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_30px_-20px_rgba(148,163,184,0.65)] transition hover:-translate-y-1 hover:border-indigo-200">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{project.title || project.name}</h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Layers3 className="h-4 w-4" /> {project.difficulty || 'Role-aligned'}</div>
                    <div className="flex items-center gap-2"><Database className="h-4 w-4" /> {project.stack || project.technologies || 'Role-aligned stack'}</div>
                    <div className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {project.time || 'Suggested portfolio project'}</div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-indigo-400">View Details</button>
                    <button className="rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-3 py-2 text-sm font-semibold text-white">Start Project</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (isManualView) {
    return (
      <div className="resume-page-shell min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
        <style>{resumePageTheme}</style>
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
            <div>
              <button onClick={() => navigate('/resume-builder')} className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                <ChevronLeft className="h-4 w-4" />
                Back to resume options
              </button>
              <h1 className="text-3xl font-semibold text-slate-900">Build Resume Manually</h1>
              <p className="mt-1 text-sm text-slate-500">Create a professional ATS-friendly resume from scratch with a live preview.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-400"><Save className="mr-2 inline h-4 w-4" /> Save draft</button>
              <button onClick={toggleFullscreen} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-400"><Maximize2 className="mr-2 inline h-4 w-4" /> {isFullscreen ? 'Exit full screen' : 'Full screen preview'}</button>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
              <div className="mb-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Progress</p>
                  <span className="text-sm text-cyan-700">10 steps</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                  {['Contact', 'Summary', 'Education', 'Experience', 'Projects', 'Skills', 'Certifications', 'Achievements', 'Languages', 'Review'].map((step) => (
                    <span key={step} className="rounded-full border border-slate-300 bg-white px-3 py-1.5">{step}</span>
                  ))}
                </div>
              </div>
              <ResumeBuilder initialData={resumeData} onDataChange={setResumeData} roleType={selectedRole} />
            </div>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Live Resume Preview</p>
                  <h2 className="text-xl font-semibold text-slate-900">A4 document preview</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-indigo-400"><Download className="mr-2 inline h-4 w-4" /> PDF</button>
                  <button className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-cyan-400"><Printer className="mr-2 inline h-4 w-4" /> Print</button>
                  <button className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-fuchsia-400"><Share2 className="mr-2 inline h-4 w-4" /> Share</button>
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3 text-slate-900">
                <ResumePreview data={resumeData} />
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-24px_rgba(148,163,184,0.54)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Bot className="h-5 w-5 text-cyan-600" />
                  AI assistant available for bullet rewrites, ATS keywords, and summary help.
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-indigo-400"><Sparkles className="mr-2 inline h-4 w-4" /> Improve ATS score</button>
                  <button className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5">Generate resume</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default ResumeBuilderPage
