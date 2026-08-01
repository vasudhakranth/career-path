import { useMemo, useState } from 'react'
import {
  CalendarClock,
  Clock3,
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  Wand2,
  Bot,
  ListChecks,
  BarChart3,
  Coffee,
  BookOpen,
  ClipboardList,
  Timer,
  AlertTriangle,
} from 'lucide-react'
import './SmartTimeTablePage.css'

const steps = [
  'Basic Information',
  'Primary Goal',
  'Productivity Pattern',
  'Focus Style',
  'Fixed Schedule',
  'Add Tasks',
  'Daily Habits',
  'AI Preferences',
]

const categories = [
  'Study',
  'Coding',
  'Placement',
  'Reading',
  'Office',
  'Personal',
  'Fitness',
  'Health',
  'Entertainment',
  'Others',
]

const priorities = ['High', 'Medium', 'Low']
const difficulties = ['Easy', 'Medium', 'Hard']

const fixedActivitiesSeed = [
  'College',
  'Office',
  'Coaching',
  'Gym',
  'Classes',
  'Travel',
  'Meals',
  'Sleep',
  'Prayer',
  'Family Time',
]

const dayHabitsSeed = [
  'Drink Water',
  'Exercise',
  'Meditation',
  'Walking',
  'Reading',
  'Journal Writing',
  'Sleep Reminder',
  'Break Reminder',
]

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function toMinutes(hhmm) {
  // expects '5:00 AM'
  const [time, mer] = hhmm.trim().split(' ')
  const [hStr, mStr] = time.split(':')
  let h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  if (mer.toUpperCase() === 'PM' && h !== 12) h += 12
  if (mer.toUpperCase() === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function minutesToLabel(totalMinutes) {
  const m = ((totalMinutes % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const mins = m % 60
  const mer = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const mm = String(mins).padStart(2, '0')
  return `${h12}:${mm} ${mer}`
}

function addMinutesLabel(label, mins) {
  return minutesToLabel(toMinutes(label) + mins)
}

function computeTimeWindow(wakeUp, sleep) {
  const wake = toMinutes(wakeUp)
  const slp = toMinutes(sleep)
  // assume sleep is after wake; if not, wrap by +24h
  const end = slp <= wake ? slp + 1440 : slp
  return { start: wake, end }
}

function generateMockSchedule(params) {
  const {
    wakeUp,
    sleep,
    primaryGoals,
    productivityPattern,
    focusStyle,
    fixedActivities,
    tasks,
    habits,
  } = params

  const { start, end } = computeTimeWindow(wakeUp, sleep)

  // Focus windows based on productivityPattern (mock)
  const patternBoost = {
    'Early Morning': [60, 180],
    Morning: [120, 240],
    Afternoon: [240, 360],
    Evening: [360, 480],
    Night: [480, 600],
  }[productivityPattern] || [120, 240]

  const focusMinutes =
    focusStyle === '25 Minutes' ? 25 : focusStyle === '45 Minutes' ? 45 : focusStyle === '60 Minutes' ? 60 : 90

  const bufferMinutes = 10
  const breakMinutes = focusMinutes === 25 ? 5 : focusMinutes === 45 ? 8 : focusMinutes === 60 ? 10 : 12

  // Reserve fixed blocks (simple mock): meals + sleep + travel/college/office
  const reserved = new Set()

  // We'll create a linear timeline by chunks.
  let cursor = start

  // Warm-up exercise
  const warm = { label: 'Exercise', duration: 20, type: 'fixed' }
  const breakfast = { label: 'Breakfast', duration: 25, type: 'fixed' }
  const lunch = { label: 'Lunch', duration: 30, type: 'fixed' }
  const dinner = { label: 'Dinner', duration: 30, type: 'fixed' }

  const placements = [wakeUp, '8:00 AM', '1:00 PM', '8:00 PM']

  const timeline = []

  const pushBlock = (title, duration, meta = {}) => {
    const startLabel = minutesToLabel(cursor)
    const endLabel = minutesToLabel(cursor + duration)
    timeline.push({
      start: startLabel,
      end: endLabel,
      title,
      duration,
      ...meta,
    })
    cursor += duration
  }

  const maybePush = (block, atMinuteApprox) => {
    const target = Math.round(toMinutes(atMinuteApprox))
    // if we're far from target, just push anyway if room
    if (cursor + block.duration + bufferMinutes <= end) {
      if (Math.abs(cursor - target) > 45) {
        cursor = clamp(cursor, start, end)
      }
      pushBlock(block.label, block.duration, { type: block.type || 'fixed' })
    }
  }

  // Fixed warm-up + meals
  maybePush(warm, placements[0])
  if (cursor + breakfast.duration + bufferMinutes <= end) pushBlock(breakfast.label, breakfast.duration, { type: 'fixed' })

  // Main tasks: prioritize high priority first
  const priorityWeight = { High: 3, Medium: 2, Low: 1 }
  const difficultyWeight = { Hard: 3, Medium: 2, Easy: 1 }

  const sortedTasks = [...tasks]
    .filter((t) => t.name.trim().length > 0)
    .sort((a, b) => {
      const wa = priorityWeight[a.priority] * 10 + difficultyWeight[a.difficulty]
      const wb = priorityWeight[b.priority] * 10 + difficultyWeight[b.difficulty]
      return wb - wa
    })

  const peakStart = start + patternBoost[0]
  const peakEnd = start + patternBoost[1]

  const pickTask = (i) => sortedTasks[i % Math.max(1, sortedTasks.length)]

  let taskIndex = 0

  // Add habits micro blocks
  const habitBlocks = habits.slice(0, 3)

  while (cursor + bufferMinutes + Math.min(focusMinutes, 25) <= end) {
    // Insert smart breaks before leaving peak window
    const inPeak = cursor >= peakStart && cursor <= peakEnd
    const task = pickTask(taskIndex)
    const isDifficult = task.difficulty === 'Hard'

    // Prefer difficult tasks during peak; if not in peak, allow easier tasks.
    if (!inPeak && isDifficult && Math.random() < 0.6) {
      // swap to an easier/medium task
      const alt = sortedTasks.find((t) => t.difficulty !== 'Hard') || task
      pushBlock(`Focus: ${alt.name}`, focusMinutes, {
        type: 'task',
        category: alt.category,
        priority: alt.priority,
        difficulty: alt.difficulty,
        goal: primaryGoals[0] || 'General',
      })
      pushBlock('Smart Break', breakMinutes, { type: 'break' })
      cursor += bufferMinutes
      taskIndex += 1
      continue
    }

    if (cursor + focusMinutes > end) break

    if (cursor + focusMinutes + bufferMinutes > end) break

    pushBlock(`Focus: ${task.name}`, focusMinutes, {
      type: 'task',
      category: task.category,
      priority: task.priority,
      difficulty: task.difficulty,
      goal: primaryGoals[0] || 'General',
    })

    cursor += bufferMinutes

    // Breaks and occasional habits
    pushBlock('Smart Break', breakMinutes, { type: 'break' })

    const habitChance = 0.25
    if (habitBlocks.length && Math.random() < habitChance && cursor + 10 <= end) {
      pushBlock(`Habit: ${habitBlocks[(taskIndex + timeline.length) % habitBlocks.length]}`, 10, { type: 'habit' })
    }

    // Meals insertion by time (simple)
    if (cursor > start + 240 && cursor < start + 280) {
      if (cursor + lunch.duration + bufferMinutes <= end) pushBlock('Lunch', lunch.duration, { type: 'fixed' })
    }
    if (cursor > start + 480 && cursor < start + 540) {
      if (cursor + dinner.duration + bufferMinutes <= end) pushBlock('Dinner', dinner.duration, { type: 'fixed' })
    }

    taskIndex += 1

    // Stop if near end
    if (cursor + 30 >= end) break
  }

  // Cool down / reading / revision
  if (cursor + 35 <= end) pushBlock('Revision / Planning', 35, { type: 'task', category: 'Placement', priority: 'Medium', difficulty: 'Easy' })

  // Sleep if available window still has time
  // (Sleep time is boundary; timeline ends before end.)

  // Score mock
  const totalTaskMinutes = timeline.filter((b) => b.type === 'task').reduce((acc, b) => acc + b.duration, 0)
  const focusTimeMinutes = timeline.filter((b) => b.type === 'task').reduce((acc, b) => acc + b.duration, 0)
  const breakTimeMinutes = timeline.filter((b) => b.type === 'break').reduce((acc, b) => acc + b.duration, 0)

  const availableMinutes = end - start
  const focusPct = availableMinutes ? Math.round((focusTimeMinutes / availableMinutes) * 100) : 0
  const completedMock = Math.round((0.7 + Math.random() * 0.2) * tasks.length)
  const completedPct = tasks.length ? Math.round((completedMock / tasks.length) * 100) : 0

  const productivityScore = clamp(Math.round(40 + focusPct * 0.6 + completedPct * 0.25 - breakTimeMinutes * 0.02), 0, 100)

  return {
    timeline,
    productivityScore,
    availableMinutes,
    completedMock,
    remainingMock: Math.max(0, tasks.length - completedMock),
    focusTimeMinutes,
    breakTimeMinutes,
    productivityPct: completedPct,
  }
}

function PremiumIcon({ children, className = '' }) {
  return <div className={`premium-icon ${className}`}>{children}</div>
}

function ProgressRing({ value }) {
  const radius = 28
  const stroke = 6
  const normalizedRadius = radius - stroke * 0.5
  const circumference = normalizedRadius * 2 * Math.PI
  const clamped = clamp(value, 0, 100)
  const strokeDashoffset = circumference - (clamped / 100) * circumference

  return (
    <div className="ring-wrap">
      <svg height="72" width="72" className="ring">
        <circle
          stroke="#2dd4bf"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="36"
          cy="36"
          style={{ opacity: 0.25 }}
        />
        <circle
          stroke="#22c55e"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx="36"
          cy="36"
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.8s ease',
          }}
        />
      </svg>
      <div className="ring-center">
        <div className="ring-value">{clamped}</div>
        <div className="ring-label">Score</div>
      </div>
    </div>
  )
}

export default function SmartTimeTablePage() {
  const [mode, setMode] = useState('landing') // landing | wizard | dashboard
  const [step, setStep] = useState(0)

  const [wakeUp, setWakeUp] = useState('5:00 AM')
  const [sleep, setSleep] = useState('10:00 PM')
  const [profileType, setProfileType] = useState('Student')

  const [primaryGoals, setPrimaryGoals] = useState(['Crack Placement'])

  const [productivityPattern, setProductivityPattern] = useState('Morning')
  const [focusStyle, setFocusStyle] = useState('25 Minutes')

  const [fixedActivities, setFixedActivities] = useState(['College', 'Meals'])

  const [tasks, setTasks] = useState([
    {
      name: 'DSA Practice',
      category: 'Placement',
      duration: 90,
      priority: 'High',
      difficulty: 'Hard',
      deadline: 'Today 9:00 PM',
      notes: 'Focus on graphs + DP',
    },
    {
      name: 'React Project',
      category: 'Coding',
      duration: 60,
      priority: 'Medium',
      difficulty: 'Medium',
      deadline: 'Today 6:00 PM',
      notes: 'Build features for portfolio',
    },
  ])

  const [habits, setHabits] = useState(['Drink Water', 'Break Reminder', 'Sleep Reminder'])

  const [aiPrefs, setAiPrefs] = useState({
    autoSchedule: true,
    autoRearrange: true,
    smartBreaks: true,
    moveIncompleteToTomorrow: true,
    goalBasedScheduling: true,
    avoidBurnout: true,
    smartNotifications: true,
  })

  const isWizard = mode === 'wizard'

  const derived = useMemo(() => {
    const { start, end } = computeTimeWindow(wakeUp, sleep)
    const availableMinutes = end - start
    const availableHours = Math.max(0, availableMinutes / 60)
    return { availableMinutes, availableHours }
  }, [wakeUp, sleep])

  const generated = useMemo(() => {
    if (mode !== 'dashboard') return null
    return generateMockSchedule({
      wakeUp,
      sleep,
      primaryGoals,
      productivityPattern,
      focusStyle,
      fixedActivities,
      tasks,
      habits,
    })
  }, [mode, wakeUp, sleep, primaryGoals, productivityPattern, focusStyle, fixedActivities, tasks, habits])

  const [taskForm, setTaskForm] = useState({
    name: '',
    category: 'Study',
    duration: 45,
    priority: 'Medium',
    difficulty: 'Easy',
    deadline: 'Today',
    notes: '',
  })

  const [notifications, setNotifications] = useState([])

  const startWizard = () => {
    setMode('wizard')
    setStep(0)
    setNotifications([])
  }

  const goNext = () => {
    setStep((s) => Math.min(steps.length - 1, s + 1))
  }

  const goPrev = () => {
    setStep((s) => Math.max(0, s - 1))
  }

  const canContinue = () => {
    if (step === 0) return Boolean(wakeUp && sleep)
    if (step === 1) return primaryGoals.length > 0
    if (step === 5) return tasks.length > 0
    return true
  }

  const addTask = () => {
    if (!taskForm.name.trim()) return
    setTasks((prev) => [...prev, { ...taskForm }])
    setTaskForm({
      name: '',
      category: 'Study',
      duration: 45,
      priority: 'Medium',
      difficulty: 'Easy',
      deadline: 'Today',
      notes: '',
    })
  }

  const removeTask = (idx) => {
    setTasks((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateTask = (idx, patch) => {
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)))
  }

  const toggleGoal = (goal) => {
    setPrimaryGoals((prev) => {
      if (prev.includes(goal)) return prev.filter((g) => g !== goal)
      return [...prev, goal]
    })
  }

  const goalChoices = [
    'Crack Placement',
    'Learn Full Stack Development',
    'DSA Preparation',
    'React Learning',
    'Python Learning',
    'Crack APPSC',
    'Crack UPSC',
    'GATE Preparation',
    'CAT Preparation',
    'Improve Communication Skills',
    'Build Portfolio',
    'Freelancing',
    'Interview Preparation',
    'Learn AI',
    'Learn Data Science',
    'Build Startup',
  ]

  const fixedChoices = fixedActivitiesSeed
  const profileChoices = ['Student', 'Working Professional', 'College Student', 'Job Seeker', 'Freelancer', 'Other']
  const productivityChoices = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night']
  const focusChoices = ['25 Minutes', '45 Minutes', '60 Minutes', '90 Minutes']

  const wizardSubmit = () => {
    // mock AI generation
    setMode('dashboard')

    const sample = [
      'AI: Time to start DSA Practice.',
      'AI: Take a 10-minute break.',
      'AI: Drink Water.',
      'AI: Lunch Time.',
      'AI: Resume your study session.',
    ]
    setNotifications(sample)
  }

  const resetToLanding = () => {
    setMode('landing')
    setStep(0)
    setNotifications([])
  }

  return (
    <div className="st-page">
      <div className="st-bg" />

      {mode === 'landing' && (
        <>
          <section className="st-hero">
            <div className="st-hero-inner">
              <div className="st-hero-left">
                <div className="st-pill">
                  <Sparkles size={16} />
                  Smart Time Table • AI-powered daily planning
                </div>

                <h1 className="st-h1">Plan Smarter. Achieve More Every Day.</h1>

                <p className="st-sub">
                  Smart Time Table uses Artificial Intelligence to organize your day intelligently. It understands your
                  goals, priorities, available time, and energy levels to generate the perfect daily schedule that
                  maximizes productivity while maintaining work-life balance.
                </p>

                <div className="st-feature-badges">
                  <div className="st-badge">
                    <BrainCircuit size={16} /> AI Powered Scheduling
                  </div>
                  <div className="st-badge">
                    <Wand2 size={16} /> Smart Time Management
                  </div>
                  <div className="st-badge">
                    <BarChart3 size={16} /> Productivity Optimization
                  </div>
                  <div className="st-badge">
                    <Bot size={16} /> Auto Rescheduling
                  </div>
                  <div className="st-badge">
                    <ListChecks size={16} /> Goal Tracking
                  </div>
                  <div className="st-badge">
                    <CalendarClock size={16} /> Daily Analytics
                  </div>
                </div>

                <div className="st-cta-wrap">
                  <div className="st-premium-card">
                    <div>
                      <h2 className="st-cta-title">Ready To Build Your Perfect Day?</h2>
                      <p className="st-cta-desc">
                        Answer a few questions and let EduMind AI generate your personalized Smart Time Table in less
                        than a minute.
                      </p>
                    </div>

                    <button className="st-gradient-btn" onClick={startWizard}>
                      <Sparkles size={18} /> Generate Smart Time Table
                    </button>
                  </div>
                </div>

                <div className="st-why-grid">
                  {[
                    { title: 'Complete More Tasks', desc: 'Finish important work without feeling overwhelmed.' },
                    { title: 'Increase Productivity', desc: 'AI arranges tasks based on your peak focus hours.' },
                    { title: 'Reduce Stress', desc: 'Never worry about forgetting important tasks.' },
                    { title: 'Build Consistency', desc: 'Develop better habits every day.' },
                    { title: 'Maintain Work-Life Balance', desc: 'Study, work, exercise, and rest in perfect balance.' },
                    { title: 'Achieve Goals Faster', desc: 'Reach Placement, UPSC, APPSC, DSA, or Career goals with structured planning.' },
                  ].map((c) => (
                    <div key={c.title} className="st-why-card">
                      <div className="st-why-icon">
                        <CheckCircle2 size={18} />
                      </div>
                      <h3 className="st-why-title">{c.title}</h3>
                      <p className="st-why-desc">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="st-hero-right">
                <div className="st-illustration-card">
                  <div className="st-illustration-3d">
                    <div className="st-illu-row">
                      <PremiumIcon>
                        <CalendarClock size={18} />
                      </PremiumIcon>
                      <PremiumIcon>
                        <Clock3 size={18} />
                      </PremiumIcon>
                      <PremiumIcon>
                        <Coffee size={18} />
                      </PremiumIcon>
                      <PremiumIcon>
                        <BookOpen size={18} />
                      </PremiumIcon>
                      <PremiumIcon>
                        <ClipboardList size={18} />
                      </PremiumIcon>
                    </div>

                    <div className="st-illu-main">
                      <div className="st-illu-glass">
                        <div className="st-illu-title">AI Calendar</div>
                        <div className="st-illu-sub">Generated timeline + analytics</div>
                        <div className="st-illu-graph">
                          <div className="st-graph-bars">
                            {[10, 18, 14, 22, 28, 24, 32].map((h, i) => (
                              <div key={i} className="st-bar" style={{ height: `${h + i * 2}px` }} />
                            ))}
                          </div>
                        </div>
                        <div className="st-illu-checks">
                          {['Checklist', 'Productivity Graph', 'AI Assistant'].map((t) => (
                            <div key={t} className="st-illu-check">
                              <span className="st-illu-dot" />
                              {t}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="st-illu-assistant">
                        <div className="st-assistant-chip">
                          <Sparkles size={16} /> AI Assistant
                        </div>
                        <div className="st-assistant-lines">
                          <div className="st-sline" />
                          <div className="st-sline short" />
                          <div className="st-sline" />
                          <div className="st-sline short" />
                        </div>
                        <div className="st-assistant-footer">
                          <Timer size={14} /> Smart focus sessions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="st-hero-right-note">
                  <div className="st-note-pill">
                    <AlertTriangle size={16} /> Premium workflow • glass UI • micro-animations
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {isWizard && (
        <section className="st-wizard">
          <div className="st-wizard-inner">
            <div className="st-wizard-top">
              <div>
                <div className="st-wizard-kicker">Smart Time Table Setup Wizard</div>
                <h2 className="st-wizard-title">Tell EduMind what your day looks like</h2>
              </div>
              <div className="st-wizard-metric">
                <div className="st-wizard-metric-label">Available Productive Hours</div>
                <div className="st-wizard-metric-value">{derived.availableHours.toFixed(1)} hrs</div>
              </div>
            </div>

            <div className="st-progress">
              {steps.map((s, idx) => {
                const active = idx === step
                const done = idx < step
                return (
                  <div key={s} className={`st-progress-step ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
                    <div className="st-progress-dot" />
                    <div className="st-progress-label">{idx + 1}</div>
                  </div>
                )
              })}
            </div>

            <div className="st-wizard-body">
              {step === 0 && (
                <div className="st-step">
                  <h3 className="st-step-title">Step 1 – Basic Information</h3>

                  <div className="st-form-grid">
                    <label className="st-field">
                      <span className="st-label">What time do you wake up?</span>
                      <input
                        className="st-input"
                        value={wakeUp}
                        onChange={(e) => setWakeUp(e.target.value)}
                        placeholder="5:00 AM"
                      />
                    </label>

                    <label className="st-field">
                      <span className="st-label">What time do you sleep?</span>
                      <input
                        className="st-input"
                        value={sleep}
                        onChange={(e) => setSleep(e.target.value)}
                        placeholder="10:00 PM"
                      />
                    </label>

                    <label className="st-field st-field-full">
                      <span className="st-label">Do you work or study?</span>
                      <div className="st-radio-grid">
                        {profileChoices.map((p) => (
                          <button
                            key={p}
                            type="button"
                            className={`st-radio ${profileType === p ? 'active' : ''}`}
                            onClick={() => setProfileType(p)}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </label>
                  </div>

                  <div className="st-inline-hint">EduMind will calculate your available productive hours automatically.</div>
                </div>
              )}

              {step === 1 && (
                <div className="st-step">
                  <h3 className="st-step-title">Step 2 – Primary Goal</h3>

                  <p className="st-muted">What is your primary goal? Allow multiple goals.</p>

                  <div className="st-chip-grid">
                    {goalChoices.map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`st-chip ${primaryGoals.includes(g) ? 'active' : ''}`}
                        onClick={() => toggleGoal(g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div className="st-selected">
                    <span className="st-selected-label">Selected:</span>
                    {primaryGoals.length ? primaryGoals.join(', ') : 'None yet'}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="st-step">
                  <h3 className="st-step-title">Step 3 – Productivity Pattern</h3>
                  <p className="st-muted">When are you most productive? EduMind schedules difficult tasks during these hours.</p>

                  <div className="st-radio-grid">
                    {productivityChoices.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`st-radio ${productivityPattern === p ? 'active' : ''}`}
                        onClick={() => setProductivityPattern(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="st-step">
                  <h3 className="st-step-title">Step 4 – Focus Style</h3>
                  <p className="st-muted">Maximum continuous focus. Automatically enable Pomodoro mode.</p>

                  <div className="st-radio-grid">
                    {focusChoices.map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={`st-radio ${focusStyle === f ? 'active' : ''}`}
                        onClick={() => setFocusStyle(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <div className="st-inline-hint">Pomodoro will be adjusted to your focus session length.</div>
                </div>
              )}

              {step === 4 && (
                <div className="st-step">
                  <h3 className="st-step-title">Step 5 – Fixed Schedule</h3>
                  <p className="st-muted">Add daily fixed activities. These tasks cannot be moved.</p>

                  <div className="st-chip-grid">
                    {fixedChoices.map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={`st-chip ${fixedActivities.includes(f) ? 'active' : ''}`}
                        onClick={() => {
                          setFixedActivities((prev) => {
                            if (prev.includes(f)) return prev.filter((x) => x !== f)
                            return [...prev, f]
                          })
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="st-step">
                  <h3 className="st-step-title">Step 6 – Add Tasks</h3>
                  <p className="st-muted">Support unlimited tasks.</p>

                  <div className="st-task-builder">
                    <div className="st-task-form">
                      <div className="st-form-grid st-form-grid-2">
                        <label className="st-field">
                          <span className="st-label">Task Name</span>
                          <input
                            className="st-input"
                            value={taskForm.name}
                            onChange={(e) => setTaskForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="e.g., DSA Practice"
                          />
                        </label>

                        <label className="st-field">
                          <span className="st-label">Category</span>
                          <select
                            className="st-input"
                            value={taskForm.category}
                            onChange={(e) => setTaskForm((p) => ({ ...p, category: e.target.value }))}
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="st-field">
                          <span className="st-label">Estimated Duration (minutes)</span>
                          <input
                            className="st-input"
                            type="number"
                            min={5}
                            value={taskForm.duration}
                            onChange={(e) => setTaskForm((p) => ({ ...p, duration: parseInt(e.target.value || '0', 10) }))}
                          />
                        </label>

                        <label className="st-field">
                          <span className="st-label">Priority</span>
                          <select
                            className="st-input"
                            value={taskForm.priority}
                            onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}
                          >
                            {priorities.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="st-field">
                          <span className="st-label">Difficulty</span>
                          <select
                            className="st-input"
                            value={taskForm.difficulty}
                            onChange={(e) => setTaskForm((p) => ({ ...p, difficulty: e.target.value }))}
                          >
                            {difficulties.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="st-field">
                          <span className="st-label">Deadline</span>
                          <input
                            className="st-input"
                            value={taskForm.deadline}
                            onChange={(e) => setTaskForm((p) => ({ ...p, deadline: e.target.value }))}
                            placeholder="Today 9:00 PM"
                          />
                        </label>

                        <label className="st-field st-field-full">
                          <span className="st-label">Notes</span>
                          <input
                            className="st-input"
                            value={taskForm.notes}
                            onChange={(e) => setTaskForm((p) => ({ ...p, notes: e.target.value }))}
                            placeholder="What should you focus on?"
                          />
                        </label>
                      </div>

                      <div className="st-task-actions">
                        <button type="button" className="st-gradient-btn st-gradient-btn-sm" onClick={addTask}>
                          <Sparkles size={16} /> Add Task
                        </button>
                      </div>
                    </div>

                    <div className="st-task-list">
                      <div className="st-task-list-header">
                        <div>
                          <div className="st-task-list-title">Your Tasks</div>
                          <div className="st-task-list-sub">Edit, delete, and reorder (mock)</div>
                        </div>
                        <div className="st-task-count">{tasks.length} tasks</div>
                      </div>

                      <div className="st-task-cards">
                        {tasks.map((t, idx) => (
                          <div key={idx} className="st-task-card">
                            <div className="st-task-card-top">
                              <div className="st-task-name">{t.name || `Untitled Task ${idx + 1}`}</div>
                              <button className="st-danger" type="button" onClick={() => removeTask(idx)}>
                                Delete
                              </button>
                            </div>

                            <div className="st-task-grid">
                              <label className="st-field st-field-compact">
                                <span className="st-label">Category</span>
                                <select
                                  className="st-input"
                                  value={t.category}
                                  onChange={(e) => updateTask(idx, { category: e.target.value })}
                                >
                                  {categories.map((c) => (
                                    <option key={c} value={c}>
                                      {c}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="st-field st-field-compact">
                                <span className="st-label">Duration</span>
                                <input
                                  className="st-input"
                                  type="number"
                                  min={5}
                                  value={t.duration}
                                  onChange={(e) => updateTask(idx, { duration: parseInt(e.target.value || '0', 10) })}
                                />
                              </label>

                              <label className="st-field st-field-compact">
                                <span className="st-label">Priority</span>
                                <select
                                  className="st-input"
                                  value={t.priority}
                                  onChange={(e) => updateTask(idx, { priority: e.target.value })}
                                >
                                  {priorities.map((p) => (
                                    <option key={p} value={p}>
                                      {p}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="st-field st-field-compact">
                                <span className="st-label">Difficulty</span>
                                <select
                                  className="st-input"
                                  value={t.difficulty}
                                  onChange={(e) => updateTask(idx, { difficulty: e.target.value })}
                                >
                                  {difficulties.map((d) => (
                                    <option key={d} value={d}>
                                      {d}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="st-field st-field-full">
                                <span className="st-label">Deadline</span>
                                <input
                                  className="st-input"
                                  value={t.deadline}
                                  onChange={(e) => updateTask(idx, { deadline: e.target.value })}
                                />
                              </label>

                              <label className="st-field st-field-full">
                                <span className="st-label">Notes</span>
                                <input
                                  className="st-input"
                                  value={t.notes}
                                  onChange={(e) => updateTask(idx, { notes: e.target.value })}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="st-step">
                  <h3 className="st-step-title">Step 7 – Daily Habits</h3>
                  <p className="st-muted">Toggle daily habits. These strengthen consistency and reduce burnout.</p>

                  <div className="st-toggle-grid">
                    {dayHabitsSeed.map((h) => {
                      const on = habits.includes(h)
                      return (
                        <button
                          key={h}
                          type="button"
                          className={`st-toggle ${on ? 'on' : ''}`}
                          onClick={() =>
                            setHabits((prev) => {
                              if (prev.includes(h)) return prev.filter((x) => x !== h)
                              return [...prev, h]
                            })
                          }
                        >
                          <span className="st-toggle-knob" />
                          {h}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="st-step">
                  <h3 className="st-step-title">Step 8 – AI Preferences</h3>
                  <p className="st-muted">Enable AI features for advanced scheduling and notifications.</p>

                  <div className="st-ai-toggle-grid">
                    {[
                      ['autoSchedule', 'Auto Schedule'],
                      ['autoRearrange', 'Auto Rearrange Tasks'],
                      ['smartBreaks', 'Smart Breaks'],
                      ['moveIncompleteToTomorrow', 'Move Incomplete Tasks to Tomorrow'],
                      ['goalBasedScheduling', 'Goal-Based Scheduling'],
                      ['avoidBurnout', 'Avoid Burnout'],
                      ['smartNotifications', 'Smart Notifications'],
                    ].map(([key, label]) => {
                      const k = key
                      return (
                        <button
                          key={k}
                          type="button"
                          className={`st-ai-toggle ${aiPrefs[k] ? 'on' : ''}`}
                          onClick={() => setAiPrefs((p) => ({ ...p, [k]: !p[k] }))}
                        >
                          <span className="st-ai-dot" />
                          {label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="st-ai-logic">
                    <div className="st-ai-logic-title">
                      <Sparkles size={16} /> AI Smart Scheduling Logic (Mock)
                    </div>
                    <ul className="st-ai-logic-list">
                      <li>Analyze available hours.</li>
                      <li>Reserve time for meals and sleep.</li>
                      <li>Prioritize high-priority tasks.</li>
                      <li>Schedule difficult tasks during peak productivity hours.</li>
                      <li>Balance study, coding, work, and personal life.</li>
                      <li>Insert smart breaks and prevent back-to-back heavy tasks.</li>
                      <li>Automatically adjust if a task takes longer (mock).</li>
                      <li>Leave buffer time and optimize focus sessions using Pomodoro.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="st-wizard-actions">
              <button type="button" className="st-ghost-btn" onClick={goPrev} disabled={step === 0}>
                Back
              </button>

              <div className="st-wizard-actions-right">
                <button
                  type="button"
                  className="st-gradient-btn"
                  onClick={() => {
                    if (step === steps.length - 1) wizardSubmit()
                    else goNext()
                  }}
                  disabled={!canContinue()}
                >
                  {step === steps.length - 1 ? (
                    <>
                      <Sparkles size={18} /> Generate Dashboard
                    </>
                  ) : (
                    <>
                      Next <span className="st-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {mode === 'dashboard' && generated && (
        <section className="st-dashboard">
          <div className="st-dashboard-inner">
            <div className="st-dashboard-top">
              <div>
                <div className="st-dash-kicker">Generated Smart Time Table</div>
                <h2 className="st-dash-title">Your day, intelligently planned</h2>
              </div>
              <div className="st-dash-actions">
                <button className="st-ghost-btn" onClick={resetToLanding}>
                  New Plan
                </button>
              </div>
            </div>

            <div className="st-dash-cards">
              <div className="st-dash-card">
                <ProgressRing value={generated.productivityScore} />
              </div>

              <div className="st-dash-card">
                <div className="st-dash-card-title">Today's Goal</div>
                <div className="st-dash-card-value">{primaryGoals[0] || 'Smart Planning'}</div>
                <div className="st-dash-card-sub">Multi-goal support enabled</div>
              </div>

              <div className="st-dash-card">
                <div className="st-dash-card-title">Available Hours</div>
                <div className="st-dash-card-value">{(generated.availableMinutes / 60).toFixed(1)} hrs</div>
                <div className="st-dash-card-sub">Reserved meals + sleep</div>
              </div>

              <div className="st-dash-card">
                <div className="st-dash-card-title">Completed Tasks</div>
                <div className="st-dash-card-value">{generated.completedMock}</div>
                <div className="st-dash-card-sub">Auto progress mock</div>
              </div>

              <div className="st-dash-card">
                <div className="st-dash-card-title">Remaining Tasks</div>
                <div className="st-dash-card-value">{generated.remainingMock}</div>
                <div className="st-dash-card-sub">Moved on end-of-day</div>
              </div>

              <div className="st-dash-card">
                <div className="st-dash-card-title">Focus Time</div>
                <div className="st-dash-card-value">{Math.round(generated.focusTimeMinutes)} min</div>
                <div className="st-dash-card-sub">Pomodoro optimized</div>
              </div>
            </div>

            <div className="st-dash-grid">
              <div className="st-timeline-card">
                <div className="st-timeline-header">
                  <div>
                    <div className="st-timeline-title">AI Generated Timeline</div>
                    <div className="st-timeline-sub">Smart focus sessions + breaks + buffer time</div>
                  </div>
                  <div className="st-timeline-badge">
                    <Sparkles size={16} /> AI Calendar
                  </div>
                </div>

                <div className="st-timeline">
                  {generated.timeline.slice(0, 12).map((b, idx) => (
                    <div key={`${b.start}-${idx}`} className={`st-tl-item ${b.type}`}>
                      <div className="st-tl-time">
                        {b.start}
                        <div className="st-tl-end">→ {b.end}</div>
                      </div>
                      <div className="st-tl-dot" />
                      <div className="st-tl-body">
                        <div className="st-tl-title">{b.title}</div>
                        {b.type === 'task' && (
                          <div className="st-tl-meta">
                            <span className="st-tag">{b.category}</span>
                            <span className="st-tag">Priority: {b.priority}</span>
                            <span className="st-tag">{b.difficulty}</span>
                          </div>
                        )}
                        {b.type === 'habit' && <div className="st-tl-meta">Habit • 10 min</div>}
                        {b.type === 'break' && <div className="st-tl-meta">Break • {b.duration} min</div>}
                        {b.type === 'fixed' && <div className="st-tl-meta">Fixed • {b.duration} min</div>}
                      </div>
                    </div>
                  ))}

                  {generated.timeline.length > 12 && (
                    <div className="st-timeline-more">+ {generated.timeline.length - 12} more blocks</div>
                  )}
                </div>
              </div>

              <div className="st-right-col">
                <div className="st-live-card">
                  <div className="st-live-header">
                    <div>
                      <div className="st-live-title">Live Task Tracking</div>
                      <div className="st-live-sub">Pending → In Progress → Completed (mock)</div>
                    </div>
                  </div>

                  <div className="st-live-list">
                    {tasks.map((t, idx) => {
                      const stage = idx < 1 ? 'In Progress' : idx < 2 ? 'Completed' : 'Pending'
                      return (
                        <div key={idx} className="st-live-row">
                          <div className="st-live-name">{t.name}</div>
                          <div className={`st-live-pill ${stage.replace(' ', '').toLowerCase()}`}>{stage}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="st-notify-card">
                  <div className="st-live-header">
                    <div>
                      <div className="st-live-title">Smart Notifications</div>
                      <div className="st-live-sub">Context-aware nudges (mock)</div>
                    </div>
                  </div>

                  <div className="st-notify-list">
                    {notifications.map((n, idx) => (
                      <div key={idx} className="st-notify-item">
                        <Sparkles size={16} />
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="st-end-card">
                  <div className="st-live-header">
                    <div>
                      <div className="st-live-title">End of Day Summary</div>
                      <div className="st-live-sub">AI insights (mock)</div>
                    </div>
                  </div>

                  <div className="st-summary-stats">
                    {[
                      ['Productivity Percentage', `${generated.productivityPct}%`],
                      ['Tasks Completed', `${generated.completedMock}/${tasks.length}`],
                      ['Total Study Hours', '—'],
                      ['Coding Hours', '—'],
                      ['Focus Time', `${Math.round(generated.focusTimeMinutes)} min`],
                      ['Break Time', `${Math.round(generated.breakTimeMinutes)} min`],
                      ['Daily Streak', '5 days'],
                      ['Goal Completion', primaryGoals.length ? 'On Track' : 'Pending'],
                    ].map(([k, v]) => (
                      <div key={k} className="st-summary-stat">
                        <div className="st-summary-k">{k}</div>
                        <div className="st-summary-v">{v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="st-tomorrow">
                    <div className="st-tomorrow-title">AI Suggestions for Tomorrow</div>
                    <div className="st-tomorrow-sub">Automatically move unfinished tasks to the next day (mock).</div>
                    <div className="st-tomorrow-box">
                      Tomorrow Planner • Recalculate schedule based on priorities and deadlines.
                    </div>
                  </div>
                </div>

                <div className="st-week-card">
                  <div className="st-live-header">
                    <div>
                      <div className="st-live-title">Weekly Analytics</div>
                      <div className="st-live-sub">Trends and distribution (mock)</div>
                    </div>
                  </div>

                  <div className="st-week-grid">
                    {[
                      'Productivity Trend',
                      'Goal Progress',
                      'Focus Hours',
                      'Study Hours',
                      'Coding Hours',
                      'Task Completion Rate',
                      'Weekly Streak',
                      'Time Distribution by Category',
                    ].map((x) => (
                      <div key={x} className="st-week-tile">
                        {x}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="st-dash-bottom-spacer" />
          </div>
        </section>
      )}

      <style>
        {`@media (max-width: 1024px){ .st-dash-grid{ grid-template-columns: 1fr !important; } .st-right-col{ grid-template-columns: 1fr !important; } }`}
      </style>
    </div>
  )
}

