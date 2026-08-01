import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const resumeFormTheme = `
  .resume-form-shell { background: linear-gradient(135deg, #f8fbff 0%, #fdf2f8 100%); color: #0f172a; }
  .resume-form-shell .rounded-lg,
  .resume-form-shell .rounded-xl,
  .resume-form-shell .rounded-2xl { border-color: #e8ecf6 !important; }
  .resume-form-shell .bg-slate-900\/50,
  .resume-form-shell .bg-slate-900,
  .resume-form-shell .bg-slate-800,
  .resume-form-shell .bg-slate-800\/50 { background-color: #fcfdff !important; }
  .resume-form-shell .border-slate-700,
  .resume-form-shell .border-slate-800 { border-color: #e8ecf6 !important; }
  .resume-form-shell .text-white { color: #0f172a !important; }
  .resume-form-shell .text-slate-500,
  .resume-form-shell .text-slate-400,
  .resume-form-shell .text-slate-300 { color: #64748b !important; }
  .resume-form-shell input,
  .resume-form-shell textarea,
  .resume-form-shell select { background-color: #ffffff !important; color: #0f172a !important; border-color: #dbe6f7 !important; }
  .resume-form-shell .hover\:bg-slate-800:hover { background-color: #f4f7fb !important; }
`

const ResumeBuilder = ({ initialData = {}, onDataChange, roleType = '' }) => {
  const [resumeData, setResumeData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    linkedin: initialData.linkedin || '',
    github: initialData.github || '',
    portfolio: initialData.portfolio || '',
    careerObjective: initialData.careerObjective || '',
    skills: initialData.skills || [],
    education: initialData.education || [{ school: '', degree: '', field: '', year: '', details: '' }],
    projects: initialData.projects || [{ name: '', description: '', technologies: '', link: '', achievements: '' }],
    experience: initialData.experience || [{ company: '', position: '', duration: '', description: '', achievements: '' }],
    certifications: initialData.certifications || [{ name: '', issuer: '', date: '', credentialId: '' }],
    achievements: initialData.achievements || [],
    languages: initialData.languages || [{ language: '', proficiency: 'Intermediate' }],
    interests: initialData.interests || '',
  })

  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    objective: true,
    skills: true,
    education: true,
    projects: true,
    experience: true,
    certifications: false,
    achievements: false,
    languages: false,
    interests: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const newData = { ...resumeData, [name]: value }
    setResumeData(newData)
    onDataChange(newData)
  }

  const handleSkillChange = (index, value) => {
    const newSkills = [...resumeData.skills]
    newSkills[index] = value
    const newData = { ...resumeData, skills: newSkills }
    setResumeData(newData)
    onDataChange(newData)
  }

  const addSkill = () => {
    const newData = { ...resumeData, skills: [...resumeData.skills, ''] }
    setResumeData(newData)
    onDataChange(newData)
  }

  const removeSkill = (index) => {
    const newSkills = resumeData.skills.filter((_, i) => i !== index)
    const newData = { ...resumeData, skills: newSkills }
    setResumeData(newData)
    onDataChange(newData)
  }

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...resumeData.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    const newData = { ...resumeData, education: newEducation }
    setResumeData(newData)
    onDataChange(newData)
  }

  const addEducation = () => {
    const newData = {
      ...resumeData,
      education: [...resumeData.education, { school: '', degree: '', field: '', year: '', details: '' }],
    }
    setResumeData(newData)
    onDataChange(newData)
  }

  const removeEducation = (index) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index)
    const newData = { ...resumeData, education: newEducation }
    setResumeData(newData)
    onDataChange(newData)
  }

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...resumeData.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    const newData = { ...resumeData, projects: newProjects }
    setResumeData(newData)
    onDataChange(newData)
  }

  const addProject = () => {
    const newData = {
      ...resumeData,
      projects: [...resumeData.projects, { name: '', description: '', technologies: '', link: '', achievements: '' }],
    }
    setResumeData(newData)
    onDataChange(newData)
  }

  const removeProject = (index) => {
    const newProjects = resumeData.projects.filter((_, i) => i !== index)
    const newData = { ...resumeData, projects: newProjects }
    setResumeData(newData)
    onDataChange(newData)
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...resumeData.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    const newData = { ...resumeData, experience: newExperience }
    setResumeData(newData)
    onDataChange(newData)
  }

  const addExperience = () => {
    const newData = {
      ...resumeData,
      experience: [...resumeData.experience, { company: '', position: '', duration: '', description: '', achievements: '' }],
    }
    setResumeData(newData)
    onDataChange(newData)
  }

  const removeExperience = (index) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index)
    const newData = { ...resumeData, experience: newExperience }
    setResumeData(newData)
    onDataChange(newData)
  }

  const handleCertificationChange = (index, field, value) => {
    const newCerts = [...resumeData.certifications]
    newCerts[index] = { ...newCerts[index], [field]: value }
    const newData = { ...resumeData, certifications: newCerts }
    setResumeData(newData)
    onDataChange(newData)
  }

  const addCertification = () => {
    const newData = {
      ...resumeData,
      certifications: [...resumeData.certifications, { name: '', issuer: '', date: '', credentialId: '' }],
    }
    setResumeData(newData)
    onDataChange(newData)
  }

  const removeCertification = (index) => {
    const newCerts = resumeData.certifications.filter((_, i) => i !== index)
    const newData = { ...resumeData, certifications: newCerts }
    setResumeData(newData)
    onDataChange(newData)
  }

  const handleLanguageChange = (index, field, value) => {
    const newLanguages = [...resumeData.languages]
    newLanguages[index] = { ...newLanguages[index], [field]: value }
    const newData = { ...resumeData, languages: newLanguages }
    setResumeData(newData)
    onDataChange(newData)
  }

  const addLanguage = () => {
    const newData = {
      ...resumeData,
      languages: [...resumeData.languages, { language: '', proficiency: 'Intermediate' }],
    }
    setResumeData(newData)
    onDataChange(newData)
  }

  const removeLanguage = (index) => {
    const newLanguages = resumeData.languages.filter((_, i) => i !== index)
    const newData = { ...resumeData, languages: newLanguages }
    setResumeData(newData)
    onDataChange(newData)
  }

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...resumeData.achievements]
    newAchievements[index] = value
    const newData = { ...resumeData, achievements: newAchievements }
    setResumeData(newData)
    onDataChange(newData)
  }

  const addAchievement = () => {
    const newData = { ...resumeData, achievements: [...resumeData.achievements, ''] }
    setResumeData(newData)
    onDataChange(newData)
  }

  const removeAchievement = (index) => {
    const newAchievements = resumeData.achievements.filter((_, i) => i !== index)
    const newData = { ...resumeData, achievements: newAchievements }
    setResumeData(newData)
    onDataChange(newData)
  }

  const SectionHeader = ({ title, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {expandedSections[section] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
  )

  return (
    <div className="resume-form-shell space-y-6">
      <style>{resumeFormTheme}</style>
      {/* Contact Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Contact Information" section="contact" />
        {expandedSections.contact && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={resumeData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={resumeData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={resumeData.phone}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn Profile"
                value={resumeData.linkedin}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <input
                type="url"
                name="github"
                placeholder="GitHub Profile"
                value={resumeData.github}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <input
                type="url"
                name="portfolio"
                placeholder="Portfolio Website"
                value={resumeData.portfolio}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Career Objective */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Career Objective / Summary" section="objective" />
        {expandedSections.objective && (
          <div className="mt-4">
            <textarea
              name="careerObjective"
              placeholder="Write a brief professional summary highlighting your key strengths and career goals..."
              value={resumeData.careerObjective}
              onChange={handleInputChange}
              rows="4"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Skills" section="skills" />
        {expandedSections.skills && (
          <div className="mt-4 space-y-3">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., JavaScript, React, Node.js"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <button
                  onClick={() => removeSkill(index)}
                  className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 p-2 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addSkill}
              className="mt-2 flex items-center gap-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 px-4 py-2 text-violet-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Skill
            </button>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Education" section="education" />
        {expandedSections.education && (
          <div className="mt-4 space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="rounded-lg bg-slate-800/50 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="School/University"
                    value={edu.school}
                    onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Degree (e.g., Bachelor, Master)"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={edu.field}
                    onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Graduation Year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="Additional details (e.g., GPA, honors, relevant coursework)"
                  value={edu.details}
                  onChange={(e) => handleEducationChange(index, 'details', e.target.value)}
                  rows="2"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <button
                  onClick={() => removeEducation(index)}
                  className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-4 py-2 text-red-400 text-sm transition-colors"
                >
                  Remove Education
                </button>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="mt-2 flex items-center gap-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 px-4 py-2 text-violet-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Projects" section="projects" />
        {expandedSections.projects && (
          <div className="mt-4 space-y-4">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="rounded-lg bg-slate-800/50 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Project Link (GitHub, Demo, etc.)"
                    value={project.link}
                    onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  rows="2"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Technologies Used (comma-separated)"
                  value={project.technologies}
                  onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <textarea
                  placeholder="Key Achievements"
                  value={project.achievements}
                  onChange={(e) => handleProjectChange(index, 'achievements', e.target.value)}
                  rows="2"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <button
                  onClick={() => removeProject(index)}
                  className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-4 py-2 text-red-400 text-sm transition-colors"
                >
                  Remove Project
                </button>
              </div>
            ))}
            <button
              onClick={addProject}
              className="mt-2 flex items-center gap-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 px-4 py-2 text-violet-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Experience / Internship" section="experience" />
        {expandedSections.experience && (
          <div className="mt-4 space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="rounded-lg bg-slate-800/50 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Position/Title"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Duration (e.g., Jan 2023 - Dec 2023)"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <textarea
                  placeholder="Job Description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  rows="2"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <textarea
                  placeholder="Key Achievements and accomplishments"
                  value={exp.achievements}
                  onChange={(e) => handleExperienceChange(index, 'achievements', e.target.value)}
                  rows="2"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <button
                  onClick={() => removeExperience(index)}
                  className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-4 py-2 text-red-400 text-sm transition-colors"
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="mt-2 flex items-center gap-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 px-4 py-2 text-violet-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Certifications" section="certifications" />
        {expandedSections.certifications && (
          <div className="mt-4 space-y-4">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="rounded-lg bg-slate-800/50 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Certification Name"
                    value={cert.name}
                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Organization"
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Issue Date"
                    value={cert.date}
                    onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Credential ID/URL"
                    value={cert.credentialId}
                    onChange={(e) => handleCertificationChange(index, 'credentialId', e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removeCertification(index)}
                  className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-4 py-2 text-red-400 text-sm transition-colors"
                >
                  Remove Certification
                </button>
              </div>
            ))}
            <button
              onClick={addCertification}
              className="mt-2 flex items-center gap-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 px-4 py-2 text-violet-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Achievements & Awards" section="achievements" />
        {expandedSections.achievements && (
          <div className="mt-4 space-y-3">
            {resumeData.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Best Project Award, Dean's List"
                  value={achievement}
                  onChange={(e) => handleAchievementChange(index, e.target.value)}
                  className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <button
                  onClick={() => removeAchievement(index)}
                  className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 p-2 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addAchievement}
              className="mt-2 flex items-center gap-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 px-4 py-2 text-violet-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Languages" section="languages" />
        {expandedSections.languages && (
          <div className="mt-4 space-y-4">
            {resumeData.languages.map((lang, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Language"
                  value={lang.language}
                  onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                  className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                  className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white focus:border-violet-500 focus:outline-none"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Native</option>
                </select>
                <button
                  onClick={() => removeLanguage(index)}
                  className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 p-2 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addLanguage}
              className="mt-2 flex items-center gap-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/50 px-4 py-2 text-violet-400 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Language
            </button>
          </div>
        )}
      </div>

      {/* Interests Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
        <SectionHeader title="Interests (Optional)" section="interests" />
        {expandedSections.interests && (
          <div className="mt-4">
            <textarea
              name="interests"
              placeholder="e.g., Open source development, Machine Learning, Web Design"
              value={resumeData.interests}
              onChange={handleInputChange}
              rows="3"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeBuilder
