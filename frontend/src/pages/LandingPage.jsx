import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Code2,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import './LandingPage.css'

const demoHighlights = [
  'Career Roadmaps',
  'Skill Learning',
  'ATS Resume Builder',
  'AI Chatbot',
  'Interview Preparation',
  'Coding Practice',
  'Project Recommendations',
  'Dashboard',
  'AI Timetable',
]

const aboutPoints = [
  'Which career is right for them',
  'Which skills to learn',
  'Where to learn',
  'Which projects to build',
  'How to create an ATS resume',
  'How to prepare for interviews',
  'How to get jobs',
]

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-aurora relative overflow-hidden px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="hero-particle hero-particle-1" />
        <div className="hero-particle hero-particle-2" />
        <div className="hero-particle hero-particle-3" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
              <Sparkles size={16} />
              AI-powered career growth for students
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your AI Career Mentor — Learn, Build & Get Hired
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              EduMind is an AI-powered career development platform that helps students discover the right career path,
              learn required skills, build industry-ready projects, create ATS-friendly resumes, prepare for interviews,
              practice coding, earn certifications, and find job opportunities—all in one platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/get-started"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5"
              >
                <PlayCircle className="mr-2 h-4 w-4 text-indigo-600" />
                Watch Demo
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Career Roadmaps
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Resume + Interview Prep
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Coding Practice
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="landing-float rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-indigo-600">AI Assistant</p>
                    <h2 className="text-xl font-semibold text-slate-900">Career Copilot</h2>
                  </div>
                  <div className="rounded-full bg-white p-2 shadow-sm">
                    <BrainCircuit className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-indigo-600" />
                      <p className="text-sm font-semibold text-slate-900">Student</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">Career path guidance</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-indigo-600" />
                      <p className="text-sm font-semibold text-slate-900">Roadmap</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">Personalized learning steps</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-indigo-600" />
                      <p className="text-sm font-semibold text-slate-900">Resume</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">ATS-ready profile analysis</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-indigo-600" />
                      <p className="text-sm font-semibold text-slate-900">Practice</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">Coding and interview prep</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-900 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Dashboard</p>
                      <p className="text-lg font-semibold">Progress snapshot</p>
                    </div>
                    <div className="rounded-full bg-white/10 p-2">
                      <ShieldCheck className="h-5 w-5 text-indigo-300" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-300">
                    <span>Interview Prep</span>
                    <span>82% ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-[0_20px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Why EduMind?</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Many students struggle without a clear path</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Many students struggle because they do not know which career is right for them, which skills to learn,
              where to learn, which projects to build, how to create an ATS resume, how to prepare for interviews,
              or how to get jobs.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {aboutPoints.map((point) => (
              <div key={point} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{point}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg leading-8 text-slate-600">
            EduMind solves all these problems using Artificial Intelligence.
          </p>
        </div>
      </section>

      <section id="demo" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.1)] sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">Demo Video</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Watch EduMind in Action</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Watch a complete walkthrough showing how EduMind guides students from choosing a career to getting placed.
            </p>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 shadow-2xl">
            <div className="flex min-h-[280px] items-center justify-center rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.25),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.2),_transparent_35%)]">
              <div className="flex flex-col items-center rounded-full bg-white/10 p-6 backdrop-blur">
                <PlayCircle className="h-16 w-16 text-indigo-300" />
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">Product Tour</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {demoHighlights.map((item) => (
              <div key={item} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
