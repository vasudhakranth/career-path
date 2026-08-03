import { useEffect, useMemo, useRef, useState } from 'react'
import { Copy, Send, Sparkles, Trash2, Pencil, Plus, RotateCcw, Bot } from 'lucide-react'
import { askAi, createAskChat, deleteAskChat, getAskChats, updateAskChat } from '../services/api'
import './AskAIPage.css'

const STORAGE_KEY = 'edumind-ask-ai-chats'
const WELCOME_TEXT = 'Hi! I’m EduMind AI. Ask about skills, resume, interview prep, or coding challenges.'

const makeChat = (title = 'New Chat') => ({
  id: crypto.randomUUID(),
  title,
  messages: [
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: WELCOME_TEXT,
    },
  ],
})

function inlineMarkdown(text) {
  return text
    .replace(/```([^`]+)```/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
}

function renderMessageText(text) {
  const segments = []
  const codeBlockRegex = /```([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const normalText = text.slice(lastIndex, match.index)
      segments.push(
        <div key={`p-${segments.length}`} className="markdown-plain" dangerouslySetInnerHTML={{ __html: inlineMarkdown(normalText) }} />
      )
    }

    segments.push(
      <pre key={`code-${segments.length}`} className="markdown-code-block">
        <code>{match[1]}</code>
      </pre>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push(
      <div key={`p-${segments.length}`} className="markdown-plain" dangerouslySetInnerHTML={{ __html: inlineMarkdown(text.slice(lastIndex)) }} />
    )
  }

  if (!segments.length) {
    return <div className="markdown-plain" dangerouslySetInnerHTML={{ __html: inlineMarkdown(text) }} />
  }

  return segments
}

