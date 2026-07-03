import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoles, updateSelectedRole } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PageHero from '../components/PageHero'


export default function RoleSelection() {
  const [roles, setRoles] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    getRoles().then((res) => setRoles(res.data)).catch(() => setRoles([]))
  }, [])

  const handleSelect = async (roleName) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await updateSelectedRole(roleName)
      navigate('/roadmap')
    } catch (err) {
      setError('Failed to select role. Please log in and try again.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-3xl font-bold text-white">Select Your Career Role</h1>
        <p className="mt-3 text-slate-400">Pick a role to generate a personalized roadmap and learning path.</p>
      </div>

      {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">{error}</div>}

      <PageHero caption="Choose the role that fits your goals." />


      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <div key={role.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20">
            <h2 className="text-xl font-semibold text-white">{role.role_name}</h2>
            <p className="mt-3 text-slate-400">{role.description}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="rounded-full bg-violet-500/15 px-4 py-2 text-sm text-violet-200">Role Card</span>
              <button
                onClick={() => handleSelect(role.role_name)}
                className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
              >
                Generate My Roadmap
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
