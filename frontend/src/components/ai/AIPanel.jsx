import { useState, useRef, useEffect } from 'react'
import { Zap, FileText, Layers, MessageSquare, Send, ChevronDown } from 'lucide-react'
import { useAiStore } from '../../store/useAiStore'
import { useNoteStore } from '../../store/useNoteStore'

function renderText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

export default function AIPanel({ onClose }) {
  const [input, setInput] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const bottomRef = useRef(null)

  const { activeNote } = useNoteStore()
  const {
    messages, isThinking, isSummarizing, isGeneratingFlashcards,
    fetchChatHistory, summarizeNote, generateFlashcards, askQuestion, clearMessages
  } = useAiStore()

  // Load chat history when active note changes
  useEffect(() => {
    if (activeNote?._id) {
      clearMessages()
      fetchChatHistory(activeNote._id)
    }
  }, [activeNote?._id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const send = (text) => {
    const msg = text || input.trim()
    if (!msg || !activeNote) return
    setInput('')
    askQuestion(activeNote._id, msg)
  }

  return (
    <div className={`flex-shrink-0 flex flex-col bg-zinc-50 border-l border-zinc-200 transition-all duration-250 ${collapsed ? 'w-12' : 'w-[300px]'}`}>
      {/* Header */}
      <div className="h-14 px-3 flex items-center gap-2 border-b border-zinc-200 flex-shrink-0">
        {!collapsed && (
          <>
            <div className="w-7 h-7 rounded-full bg-[#e0f5f2] flex items-center justify-center flex-shrink-0">
              <Zap size={13} className="text-[#33b1a1]" />
            </div>
            <span className="font-bold text-sm flex-1">AI Assistant</span>
            <span className="ai-badge">Gemini 2.5 Flash</span>
          </>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="btn btn-ghost btn-xs btn-circle text-zinc-400 ml-auto"
        >
          {collapsed
            ? <Zap size={14} className="text-[#33b1a1]" />
            : <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
          }
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Action buttons */}
          <div className="p-3 border-b border-zinc-200 flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => activeNote && summarizeNote(activeNote._id)}
              disabled={isSummarizing || !activeNote}
              className="btn btn-sm border rounded-xl gap-2 justify-start h-9 min-h-0 bg-[#e0f5f2] text-[#33b1a1] hover:bg-[#ccefeb] hover:border-[#33b1a1] disabled:opacity-50"
            >
              <FileText size={13} />
              {isSummarizing ? 'Summarizing…' : 'Summarize Note'}
            </button>
            <button
              onClick={() => activeNote && generateFlashcards(activeNote._id)}
              disabled={isGeneratingFlashcards || !activeNote}
              className="btn btn-sm rounded-xl gap-2 justify-start h-9 min-h-0 bg-[#e0f5f2] hover:border-[#33b1a1] hover:bg-[#ccefeb] text-[#33b1a1] disabled:opacity-50"
            >
              <Layers size={13} />
              {isGeneratingFlashcards ? 'Generating…' : 'Generate Flashcards'}
            </button>
            <button
              onClick={() => send('Quiz me on this note.')}
              disabled={!activeNote}
              className="btn btn-sm rounded-xl gap-2 justify-start h-9 min-h-0 hover:border-[#33b1a1] bg-[#ccefeb] hover:bg-[#ccefeb] text-[#33b1a1] disabled:opacity-50"
            >
              <MessageSquare size={13} /> Ask a Question
            </button>
          </div>

          {/* No note selected state */}
          {!activeNote && (
            <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs text-center px-4">
              Select a note to use the AI assistant
            </div>
          )}

          {/* Chat messages */}
          {activeNote && (
            <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto scrollbar-thin">
              {messages.length === 0 && !isThinking && (
                <div className="text-xs text-zinc-400 text-center mt-4">
                  Ask anything about this note
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div
                    className={msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}
                    dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                  />
                </div>
              ))}
              {(isThinking || isSummarizing || isGeneratingFlashcards) && (
                <div className="flex justify-start">
                  <div className="bubble-ai flex items-center gap-1 py-3">
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-zinc-200 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={activeNote ? 'Ask about this note…' : 'Select a note first…'}
              disabled={!activeNote}
              className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-xl outline-none focus:border-[#33b1a1] transition-colors bg-white disabled:opacity-50"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || !activeNote || isThinking}
              className="w-9 h-9 flex-shrink-0 bg-[#33b1a1] text-white hover:bg-[#2a9d8f] disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}