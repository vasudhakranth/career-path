import { useEffect, useMemo, useState } from 'react'
import { getRoadmaps } from '../services/api'
import { useAuth } from '../context/AuthContext'
import RoadmapVisualization from '../components/RoadmapVisualization'
import { CAREER_ROLES, ROLE_ROADMAPS } from '../utils/roleRoadmapsData'

const StageCard = ({ stage }) => {

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/10 hover:border-violet-500/40 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400">Stage {stage.stageNumber}</div>
          <h3 className="mt-1 text-xl font-bold text-white">{stage.stageTitle}</h3>
        </div>
        <div className="rounded-full bg-violet-500/15 px-4 py-2 text-xs font-semibold text-violet-200">{stage.stageNumber}</div>
      </div>
      <p className="mt-3 text-slate-300">{stage.stageDescription}</p>
      <div className="mt-4">
        <p className="text-sm font-semibold text-white">Stage topics</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {stage.stageTopics.map((t) => (
            <span key={t} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RoadmapPage() {
  const { user } = useAuth()

  const [roadmaps, setRoadmaps] = useState([])
  const [roleSearch, setRoleSearch] = useState('')
  const [activeRole, setActiveRole] = useState(user?.selected_role || CAREER_ROLES[0])



  // Keep existing API roadmaps fetch for possible future re-use
  useEffect(() => {
    getRoadmaps()
      .then((res) => setRoadmaps(res.data || []))
      .catch(() => setRoadmaps([]))
  }, [])

  const filteredRoles = useMemo(() => {
    const q = roleSearch.trim().toLowerCase()
    if (!q) return CAREER_ROLES
    return CAREER_ROLES.filter((r) => r.toLowerCase().includes(q))
  }, [roleSearch])

  const roleRoadmap = useMemo(() => {
    return ROLE_ROADMAPS[activeRole] || ROLE_ROADMAPS[CAREER_ROLES[0]]
  }, [activeRole])



  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-4xl font-bold text-white">Learning Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Select a role from the left sidebar to generate a stage-wise roadmap, then build an ATS-friendly resume.
        </p>
      </div>



      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left Sidebar */}
        <aside className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto rounded-[2rem] border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Roles</h2>
            <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">{filteredRoles.length}</span>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-slate-300">Search roles</label>
            <input
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              placeholder="Type to filter roles..."
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="mt-5 space-y-2">
            {filteredRoles.map((role) => {
              const active = role === activeRole
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors hover:border-violet-500/30 ${
                    active ? 'border-violet-500/60 bg-violet-500/10 text-violet-200' : 'border-slate-800 bg-slate-950/30 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{role}</span>
                    <span className={`text-xs ${active ? 'text-violet-200' : 'text-slate-500'}`}>{active ? 'Active' : ''}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Center Content */}
        <section className="space-y-6 overflow-y-auto pr-1">
          {/* Role Header */}
          <div className="rounded-[2rem] border border-slate-800 bg-gradient-to-r from-violet-500/15 via-slate-900/70 to-slate-900 p-8 shadow-xl shadow-black/10">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">{roleRoadmap.roleTitle}</h2>
                <p className="mt-3 max-w-3xl text-slate-300">{roleRoadmap.roleOverview}</p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500">Average US Salary</div>
                  <div className="mt-1 text-sm font-semibold text-white">{roleRoadmap.averageSalary}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500">Demand Ratio</div>
                  <div className="mt-1 text-sm font-semibold text-white">{roleRoadmap.demandRatio}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-sm font-semibold text-white">Essential Frameworks & Ecosystem Highlights</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {roleRoadmap.essentialFrameworks.map((x) => (
                  <span key={x} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chronological Learning Stages */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Chronological Learning Stages</h3>
            <div className="grid gap-4">
              {roleRoadmap.stages.map((s) => (
                <StageCard key={s.stageNumber} stage={s} />
              ))}
            </div>
          </div>

          {/* Keep old visualization hidden for now (future) */}
          <div className="hidden">
            <RoadmapVisualization roadmaps={roadmaps} roleName={activeRole} selectedPhase={''} onPhaseSelect={() => {}} />
          </div>


        </section>
      </div>
    </div>
  )
}



