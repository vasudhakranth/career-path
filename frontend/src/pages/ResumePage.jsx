import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import PageHero from '../components/PageHero'
import ResumeBuilder from '../components/ResumeBuilder'
import ResumePreview from '../components/ResumePreview'
import { Download, FileText, UploadCloud } from 'lucide-react'
import { getResume, saveResume, updateResume, uploadResumeFile } from '../services/api'


const defaultResumeForUser = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: '',
  linkedin: '',
  github: '',
  portfolio: '',
  careerObjective: '',
  skills: [],
  education: [{ school: '', degree: '', field: '', year: '', details: '' }],
  projects: [{ name: '', description: '', technologies: '', link: '', achievements: '' }],
  experience: [{ company: '', position: '', duration: '', description: '', achievements: '' }],
  certifications: [{ name: '', issuer: '', date: '', credentialId: '' }],
  achievements: [],
  languages: [{ language: '', proficiency: 'Intermediate' }],
  interests: '',
})

const templates = [
  { title: 'Full Stack Resume', description: 'Modern template for software engineers.' },
  { title: 'Data Analyst Resume', description: 'Clean layout for analytics professionals.' },
  { title: 'AI Engineer Resume', description: 'Technical resume with project focus.' },
]

const tips = [
  'Use clear section headings',
  'Include measurable achievements',
  'Keep formatting consistent for ATS',
]

const resumeContent = {
  'Full Stack Resume': `EduMind Full Stack Resume\n\nName: [Your Name]\nRole: Full Stack Developer\nSkills: JavaScript, React, FastAPI, MongoDB\nProjects: Attendance Management System, Resume Builder Portal\n`,
  'Data Analyst Resume': `EduMind Data Analyst Resume\n\nName: [Your Name]\nRole: Data Analyst\nSkills: Python, SQL, Data Visualization\nProjects: Analytics Dashboard, Data Reporting System\n`,
  'AI Engineer Resume': `EduMind AI Engineer Resume\n\nName: [Your Name]\nRole: AI/ML Engineer\nSkills: Python, Machine Learning, Model Deployment\nProjects: Predictive Model, Recommendation Engine\n`,
}

export default function ResumePage() {
  const [message, setMessage] = useState('')
  const { user, refreshUser } = useAuth()

  const [resumeData, setResumeData] = useState({})
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    setResumeData(defaultResumeForUser(user))

    getResume()
      .then((res) => {
        if (res?.data?.resume_data) setResumeData(res.data.resume_data)
        setMessage('Existing resume loaded')
        setTimeout(() => setMessage(''), 3000)
      })
      .catch(() => {
        // keep defaults
      })
  }, [user])

  const handleResumeDataChange = (newData) => setResumeData(newData)

  const handleSaveResume = async () => {
    if (!user) {
      setMessage('Please login to save your resume.')
      return
    }

    setLoading(true)
    try {
      const resumeToSave = { ...resumeData }

      try {
        await updateResume(resumeToSave)
        setMessage('Resume updated successfully!')
      } catch {
        await saveResume(resumeToSave)
        setMessage('Resume saved successfully!')
      }

      setTimeout(() => setMessage(''), 3000)
      refreshUser?.()
    } catch (e) {
      console.error(e)
      setMessage('Error saving resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (title) => {
    const content = resumeContent[title]
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setMessage('Template downloaded.')
    setTimeout(() => setMessage(''), 3000)
  }

  const completion = user?.resume_completion ?? 0
  const completionText = useMemo(() => `${completion}%`, [completion])

  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)

  const handleUploadChange = (e) => {
    const file = e.target.files?.[0]
    setUploadedFile(file || null)
  }

  const handleGenerateAtsResume = async () => {
    if (!user) {
      setMessage('Please login to analyze your resume.')
      return
    }
    if (!uploadedFile) {
      setMessage('Please upload a resume file first (pdf/doc/docx).')
      return
    }

    setUploadLoading(true)
    try {
      const formData = new FormData()
      formData.append('resume_file', uploadedFile)

      const res = await uploadResumeFile(formData)
      const nextResume = res?.data?.resume_data
      if (nextResume) {
        setResumeData(nextResume)
        setShowResumePreview(true)
        setMessage('ATS-friendly resume generated!')
      } else {
        setMessage('Could not generate resume. Try again.')
      }
      setTimeout(() => setMessage(''), 3000)
      refreshUser?.()
    } catch (e) {
      console.error(e)
      setMessage(e?.response?.data?.detail || 'Upload failed. Try again.')
    } finally {
      setUploadLoading(false)
    }
  }


  return (
    <div className="space-y-8">
      {/* Upload panel */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Upload Resume</h3>
            <p className="mt-1 text-slate-400">Upload your PDF/DOC/Word resume and generate a new ATS-friendly version.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleUploadChange}
              className="block w-full sm:w-[320px] text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-violet-500/20 file:px-4 file:py-2 file:text-violet-200 file:font-semibold file:hover:bg-violet-500/30"
            />

            <button
              onClick={handleGenerateAtsResume}
              disabled={uploadLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 px-5 py-3 text-white font-semibold disabled:bg-slate-600"
            >
              <UploadCloud className="w-5 h-5" />
              {uploadLoading ? 'Analyzing...' : 'Analyze & Generate ATS Resume'}
            </button>
          </div>
        </div>

        {uploadedFile && (
          <p className="mt-3 text-sm text-slate-300">
            Selected file: <span className="text-slate-100 font-medium">{uploadedFile.name}</span>
          </p>
        )}
      </div>
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-3xl font-bold text-white">Resume Builder</h1>
        <p className="mt-3 text-slate-400">Build your ATS-friendly resume and save it to your profile.</p>
      </section>

      {message && (
        <div className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-4 text-violet-200">{message}</div>
      )}

      <PageHero caption="Generate templates and update resume readiness." />

      {/* Resume Builder UI */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Resume Builder</h3>
            <p className="mt-2 text-slate-400">Enter your details and generate an ATS-friendly resume.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveResume}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 px-5 py-3 text-white font-semibold disabled:bg-slate-600"
            >
              <Download className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Resume'}
            </button>

            <button
              onClick={() => setShowResumePreview((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-3 text-white font-semibold hover:bg-slate-900"
            >
              <FileText className="w-5 h-5" />
              {showResumePreview ? 'Hide Preview' : 'Preview'}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <ResumeBuilder initialData={resumeData} onDataChange={handleResumeDataChange} />
          </div>

          {showResumePreview ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <h4 className="text-lg font-bold text-white">Resume Preview</h4>
              <div className="mt-4 overflow-y-auto max-h-[70vh]">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-6">
              <p className="text-slate-400">Click “Preview” to see your resume.</p>
            </div>
          )}
        </div>
      </div>

      {/* Existing template + tips section (kept) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.title} title={template.title} description={template.description}>
            <button
              onClick={() => handleDownload(template.title)}
              className="mt-4 rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
            >
              Download Resume
            </button>
          </Card>
        ))}
      </div>

      <Card title="ATS Tips" description="Resume advice to improve interview chances.">
        <ul className="space-y-3 text-slate-300">
          {tips.map((tip) => (
            <li key={tip}>• {tip}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-400">Current resume completion: {completionText}</p>
      </Card>
    </div>
  )
}

