import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './CompilerPracticePage.css'

const languages = ['Python', 'Java', 'JavaScript', 'C', 'C++', 'Go', 'C#', 'PHP', 'Kotlin', 'Swift', 'Rust', 'Ruby']

const sampleProblems = [
  { title: 'FizzBuzz', difficulty: 'Beginner', tags: ['Math', 'Loops'], time: '15m' },
  { title: 'Balanced Brackets', difficulty: 'Intermediate', tags: ['Stacks', 'Strings'], time: '25m' },
  { title: 'Graph Paths', difficulty: 'Advanced', tags: ['Graphs', 'DFS'], time: '45m' },
]

export default function CompilerPracticePage() {
  const [language, setLanguage] = useState('Python')
  const [code, setCode] = useState('// Start writing your code here...')
  const [output, setOutput] = useState('Ready to run your code.')
  const [notes, setNotes] = useState('')
  const [aiFeedback, setAiFeedback] = useState([
    { line: 1, text: 'Imports the required library.' },
    { line: 2, text: 'Creates a variable.' },
    { line: 3, text: 'Defines the main function.' },
    { line: 4, text: 'Prints the output to the console.' },
  ])
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('edumind-notes')
    if (saved) setNotes(saved)
  }, [])

  const handleRun = async () => {
    setRunning(true)
    setOutput(`Running ${language} code...`)
    try {
      const { data } = await api.post('/execute/run', { language, code, timeout_seconds: 6 })


      let out = ''
      if (data.stdout) out += data.stdout
      if (data.stderr) out += (out ? '\n\n' : '') + 'STDERR:\n' + data.stderr
      if (!data.stdout && !data.stderr) out = '<no output>'
      setOutput(out)
    } catch (e) {
      console.error('Execute request exception', e)
      setOutput(`Execution request failed: ${String(e)}`)
    } finally {
      setRunning(false)
    }
  }

  const handleReset = () => {
    setCode('// Start writing your code here...')
    setOutput('Editor reset. Ready to run new code.')
  }

  const handleSave = () => {
    window.localStorage.setItem('edumind-notes', notes)
    setOutput('Notes saved locally for future reference.')
  }

  return (
    <div className="compiler-page">
      <div className="compiler-header glass-card">
        <div>
          <p className="eyebrow">Compiler & Practice</p>
          <h1>Code, test, and learn with AI feedback</h1>
          <p>Use the editor, execute code instantly, and get AI explanations for every line.</p>
        </div>
        <Link to="/skills-hub" className="ghost-btn">Back to Skills Hub</Link>
      </div>

      <div className="compiler-grid">
        <section className="compiler-panel glass-card">
          <div className="language-row">
            {languages.slice(0, 8).map((lang) => (
              <button key={lang} className={language === lang ? 'language-btn active' : 'language-btn'} onClick={() => setLanguage(lang)}>{lang}</button>
            ))}
          </div>
          <div className="editor-header">
            <span>{language} Editor</span>
            <div className="editor-actions">
              <button type="button" onClick={handleRun} disabled={running}>{running ? 'Running...' : 'Run'}</button>
              <button type="button" onClick={handleReset} disabled={running}>Reset</button>
              <button type="button" onClick={handleSave} disabled={running}>Save Notes</button>
            </div>
          </div>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} className="code-editor" />
          <div className="output-panel glass-card">
            <div className="output-header">
              <h2>Program Output</h2>
              <span>Execution Time: 0.14s • Memory: 18MB</span>
            </div>
            <pre>{output}</pre>
          </div>
        </section>

        <aside className="assistant-panel">
          <div className="glass-card ai-panel">
            <div className="panel-title">
              <p className="eyebrow">AI Tutor</p>
              <h2>Line-by-line explanation</h2>
            </div>
            <div className="ai-list">
              {aiFeedback.map((item) => (
                <div key={item.line} className="ai-item">
                  <span>Line {item.line}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Place notes first, then Recommended PDFs + Coding Challenges below it */}
      <div className="below-panels">
        <div className="glass-card notes-panel">
          <div className="panel-title">
            <p className="eyebrow">Notes</p>
            <h2>Personal study notes</h2>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="notes-editor"
            placeholder="Write your notes here..."
          />
          <button type="button" onClick={handleSave}>Save Notes</button>
        </div>

        <div className="stack-under-notes">
          <div className="glass-card resources-panel">
            <div className="panel-title">
              <p className="eyebrow">Recommended PDFs</p>
              <h2>{language} Resources</h2>
            </div>
            <div className="pdf-list">
              <div className="pdf-item"><span>Python Basics</span><button type="button">Download</button></div>
              <div className="pdf-item"><span>Python Data Structures</span><button type="button">Download</button></div>
              <div className="pdf-item"><span>Python Interview Questions</span><button type="button">Download</button></div>
            </div>
          </div>

          <div className="glass-card challenges-panel">
            <div className="panel-title">
              <p className="eyebrow">Coding Challenges</p>
              <h2>Practice problems</h2>
            </div>
            <div className="challenge-list">
              {sampleProblems.map((problem) => (
                <div key={problem.title} className="challenge-card">
                  <div>
                    <h3>{problem.title}</h3>
                    <p>{problem.tags.join(', ')}</p>
                  </div>
                  <div className="challenge-meta">
                    <span>{problem.difficulty}</span>
                    <span>{problem.time}</span>
                    <button type="button">Practice</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}