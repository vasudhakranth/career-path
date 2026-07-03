import { useEffect, useState } from 'react'
import { getDashboard } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import Card from '../components/Card'
import PageHero from '../components/PageHero'


const sampleWeekly = [
  { day: 'Mon', progress: 25 },
  { day: 'Tue', progress: 40 },
  { day: 'Wed', progress: 55 },
  { day: 'Thu', progress: 65 },
  { day: 'Fri', progress: 80 },
  { day: 'Sat', progress: 85 },
  { day: 'Sun', progress: 90 },
]

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    getDashboard().then((res) => setDashboard(res.data)).catch(() => setDashboard(null))
  }, [])

  const charts = [
    { title: 'Skill Progress', value: dashboard?.skills_completed || 0 },
    { title: 'Projects Completed', value: dashboard?.projects_completed || 0 },
    { title: 'Resume Completion', value: dashboard?.resume_completion || 0 },
    { title: 'Roadmap Completion', value: dashboard?.roadmap_completion || 0 },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-3 text-slate-400">Track your selected role, completed skills, and job readiness score.</p>
          </div>
          <div className="rounded-3xl bg-slate-950/90 px-5 py-4 text-center">
            <p className="text-sm uppercase text-slate-400">Job Readiness</p>
            <p className="mt-2 text-4xl font-bold text-violet-400">{dashboard?.job_readiness_score ?? '--'}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {charts.map((chart) => (
          <div key={chart.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{chart.title}</h2>
            <p className="mt-4 text-3xl font-bold text-white">{chart.value}</p>
          </div>
        ))}
      </div>
      <PageHero caption="Monitor your learning progress with visual metrics." />


      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Weekly Activity" description="Recent learning progress and activity trend.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleWeekly} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="progress" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Learning Progress" description="Skill and roadmap completion overview.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleWeekly} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="progress" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
