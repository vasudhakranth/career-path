import { Link } from 'react-router-dom'
import Card from '../components/Card'
import PageHero from '../components/PageHero'

import personalizedRoadmapImg from '../assets/Landing pages/personliged image.png'
import skillLearningImg from '../assets/Landing pages/Skill Learning.jpeg'
import resumeBuilderImg from '../assets/Landing pages/Resume Builder.png'
import projectSuggestionsImg from '../assets/Landing pages/Project Suggestions.jpeg'
import progressTrackingImg from '../assets/Landing pages/Progress Tracking.jpeg'

const features = [
  {
    title: 'Personalized Roadmaps',
    description: 'Unlock a guided experience for your career journey.',
    image: personalizedRoadmapImg,
  },
  {
    title: 'Skill Learning',
    description: 'Learn the right skills step-by-step, with clear milestones.',
    image: skillLearningImg,
  },
  {
    title: 'Resume Builder',
    description: 'Turn progress into a resume-ready portfolio with confidence.',
    image: resumeBuilderImg,
  },
  {
    title: 'Project Suggestions',
    description: 'Get practical project ideas aligned to your roadmap.',
    image: projectSuggestionsImg,
  },
  {
    title: 'Progress Tracking',
    description: 'Stay on track with measurable progress updates.',
    image: progressTrackingImg,
  },
]

export default function LandingPage() {
  return (
    <div className="space-y-12">
      {/* 1. Main Hero Section ("Choose Your Path") */}
      <section className="rounded-[2rem] border border-violet-500/10 bg-gradient-to-br from-slate-950/90 via-slate-900 to-slate-950 p-12 shadow-2xl shadow-violet-950/40">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-violet-300">EduMind</p>
            <h1 className="mt-6 text-5xl font-black text-white sm:text-6xl">
              Choose Your Path. Learn the Right Skills. Build Your Future.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              EduMind helps students select a career role, generate a personalized roadmap, track projects,
              and improve job readiness with modern web tools and AI-ready architecture.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/roles"
                className="inline-flex items-center justify-center rounded-full bg-violet-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:bg-violet-400"
              >
                Get Started
              </Link>
              <Link
                to="/roadmap"
                className="inline-flex items-center justify-center rounded-full border border-violet-500/30 bg-slate-900 px-8 py-4 text-sm font-semibold text-violet-200 hover:bg-slate-800"
              >
                Explore Roadmaps
              </Link>
            </div>
          </div>

          
        </div>
      </section>

      {/* 2. Features Section (Moved Below the Main Hero Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.35em] text-violet-300 font-semibold">
            Explore Core Features
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Scroll left"
              className="rounded-full border border-violet-500/30 bg-slate-900 px-4 py-2 text-violet-200 hover:bg-slate-800 transition"
              onClick={() => document.getElementById('landing-feature-strip')?.scrollBy({ left: -420, behavior: 'smooth' })}
            >
              &larr;
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              className="rounded-full border border-violet-500/30 bg-slate-900 px-4 py-2 text-violet-200 hover:bg-slate-800 transition"
              onClick={() => document.getElementById('landing-feature-strip')?.scrollBy({ left: 420, behavior: 'smooth' })}
            >
              &rarr;
            </button>
          </div>
        </div>

        <div
          id="landing-feature-strip"
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="w-[320px] shrink-0 snap-start"
            >
              <Card
                title={feature.title}
                description={feature.description}
                className="overflow-hidden h-full flex flex-col justify-between"
              >
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bottom Info Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card title="Why EduMind" description="AI-ready career-guidance platform built for students.">
          <ul className="space-y-3 text-slate-300">
            <li>Role selection made easy</li>
            <li>Roadmaps for every career path</li>
            <li>Track progress and resume readiness</li>
          </ul>
        </Card>
        <Card title="Built for Learners" description="Modern UI, responsive experience, and career-centric guidance.">
          <p className="text-slate-300">
            Start with role discovery, then follow a roadmap designed to help you learn, build, and succeed.
          </p>
        </Card>
        <Card title="AI Mentor Placeholder" description="Future chatbot integration for career advice.">
          <Link to="/mentor" className="text-violet-300 hover:underline">
            Open Mentor
          </Link>
        </Card>
      </section>

      {/* 4. Landing Page Footer */}
      <footer className="border-t border-slate-800 mt-20 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-2xl font-bold text-violet-400">EduMind</h3>
              <p className="mt-2 text-slate-400">Helping students become career ready.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white">Quick Links</h4>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/roadmap" className="hover:text-white transition">
                    Roadmaps
                  </Link>
                </li>
                <li>
                  <Link to="/skills" className="hover:text-white transition">
                    Skills
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="hover:text-white transition">
                    Projects
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white">Career Paths</h4>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>
                  <Link to="/roles" className="hover:text-white transition">
                    Full Stack
                  </Link>
                </li>
                <li>
                  <Link to="/roles" className="hover:text-white transition">
                    Data Analyst
                  </Link>
                </li>
                <li>
                  <Link to="/roles" className="hover:text-white transition">
                    AI Engineer
                  </Link>
                </li>
                <li>
                  <Link to="/roles" className="hover:text-white transition">
                    DevOps
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white">Resources</h4>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-slate-500">
            © 2026 EduMind. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
