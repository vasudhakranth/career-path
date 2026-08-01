import { useRef } from 'react'
import html2pdf from 'html2pdf.js'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { Download, Share2 } from 'lucide-react'

const ResumePreview = ({ data = {} }) => {
  const resumeRef = useRef(null)

  const handleDownloadPDF = () => {
    const element = resumeRef.current
    if (!element) return

    const options = {
      margin: [10, 10, 10, 10],
      filename: `${data.name || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    }

    html2pdf().set(options).from(element).save()
  }

  const handleDownloadDocx = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ children: [new TextRun({ text: data.name || 'Your Name', bold: true, size: 28 })] }),
          new Paragraph({ children: [new TextRun({ text: data.email || '' })] }),
          new Paragraph({ children: [new TextRun({ text: data.phone || '' })] }),
          new Paragraph({ children: [new TextRun({ text: data.linkedin || '' })] }),
          new Paragraph({ children: [new TextRun({ text: data.github || '' })] }),
          new Paragraph({ children: [new TextRun({ text: data.portfolio || '' })] }),
          new Paragraph({ text: data.careerObjective || '' }),
          new Paragraph({ children: [new TextRun({ text: 'Skills', bold: true })] }),
          new Paragraph({ text: (data.skills || []).join(', ') }),
          new Paragraph({ children: [new TextRun({ text: 'Experience', bold: true })] }),
          ...(data.experience || []).map((exp) => new Paragraph({ text: `${exp.position || ''} @ ${exp.company || ''} | ${exp.duration || ''} | ${exp.description || ''} | ${exp.achievements || ''}` })),
          new Paragraph({ children: [new TextRun({ text: 'Projects', bold: true })] }),
          ...(data.projects || []).map((project) => new Paragraph({ text: `${project.name || ''} | ${project.description || ''} | ${project.technologies || ''} | ${project.achievements || ''}` })),
          new Paragraph({ children: [new TextRun({ text: 'Education', bold: true })] }),
          ...(data.education || []).map((edu) => new Paragraph({ text: `${edu.degree || ''} ${edu.field || ''} | ${edu.school || ''} | ${edu.year || ''} | ${edu.details || ''}` })),
          new Paragraph({ children: [new TextRun({ text: 'Certifications', bold: true })] }),
          ...(data.certifications || []).map((cert) => new Paragraph({ text: `${cert.name || ''} | ${cert.issuer || ''} | ${cert.date || ''} | ${cert.credentialId || ''}` })),
          new Paragraph({ children: [new TextRun({ text: 'Achievements', bold: true })] }),
          ...(data.achievements || []).map((achievement) => new Paragraph({ text: achievement })),
          new Paragraph({ children: [new TextRun({ text: 'Languages', bold: true })] }),
          ...(data.languages || []).map((lang) => new Paragraph({ text: `${lang.language || ''} | ${lang.proficiency || ''}` })),
          new Paragraph({ children: [new TextRun({ text: 'Interests', bold: true })] }),
          new Paragraph({ text: data.interests || '' }),
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(data.name || 'resume').replace(/\s+/g, '_')}.docx`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    const text = `Check out my resume built with EduMind!\n\nName: ${data.name}\nRole: ${data.selectedRole || 'Professional'}\n\nGenerated on EduMind - Career Roadmap & Resume Builder`
    if (navigator.share) {
      navigator.share({
        title: 'My Resume',
        text: text,
        url: window.location.href,
      })
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(text)
      alert('Resume details copied to clipboard!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 px-6 py-3 text-white font-semibold transition-all transform hover:scale-105"
        >
          <Download className="w-5 h-5" />
          Download as PDF
        </button>
        <button
          onClick={handleDownloadDocx}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6 py-3 text-white font-semibold transition-all transform hover:scale-105"
        >
          <Download className="w-5 h-5" />
          Download as DOCX
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 px-6 py-3 text-blue-300 font-semibold transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Share
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg bg-slate-600 hover:bg-slate-700 px-6 py-3 text-white font-semibold transition-colors"
        >
          Print
        </button>
      </div>

      {/* Resume Preview */}
      <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
        <div
          ref={resumeRef}
          className="bg-white text-slate-900 p-8 min-h-screen"
          style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: '1.6',
            color: '#1e293b',
          }}
        >
          {/* Header */}
          <div className="mb-6 pb-6 border-b-2 border-slate-300">
            <h1 className="text-4xl font-bold text-slate-900 mb-1">{data.name || 'Your Name'}</h1>
            {data.phone || data.email || data.linkedin ? (
              <div className="text-sm text-slate-600 space-y-1">
                {data.email && <div>{data.email}</div>}
                {data.phone && <div>{data.phone}</div>}
                {data.linkedin && (
                  <div>
                    <a href={data.linkedin} className="text-blue-600 hover:underline">
                      {data.linkedin}
                    </a>
                  </div>
                )}
                {data.github && (
                  <div>
                    <a href={data.github} className="text-blue-600 hover:underline">
                      {data.github}
                    </a>
                  </div>
                )}
                {data.portfolio && (
                  <div>
                    <a href={data.portfolio} className="text-blue-600 hover:underline">
                      {data.portfolio}
                    </a>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Professional Summary */}
          {data.careerObjective && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Professional Summary</h2>
              <p className="text-slate-700 text-sm">{data.careerObjective}</p>
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(
                  (skill, index) =>
                    skill && (
                      <span
                        key={index}
                        className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    )
                )}
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Experience</h2>
              <div className="space-y-4">
                {data.experience.map(
                  (exp, index) =>
                    exp.company && (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-slate-900">{exp.position}</h3>
                            <p className="text-slate-600 text-sm">{exp.company}</p>
                          </div>
                          {exp.duration && <span className="text-slate-600 text-sm font-medium">{exp.duration}</span>}
                        </div>
                        {exp.description && (
                          <p className="text-slate-700 text-sm mb-2">{exp.description}</p>
                        )}
                        {exp.achievements && (
                          <p className="text-slate-700 text-sm italic">Achievements: {exp.achievements}</p>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Projects</h2>
              <div className="space-y-4">
                {data.projects.map(
                  (project, index) =>
                    project.name && (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-slate-900">{project.name}</h3>
                          {project.link && (
                            <a href={project.link} className="text-blue-600 hover:underline text-sm">
                              Link
                            </a>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-slate-700 text-sm mb-2">{project.description}</p>
                        )}
                        {project.technologies && (
                          <p className="text-slate-600 text-sm mb-2">
                            <strong>Technologies:</strong> {project.technologies}
                          </p>
                        )}
                        {project.achievements && (
                          <p className="text-slate-700 text-sm italic">Key Achievements: {project.achievements}</p>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Education</h2>
              <div className="space-y-4">
                {data.education.map(
                  (edu, index) =>
                    edu.school && (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                            <p className="text-slate-600 text-sm">{edu.school}</p>
                          </div>
                          {edu.year && <span className="text-slate-600 text-sm font-medium">{edu.year}</span>}
                        </div>
                        {edu.field && <p className="text-slate-700 text-sm mb-1">Field: {edu.field}</p>}
                        {edu.details && <p className="text-slate-700 text-sm">{edu.details}</p>}
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Certifications</h2>
              <div className="space-y-3">
                {data.certifications.map(
                  (cert, index) =>
                    cert.name && (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900">{cert.name}</p>
                          <p className="text-slate-600 text-sm">{cert.issuer}</p>
                        </div>
                        <div className="text-right">
                          {cert.date && <p className="text-slate-600 text-sm">{cert.date}</p>}
                          {cert.credentialId && (
                            <p className="text-slate-600 text-sm">ID: {cert.credentialId}</p>
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Achievements */}
          {data.achievements && data.achievements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Achievements & Awards</h2>
              <ul className="list-disc list-inside space-y-2">
                {data.achievements.map(
                  (achievement, index) =>
                    achievement && (
                      <li key={index} className="text-slate-700 text-sm">
                        {achievement}
                      </li>
                    )
                )}
              </ul>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Languages</h2>
              <div className="space-y-2">
                {data.languages.map(
                  (lang, index) =>
                    lang.language && (
                      <div key={index} className="flex justify-between items-center">
                        <p className="text-slate-700 text-sm">{lang.language}</p>
                        <span className="bg-slate-300 text-slate-800 px-3 py-1 rounded text-xs font-medium">
                          {lang.proficiency}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Interests */}
          {data.interests && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Interests</h2>
              <p className="text-slate-700 text-sm">{data.interests}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-300 text-center text-xs text-slate-500">
            <p>Generated with EduMind - Professional Resume Builder</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
