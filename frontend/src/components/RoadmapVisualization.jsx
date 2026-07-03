import { useState } from 'react'
import { CheckCircle, Circle, Lock, Target } from 'lucide-react'

const RoadmapVisualization = ({ roadmaps = [], roleName = '', selectedPhase = '', onPhaseSelect = () => {} }) => {
  const phaseOrder = ['Fundamentals', 'Frontend', 'Backend', 'Databases', 'Deployment', 'Advanced Projects']
  const [expandedPhase, setExpandedPhase] = useState(selectedPhase || phaseOrder[0])

  const sortedRoadmaps = [...roadmaps].sort((a, b) => phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase))

  const getRoleIcon = (role) => {
    const icons = {
      'Backend Developer': '⚙️',
      'Frontend Developer': '🎨',
      'Full Stack Developer': '🚀',
      'Data Analyst': '📊',
      'Data Scientist': '🤖',
      'AI Engineer': '🧠',
      'DevOps Engineer': '🛠️',
      'Mobile App Developer': '📱',
      'Cyber Security Analyst': '🔒',
    }
    return icons[role] || '📚'
  }

  const getPhaseColor = (phase) => {
    const colors = {
      Fundamentals: 'from-blue-500 to-blue-600',
      Frontend: 'from-pink-500 to-rose-600',
      Backend: 'from-purple-500 to-purple-600',
      Databases: 'from-green-500 to-emerald-600',
      Deployment: 'from-orange-500 to-amber-600',
      'Advanced Projects': 'from-indigo-500 to-indigo-600',
    }
    return colors[phase] || 'from-slate-500 to-slate-600'
  }

  const getPhaseDescription = (phase) => {
    const descriptions = {
      Fundamentals: 'Learn the core concepts and basics of programming',
      Frontend: 'Master UI/UX design and client-side development',
      Backend: 'Build robust server-side applications',
      Databases: 'Design and manage data storage systems',
      Deployment: 'Deploy and manage applications in production',
      'Advanced Projects': 'Build complex, real-world applications',
    }
    return descriptions[phase] || 'Phase description'
  }

  return (
    <div className="space-y-8">
      {/* Role Header */}
      <div className="rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900/80 to-slate-800/80 p-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{getRoleIcon(roleName)}</span>
          <div>
            <h1 className="text-4xl font-bold text-white">{roleName || 'Career Path'}</h1>
            <p className="text-slate-400 mt-2">
              Master the skills needed to succeed in your chosen role with a structured learning path
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Learning Roadmap</h2>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 via-purple-500 to-slate-700 rounded-full"></div>

          {/* Phases */}
          <div className="space-y-6">
            {phaseOrder.map((phase, index) => {
              const phaseData = sortedRoadmaps.filter((r) => r.phase === phase)
              const isExpanded = expandedPhase === phase
              const isCompleted = index < 2 // Visual: first 2 phases as completed

              return (
                <div key={phase} className="ml-24">
                  {/* Phase Header */}
                  <button
                    onClick={() => {
                      setExpandedPhase(isExpanded ? null : phase)
                      onPhaseSelect(phase)
                    }}
                    className={`w-full rounded-xl border-2 transition-all duration-300 ${
                      isExpanded
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Phase Icon */}
                        <div
                          className={`absolute -left-9 w-16 h-16 rounded-full flex items-center justify-center border-4 border-slate-900 text-2xl transition-all ${
                            isCompleted
                              ? 'bg-gradient-to-br ' + getPhaseColor(phase)
                              : 'bg-slate-800 border-slate-700'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-8 h-8 text-white" />
                          ) : (
                            <Circle className="w-8 h-8 text-slate-400" />
                          )}
                        </div>

                        {/* Phase Info */}
                        <div className="flex-1 text-left">
                          <h3 className={`text-xl font-bold ${isExpanded ? 'text-violet-300' : 'text-white'}`}>
                            Phase {index + 1}: {phase}
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">{getPhaseDescription(phase)}</p>
                        </div>

                        {/* Chevron */}
                        <div
                          className={`text-violet-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        >
                          ▼
                        </div>
                      </div>

                      {/* Expanded Skills */}
                      {isExpanded && phaseData.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {phaseData[0]?.skills?.map((skill, idx) => (
                              <div
                                key={idx}
                                className="bg-slate-800/80 rounded-lg px-4 py-3 border border-slate-700 hover:border-violet-500/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-violet-400" />
                                  <span className="text-slate-200 text-sm font-medium">{skill}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>



      {/* Estimated Timeline */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Learning Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-6">
            <p className="text-green-300 font-semibold text-lg">3-4 Months</p>
            <p className="text-slate-400 text-sm mt-2">Fundamentals & Basics</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-6">
            <p className="text-blue-300 font-semibold text-lg">4-6 Months</p>
            <p className="text-slate-400 text-sm mt-2">Core Development Skills</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6">
            <p className="text-purple-300 font-semibold text-lg">3-6 Months</p>
            <p className="text-slate-400 text-sm mt-2">Advanced Projects & Specialization</p>
          </div>
        </div>
      </div>

      {/* Interview Preparation Tips */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Interview Preparation</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h3 className="text-white font-semibold">Practice Coding Problems</h3>
              <p className="text-slate-400 text-sm mt-1">
                Solve problems on platforms like LeetCode and HackerRank
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 className="text-white font-semibold">Build Real Projects</h3>
              <p className="text-slate-400 text-sm mt-1">
                Create portfolio projects to showcase your skills
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="text-white font-semibold">Prepare Behavioral Answers</h3>
              <p className="text-slate-400 text-sm mt-1">
                Use the STAR method to answer behavioral questions
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h3 className="text-white font-semibold">Mock Interviews</h3>
              <p className="text-slate-400 text-sm mt-1">
                Practice with peers and mentors before real interviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoadmapVisualization
