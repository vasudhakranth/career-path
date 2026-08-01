import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Sparkles, Send } from 'lucide-react'

import './AiChatModal.css'

function buildContextHint(messages) {
  const priorUserQuestions = messages
    .filter((msg) => msg.role === 'user')
    .slice(-2)
    .map((msg) => msg.text.trim())
    .filter(Boolean)

  if (!priorUserQuestions.length) return ''
  return `Context from earlier: ${priorUserQuestions.join(' • ')}.`
}

function detectIntent(lowerText) {
  if (/(write|generate|code|snippet|function|javascript|python|react|html|css|programming)/i.test(lowerText)) return 'code'
  if (/(resume|cv|career|job|role|linkedin|portfolio)/i.test(lowerText)) return 'career'
  if (/(interview|mock interview|question|answer)/i.test(lowerText)) return 'interview'
  if (/(roadmap|learn|skill|study|plan|path)/i.test(lowerText)) return 'learning'
  return 'general'
}

function extractRoleFromObjectiveQuestion(question) {
  const match = question.match(/(?:for|about)\s+(.+?)(?:\?|$)/i)
  if (!match) return ''
  return match[1].trim()
}

function buildNaturalReply(userText, messages) {
  const cleaned = userText.trim().replace(/\s+/g, ' ')
  const lower = cleaned.toLowerCase()
  const contextHint = buildContextHint(messages)
  const intent = detectIntent(lower)

  if (/(objective|career objective|resume objective)/i.test(lower)) {
    const role = extractRoleFromObjectiveQuestion(cleaned) || 'developer'
    const normalizedRole = role.toLowerCase()

    if (normalizedRole.includes('full stack')) {
      return [
        'Highly motivated Full Stack Developer with a strong foundation in frontend and backend development, including React, Node.js, Express.js, MongoDB, and REST APIs.',
        '',
        'Focused on building scalable, user-friendly web applications and delivering end-to-end solutions that improve user experience and business outcomes.',
        '',
        'Eager to contribute technical skills, collaborate with cross-functional teams, and continue learning modern web technologies in a dynamic environment.'
      ].join('\n')
    }

    return [
      `Motivated ${role} with a strong interest in learning, problem-solving, and contributing to impactful projects.`,
      '',
      'Committed to building practical experience, collaborating effectively, and applying technical skills to drive meaningful results.'
    ].join('\n')
  }

  if (intent === 'code') {
    const language = /(python)/i.test(lower) ? 'Python' : /(javascript|react|node|typescript)/i.test(lower) ? 'JavaScript' : 'Code'
    const snippet = language === 'Python'
      ? 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("EduMind"))'
      : language === 'JavaScript'
        ? 'function greet(name) {\n  return `Hello, ${name}!`\n}\n\nconsole.log(greet("EduMind"))'
        : 'function greet(name) {\n  return `Hello, ${name}!`\n}'

    return [
      `Your question is about ${cleaned}, so a practical answer is to start from the core requirement and keep the implementation minimal and readable.`,
      '',
      `Example in ${language}:`,
      '',
      '```' + snippet + '```',
      '',
      'This gives you a working starting point. If you share the exact input/output you want, I can refine it into a production-ready version.'
    ].join('\n')
  }

  if (intent === 'career') {
    return [
      `For your question about ${cleaned}, the best answer is to stay specific to the role, the user goal, and the measurable impact you can offer.`,
      '',
      'A strong response should clearly connect your skills, strengths, and practical experience to the role you want to pursue.',
      '',
      'That gives a more direct and useful answer than a generic career-tip paragraph.'
    ].join('\n')
  }

  if (intent === 'interview') {
    return [
      `For the interview question “${cleaned}”, the best answer is structured, confident, and grounded in real examples.`,
      '',
      'Use a simple format: explain the situation, describe your task, show the action you took, and end with the impact or result.',
      '',
      'Keep your answer concise, but give enough detail so the interviewer can clearly see the decision-making behind your work.'
    ].join('\n')
  }

  if (intent === 'learning') {
    return [
      `A practical way to handle “${cleaned}” is to break it into a short step-by-step plan instead of trying to learn everything at once.`,
      '',
      '1. Learn the fundamentals of the topic.',
      '2. Practice with a small example or exercise.',
      '3. Apply it to one real project or scenario.',
      '4. Review what worked and continue from the next gap.',
      '',
      'That sequence usually leads to faster and more reliable progress than jumping straight into advanced material.'
    ].join('\n')
  }

  return [
    `A clear answer to “${cleaned}” should explain the core idea, show the reasoning, and then give the next best step the user can take.`,
    '',
    'In other words, answer the question directly, keep the explanation natural, and connect it back to the user’s actual goal or constraint.',
    '',
    contextHint ? contextHint : 'If you want, follow up with the exact context, your goal, or an example so the answer can be more specific and useful.'
  ].join('\n')
}

export default function AiChatModal({ open, onClose }) {
  const [messages, setMessages] = useState(() => [
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: 'Hi! I’m EduMind AI. Ask about skills, resume, interview prep, or coding challenges.'
    }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const scrollerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    // reset on open for a clean demo experience
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'Hi! I’m EduMind AI. Ask about skills, resume, interview prep, or coding challenges.'
      }
    ])
    setInput('')
    setSending(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const trimmed = input.trim()
    if (!trimmed || sending) return

    const userMsg = { id: crypto.randomUUID(), role: 'user', text: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setSending(true)

    // simulate latency
    await new Promise((r) => setTimeout(r, 550))

    const replyText = buildNaturalReply(trimmed, messages)
    const assistantMsg = { id: crypto.randomUUID(), role: 'assistant', text: replyText }
    setMessages((m) => [...m, assistantMsg])
    setSending(false)
  }

  const headerSubtitle = useMemo(() => {
    return 'Chat runs in demo mode (mock answers).'
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="ai-modal-overlay" role="dialog" aria-modal="true" aria-label="EduMind AI Chat">
      <div className="ai-modal">
        <div className="ai-modal-header">
          <div className="ai-modal-title">
            <div className="ai-modal-badge">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="ai-modal-h">EduMind AI</div>
              <div className="ai-modal-sub">{headerSubtitle}</div>
            </div>
          </div>
          <button type="button" className="ai-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="ai-modal-body" ref={scrollerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`ai-msg ${msg.role}`}>
              <div className="ai-bubble">
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className="ai-line">{line}</p>
                ))}
              </div>
            </div>
          ))}

          {sending && (
            <div className="ai-msg assistant">
              <div className="ai-bubble">
                <p className="ai-line">Generating…</p>
              </div>
            </div>
          )}
        </div>

        <div className="ai-modal-footer">
          <div className="ai-input-wrap">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, resume, interviews, or coding…"
              className="ai-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') send()
              }}
            />
            <button type="button" className="ai-send" onClick={send} disabled={sending} aria-label="Send">
              <Send size={16} />
            </button>
          </div>
          <div className="ai-hints">
            Examples: “Improve my resume”, “Give me a React roadmap”, “Interview questions for backend”, “Coding challenge strategy”
          </div>
        </div>
      </div>
    </div>
  )
}

