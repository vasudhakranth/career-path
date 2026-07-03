import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSkills } from '../services/api'
import Card from '../components/Card'
import PageHero from '../components/PageHero'

const slugifySkill = (name) =>
  name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export default function SkillsPage() {
  const [skills, setSkills] = useState([])

  useEffect(() => {
    getSkills().then((res) => setSkills(res.data)).catch(() => setSkills([]))
  }, [])

  const categories = [...new Set(skills.map((skill) => skill.category))]

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-3xl font-bold text-white">Skills</h1>
        <p className="mt-3 text-slate-400">Explore skill categories, learning resources, and practice focus areas.</p>
      </div>
      <PageHero caption="Discover the core skills you need to grow." />


      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category} title={category} description={`Skills in ${category}`}>
            <ul className="space-y-3 text-slate-300">
              {skills
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <li key={skill.id} className="rounded-2xl bg-slate-950/80 px-4 py-3">
                    <Link
                      to={`/skills/${slugifySkill(skill.skill_name)}`}
                      className="block rounded-xl transition hover:bg-slate-900/80"
                    >
                      <h3 className="font-semibold text-white">{skill.skill_name}</h3>
                      <p className="text-slate-400">{skill.description}</p>
                    </Link>
                  </li>
                ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