export default function AskAIPage() {
  const [chats, setChats] = useState(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const fresh = [makeChat('New Chat')]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      return fresh
    }

    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) && parsed.length ? parsed : [makeChat('New Chat')]
    } catch {
      return [makeChat('New Chat')]
    }
  })
  const [activeChatId, setActiveChatId] = useState(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return parsed?.[0]?.id || null
    } catch {
      return null
    }
  })
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollerRef = useRef(null)

  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await getAskChats()
        const serverChats = Array.isArray(response?.data) ? response.data : []
        if (serverChats.length) {
          setChats(serverChats)
          setActiveChatId(serverChats[0].id)
          return
        }
      } catch {
        // Fall back to browser storage if the user is not authenticated or the server route is unavailable.
      }

      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed) && parsed.length) {
            setChats(parsed)
            setActiveChatId(parsed[0].id)
          }
        } catch {
          // ignore malformed local cache
        }
      }
    }

    loadChats()
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [chats, activeChatId, sending])

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) || chats[0], [chats, activeChatId])

  const updateActiveChat = (updater) => {
    setChats((current) => current.map((chat) => (chat.id === activeChat?.id ? updater(chat) : chat)))
  }

  const createNewChat = async () => {
    try {
      const response = await createAskChat({ title: 'New Chat', messages: [] })
      const created = response?.data
      if (created?.id) {
        setChats((current) => [created, ...current])
        setActiveChatId(created.id)
        setInput('')
        return
      }
    } catch {
      // Fall back to a client-only chat when the backend is unavailable.
    }

    const fresh = makeChat('New Chat')
    setChats((current) => [fresh, ...current])
    setActiveChatId(fresh.id)
    setInput('')
  }

  const deleteChat = async (chatId) => {
    try {
      await deleteAskChat(chatId)
    } catch {
      // Ignore server delete errors and keep the UI in sync locally.
    }

    const next = chats.filter((chat) => chat.id !== chatId)
    setChats(next)
    if (activeChatId === chatId) {
      setActiveChatId(next[0]?.id || null)
    }
  }

  const renameChat = async (chatId) => {
    const current = chats.find((chat) => chat.id === chatId)
    const nextName = window.prompt('Rename chat', current?.title || 'New Chat')
    if (!nextName) return
    const title = nextName.trim() || 'New Chat'

    try {
      const response = await updateAskChat(chatId, { title, messages: current?.messages || [] })
      const updated = response?.data
      if (updated?.id) {
        setChats((currentChats) => currentChats.map((chat) => (chat.id === chatId ? updated : chat)))
        return
      }
    } catch {
      // Fall through to local-only rename update.
    }

    setChats((currentChats) => currentChats.map((chat) => (chat.id === chatId ? { ...chat, title } : chat)))
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      window.alert('Copy failed in this browser context.')
    }
  }

  const sendMessage = async (promptOverride) => {
    const trimmed = (promptOverride ?? input).trim()
    if (!trimmed || sending || !activeChat) return

    const userMessage = { id: crypto.randomUUID(), role: 'user', text: trimmed }
    const updatedMessages = [...activeChat.messages, userMessage]
    updateActiveChat((chat) => ({ ...chat, messages: updatedMessages }))
    setInput('')
    setSending(true)

    try {
      const response = await askAi({
        question: trimmed,
        history: updatedMessages.map((msg) => ({ role: msg.role, text: msg.text })),
        chat_id: activeChat.id,
      })

      const reply = response?.data?.answer || 'I could not retrieve a grounded answer from the knowledge base right now.'
      const assistantMessage = { id: crypto.randomUUID(), role: 'assistant', text: reply }
      updateActiveChat((chat) => ({ ...chat, messages: [...updatedMessages, assistantMessage], title: chat.title === 'New Chat' ? trimmed.slice(0, 36) || 'New Chat' : chat.title }))

      try {
        await updateAskChat(activeChat.id, {
          title: activeChat.title === 'New Chat' ? trimmed.slice(0, 36) || 'New Chat' : activeChat.title,
          messages: [...updatedMessages, assistantMessage],
        })
      } catch {
        // No-op: the page already keeps the active chat in local state.
      }
    } catch {
      const fallback = { id: crypto.randomUUID(), role: 'assistant', text: 'I hit a backend issue while retrieving the context. Please try a more specific question.' }
      updateActiveChat((chat) => ({ ...chat, messages: [...updatedMessages, fallback] }))
    } finally {
      setSending(false)
    }
  }

  const regenerate = () => {
    if (!activeChat) return
    const lastUser = [...activeChat.messages].reverse().find((message) => message.role === 'user')
    if (lastUser) sendMessage(lastUser.text)
  }

  return (
    <div className="ask-ai-page">
      <aside className="ask-ai-sidebar">
        <div className="ask-ai-sidebar-top">
          <button type="button" className="new-chat-btn" onClick={createNewChat}>
            <Plus size={16} />
            New Chat
          </button>
        </div>

        <div className="chat-history-list">
          {chats.map((chat) => {
            const isActive = chat.id === activeChat?.id
            return (
              <div key={chat.id} className={`history-item ${isActive ? 'active' : ''}`}>
                <button type="button" className="history-anchor" onClick={() => setActiveChatId(chat.id)}>
                  <Sparkles size={14} />
                  <span>{chat.title}</span>
                </button>
                <div className="history-actions">
                  <button type="button" onClick={() => renameChat(chat.id)} aria-label="Rename chat">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => deleteChat(chat.id)} aria-label="Delete chat">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      <section className="ask-ai-main">
        <div className="ask-ai-header">
          <div>
            <p className="ask-ai-eyebrow">Ask AI</p>
            <h1>Grounded conversations with EduMind knowledge</h1>
          </div>
        </div>

        <div className="chat-surface" ref={scrollerRef}>
          {activeChat?.messages.map((message) => (
            <div key={message.id} className={`message-row ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'assistant' ? <Bot size={16} /> : <Sparkles size={16} />}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {renderMessageText(message.text)}
                </div>
                {message.role === 'assistant' && (
                  <div className="message-actions">
                    <button type="button" onClick={() => handleCopy(message.text)}>
                      <Copy size={14} />
                      Copy
                    </button>
                    <button type="button" onClick={regenerate}>
                      <RotateCcw size={14} />
                      Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="message-row assistant">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-composer">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask naturally about skills, roles, learning paths, and coding concepts…"
            rows={1}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendMessage()
              }
            }}
          />
          <button type="button" className="send-btn" onClick={() => sendMessage()} disabled={sending}>
            <Send size={16} />
            Send
          </button>
        </div>
      </section>
    </div>
  )
}
