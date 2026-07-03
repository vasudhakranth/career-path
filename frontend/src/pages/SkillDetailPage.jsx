import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const skillTopicMap = {
  html: {
    label: 'HTML',
    pageTitle: 'HTML Tutorial',
    groups: [
      {
        title: 'HTML Tutorial Topics',
        topics: [
          'HTML HOME',
          'HTML Introduction',
          'HTML Editors',
          'HTML Basic',
          'HTML Elements',
          'HTML Attributes',
          'HTML Headings',
          'HTML Paragraphs',
          'HTML Styles',
          'HTML Formatting',
          'HTML Quotations',
          'HTML Comments',
          'HTML Colors',
          'HTML CSS',
          'HTML Links',
          'HTML Images',
          'HTML Favicon',
          'HTML Page Title',
          'HTML Tables',
          'HTML Lists',
          'HTML Block & Inline',
          'HTML Div',
          'HTML Classes',
          'HTML Id',
          'HTML Buttons',
          'HTML Iframes',
          'HTML JavaScript',
          'HTML File Paths',
          'HTML Head',
          'HTML Layout',
          'HTML Responsive',
          'HTML Computercode',
          'HTML Semantics',
          'HTML Style Guide',
          'HTML Entities',
          'HTML Symbols',
          'HTML Emojis',
          'HTML Charsets',
          'HTML URL Encode',
          'HTML vs. XHTML',
        ],
      },
      {
        title: 'HTML Forms',
        topics: [
          'HTML Forms',
          'HTML Form Attributes',
          'HTML Form Elements',
          'HTML Input Types',
          'HTML Input Attributes',
          'Input Form Attributes',
        ],
      },
      {
        title: 'HTML Graphics',
        topics: ['HTML Canvas', 'HTML SVG'],
      },
      {
        title: 'HTML Media',
        topics: ['HTML Media', 'HTML Video', 'HTML Audio', 'HTML Plug-ins', 'HTML YouTube'],
      },
      {
        title: 'HTML APIs',
        topics: ['HTML Web APIs', 'HTML Geolocation', 'HTML Drag and Drop', 'HTML Web Storage', 'HTML Web Workers', 'HTML SSE'],
      },
      {
        title: 'HTML Cert',
        topics: ['HTML Certificate'],
      },
      {
        title: 'HTML Examples',
        topics: ['HTML Examples', 'HTML Editor', 'HTML Quiz', 'HTML Exercises', 'HTML Challenges', 'HTML Website', 'HTML Syllabus', 'HTML Study Plan', 'HTML Interview Prep', 'HTML Bootcamp', 'HTML Summary', 'HTML Accessibility'],
      },
      {
        title: 'HTML References',
        topics: ['HTML Tag List', 'HTML Attributes', 'HTML Global Attributes', 'HTML Browser Support', 'HTML Events', 'HTML Colors', 'HTML Canvas', 'HTML Audio/Video', 'HTML Doctypes', 'HTML Character Sets', 'HTML URL Encode', 'HTML Lang Codes', 'HTTP Messages', 'HTTP Methods', 'PX to EM Converter', 'Keyboard Shortcuts'],
      },
    ],
  },
  css: {
    label: 'CSS',
    pageTitle: 'CSS Tutorial',
    groups: [
      {
        title: 'CSS Fundamentals',
        topics: ['CSS Introduction', 'CSS Syntax', 'CSS Selectors', 'CSS Colors', 'CSS Backgrounds', 'CSS Borders', 'CSS Margin', 'CSS Padding', 'CSS Height', 'CSS Width', 'CSS Box Model', 'CSS Display', 'CSS Positioning', 'CSS Flexbox', 'CSS Grid'],
      },
      {
        title: 'CSS Styling',
        topics: ['CSS Fonts', 'CSS Text', 'CSS Lists', 'CSS Tables', 'CSS Responsive', 'CSS Transitions', 'CSS Animations', 'CSS Variables', 'CSS Pseudo-classes', 'CSS Pseudo-elements'],
      },
      {
        title: 'CSS Advanced',
        topics: ['CSS Media Queries', 'CSS Frameworks', 'CSS Layouts', 'CSS Specificity', 'CSS Cascading', 'CSS Functions', 'CSS Custom Properties'],
      },
    ],
  },
  javascript: {
    label: 'JavaScript',
    pageTitle: 'JavaScript Tutorial',
    groups: [
      {
        title: 'JavaScript Basics',
        topics: ['JavaScript Introduction', 'JavaScript Syntax', 'JavaScript Variables', 'JavaScript Data Types', 'JavaScript Operators', 'JavaScript Functions', 'JavaScript Events', 'JavaScript DOM', 'JavaScript Arrays', 'JavaScript Objects'],
      },
      {
        title: 'JavaScript Intermediate',
        topics: ['JavaScript Loops', 'JavaScript Conditionals', 'JavaScript API', 'JavaScript Fetch', 'JavaScript Async', 'JavaScript Promises', 'JavaScript ES6', 'JavaScript Classes', 'JavaScript Modules'],
      },
      {
        title: 'JavaScript Advanced',
        topics: ['JavaScript Closures', 'JavaScript Scope', 'JavaScript Hoisting', 'JavaScript Error Handling', 'JavaScript Debugging', 'JavaScript Performance'],
      },
    ],
  },
  python: {
    label: 'Python',
    pageTitle: 'Python Tutorial',
    groups: [
      {
        title: 'Python Fundamentals',
        topics: ['Python Introduction', 'Python Setup', 'Python Syntax', 'Python Variables', 'Python Data Types', 'Python Operators', 'Python Strings', 'Python Lists', 'Python Tuples', 'Python Dictionaries'],
      },
      {
        title: 'Python Control Flow',
        topics: ['Python Conditionals', 'Python Loops', 'Python Functions', 'Python Modules', 'Python File I/O', 'Python Exceptions'],
      },
      {
        title: 'Python Advanced',
        topics: ['Python OOP', 'Python Libraries', 'Python Web', 'Python APIs', 'Python Data Analysis', 'Python Testing'],
      },
    ],
  },
}

