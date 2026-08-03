import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Sparkles, Send } from 'lucide-react'

import { askAi } from '../services/api'
import './AiChatModal.css'

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
    const conversationHistory = messages.map((msg) => ({ role: msg.role, text: msg.text }))
    setMessages((m) => [...m, userMsg])
    setInput('')
    setSending(true)

    try {
      const response = await askAi({
        question: trimmed,
        history: conversationHistory,
      })

      const replyText = response?.data?.answer || 'I could not retrieve a grounded answer from the knowledge base right now.'
      const assistantMsg = { id: crypto.randomUUID(), role: 'assistant', text: replyText }
      setMessages((m) => [...m, assistantMsg])
    } catch (error) {
      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'I hit a backend issue while retrieving the context. Please try again with a more specific question.',
      }
      setMessages((m) => [...m, assistantMsg])
    } finally {
      setSending(false)
    }
  }

  const headerSubtitle = useMemo(() => {
    return 'Grounded answers from EduMind knowledge and role data.'
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