function slugifyTopic(topic) {
  return topic
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function findTopicBySlug(skill, topicSlug) {
  if (!skill || !topicSlug) return null
  return skill.groups
    .flatMap((group) => group.topics)
    .find((topic) => slugifyTopic(topic) === topicSlug)
}

function getTopicContent(skillLabel, topic) {
  const baseDescription = `Explore ${topic} as part of the ${skillLabel} tutorial. This section introduces the concepts, examples, and best practices you need to understand ${topic}.`

  const examples = {
    HTML: `<div>\n  <h1>${topic}</h1>\n  <p>Welcome to your ${skillLabel} topic content.</p>\n</div>`,
    CSS: `.${topic.toLowerCase().replace(/\s+/g, '-')} {\n  color: #8b5cf6;\n  padding: 1rem;\n  background: rgba(148, 163, 184, 0.12);\n  border-radius: 0.75rem;\n}`,
    JavaScript: `const showTopic = () => {\n  console.log('Learning ${topic}');\n};\n\nshowTopic();`,
    Python: `def show_topic():\n    print('Learning ${topic}')\n\nshow_topic()`,
  }

  return {
    description: baseDescription,
    code: examples[skillLabel] || `# ${topic}\nprint('Learning ${topic}')`,
    language: skillLabel.toLowerCase(),
  }
}

export default function SkillDetailPage() {
  const { skillName, topicSlug } = useParams()
  const slug = skillName?.toLowerCase() || ''
  const skill = skillTopicMap[slug]
  const navigate = useNavigate()

  const topicList = useMemo(() => (skill ? skill.groups.flatMap((group) => group.topics) : []), [skill])
  const initialTopic = useMemo(() => {
    if (!skill) return null
    if (topicSlug) {
      return findTopicBySlug(skill, topicSlug) || topicList[0] || null
    }
    return topicList[0] || null
  }, [skill, topicList, topicSlug])

  const [selectedTopic, setSelectedTopic] = useState(initialTopic)

  useEffect(() => {
    setSelectedTopic(initialTopic)
  }, [initialTopic])

  if (!skill) {
    return (
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 text-center">
        <h1 className="text-4xl font-bold text-white">Skill not found</h1>
        <p className="mt-4 text-slate-400">Try selecting HTML, CSS, JavaScript, or Python from the Skills page.</p>
        <Link
          to="/skills"
          className="mt-8 inline-flex rounded-full border border-violet-500 px-6 py-3 text-sm font-semibold text-violet-200 hover:bg-violet-500/10"
        >
          Back to Skills
        </Link>
      </div>
    )
  }

  const selectedIndex = topicList.indexOf(selectedTopic)
  const progressPercent = topicList.length ? Math.round(((selectedIndex + 1) / topicList.length) * 100) : 0
  const topicContent = selectedTopic ? getTopicContent(skill.label, selectedTopic) : null

  const getNextTopic = () => {
    if (selectedIndex < topicList.length - 1) {
      const nextTopic = topicList[selectedIndex + 1]
      const nextSlug = slugifyTopic(nextTopic)
      navigate(`/skills/${slug}/${nextSlug}`)
    }
  }

  const getPrevTopic = () => {
    if (selectedIndex > 0) {
      const prevTopic = topicList[selectedIndex - 1]
      const prevSlug = slugifyTopic(prevTopic)
      navigate(`/skills/${slug}/${prevSlug}`)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="sticky top-6 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.4em] text-violet-300">{skill.pageTitle}</p>
          <h2 className="mt-4 text-3xl font-bold text-white">{skill.label} Topics</h2>
          <p className="mt-2 text-sm text-slate-400">Select a topic to explore the details.</p>
        </div>

        <div className="space-y-6">
          {skill.groups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{group.title}</p>
              <div className="space-y-2 rounded-3xl border border-slate-800 bg-slate-950/70 p-3">
                {group.topics.map((topic) => {
                  const isActive = topic === selectedTopic
                  return (
                    <Link
                      key={topic}
                      to={`/skills/${slug}/${slugifyTopic(topic)}`}
                      className={`block rounded-2xl px-4 py-3 text-sm transition ${
                        isActive ? 'bg-violet-500/20 text-white shadow-sm shadow-violet-500/10' : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                      }`}
                    >
                      {topic}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="space-y-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-violet-300">{skill.pageTitle}</p>
              <h1 className="mt-4 text-4xl font-bold text-white">{selectedTopic}</h1>
            </div>
            <Link
              to="/skills"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
            >
              Back to Skills
            </Link>
          </div>

          <p className="mt-6 max-w-3xl text-slate-300">{topicContent.description}</p>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Code Example</p>
                <p className="mt-1 text-sm text-slate-500">{skill.label} snippet for {selectedTopic}</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                {topicContent.language}
              </span>
            </div>
            <pre className="mt-6 overflow-x-auto rounded-3xl bg-slate-950 px-4 py-5 text-sm leading-6 text-slate-100">
              <code>{topicContent.code}</code>
            </pre>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Topic Summary</h3>
              <p className="mt-4 text-slate-300">
                This section guides you through {selectedTopic} in a structured way. Use the sidebar to jump between related topics and learn step-by-step.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Progress</h3>
              <p className="mt-3 text-slate-400">{selectedIndex + 1} of {topicList.length} topics completed</p>
              <div className="mt-4 rounded-3xl bg-slate-900/80 p-1">
                <div className="h-3 rounded-3xl bg-violet-500 transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">{progressPercent}% through the {skill.label} topic list.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={selectedIndex <= 0}
            onClick={getPrevTopic}
            className="rounded-3xl border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous Topic
          </button>
          <button
            type="button"
            disabled={selectedIndex >= topicList.length - 1}
            onClick={getNextTopic}
            className="rounded-3xl border border-violet-500 bg-violet-500/20 px-6 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next Topic
          </button>
        </div>
      </section>
    </div>
  )
}
