import { useState, useRef, useEffect } from 'react'
import { Send, Plus, Zap, ChevronDown, Search } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAiStore } from '../store/useAiStore'
import { useNoteStore } from '../store/useNoteStore'

const SUGGESTIONS = [
  'Summarize this note',
  'Quiz me on this note',
  'What are the key concepts?',
  'Generate flashcards',
  'Explain the main ideas',
]

function renderText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>')
    .replace(/\d\. (.+)/g, '<span class="block ml-2">• $1</span>')
}

export default function AIChatPage() {
  const [input, setInput] = useState('')
  const [contextSearch, setContextSearch] = useState('')
  const [contextDropdownOpen, setContextDropdownOpen] = useState(false)
  const bottomRef = useRef(null)
  const contextRef = useRef(null)

  const { notes, fetchAllNotes } = useNoteStore()
  const {
    messages, isThinking, isSummarizing, isGeneratingFlashcards,
    activeNoteContext, setActiveNoteContext,
    askQuestion, summarizeNote, generateFlashcards,
    clearMessages,
  } = useAiStore()

  const isLoading = isThinking || isSummarizing || isGeneratingFlashcards

  // Group notes by their chat history as "recent chats"
  const recentChats = notes.slice(0, 10)

  useEffect(() => {
    fetchAllNotes()
  }, [fetchAllNotes])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Close context dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (contextRef.current && !contextRef.current.contains(e.target)) {
        setContextDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(contextSearch.toLowerCase())
  )

  const send = (text) => {
    const msg = (text || input).trim()
    if (!msg || !activeNoteContext || isLoading) return
    setInput('')

    if (msg.toLowerCase().includes('summarize')) {
      // Add user message then summarize
      summarizeNote(activeNoteContext._id)
    } else if (msg.toLowerCase().includes('flashcard')) {
      generateFlashcards(activeNoteContext._id)
    } else {
      askQuestion(activeNoteContext._id, msg)
    }
  }

  const handleSelectContext = (note) => {
    setActiveNoteContext(note)
    setContextDropdownOpen(false)
    setContextSearch('')
  }

  const handleNewChat = () => {
    clearMessages()
    setActiveNoteContext(null)
  }

  return (
    <AppLayout
      topbarActions={
        <button
          onClick={handleNewChat}
          className="btn btn-ghost btn-sm gap-1.5 text-zinc-500"
        >
          <Plus size={14} /> New Chat
        </button>
      }
    >
      <div className="h-full flex overflow-hidden">
        {/* Sidebar – recent chats */}
        <div className="w-56 flex-shrink-0 border-r border-zinc-200 bg-white flex flex-col">
          <div className="p-3 border-b border-zinc-200">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Recent Chats</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {recentChats.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center mt-4 px-2">No notes yet</p>
            ) : (
              recentChats.map(note => (
                <button
                  key={note._id}
                  onClick={() => handleSelectContext(note)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeNoteContext?._id === note._id
                      ? 'bg-[#eeedfc] text-[#6A63E9]'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap size={11} className={activeNoteContext?._id === note._id ? 'text-[#6A63E9]' : 'text-zinc-300'} />
                    <span className="truncate">{note.title}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main chat */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* AI header */}
          <div className="px-5 py-3 border-b border-zinc-200 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#e0f5f2] flex items-center justify-center flex-shrink-0">
              <Zap size={15} className="text-[#33b1a1]" />
            </div>
            <div>
              <div className="font-bold text-sm">ThinkNote AI</div>
              <div className="text-xs text-zinc-500">Powered by Gemini 2.5 Flash</div>
            </div>

            {/* Context selector dropdown */}
            <div className="ml-4 flex-1 relative" ref={contextRef}>
              <button
                onClick={() => setContextDropdownOpen(v => !v)}
                className="w-full flex items-center gap-1.5 bg-[#e0f5f2] border border-[#c4e0dd] rounded-xl px-3 py-1.5 hover:bg-[#ccefeb] transition-colors"
              >
                <span className="text-xs text-[#33b1a1] font-medium flex-shrink-0">Context:</span>
                {activeNoteContext ? (
                  <span className="text-xs text-[#33b1a1] bg-[#d0eee9] px-2 py-0.5 rounded-lg font-medium truncate max-w-[180px]">
                    {activeNoteContext.title}
                  </span>
                ) : (
                  <span className="text-xs text-[#33b1a1] opacity-60">Select a note…</span>
                )}
                <ChevronDown size={12} className={`ml-auto text-[#33b1a1] flex-shrink-0 transition-transform ${contextDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {contextDropdownOpen && (
                <div className="absolute top-10 left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* Search */}
                  <div className="p-2 border-b border-zinc-100">
                    <div className="relative">
                      <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search notes…"
                        value={contextSearch}
                        onChange={e => setContextSearch(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none focus:border-[#33b1a1]"
                        autoFocus
                      />
                    </div>
                  </div>
                  {/* Notes list */}
                  <div className="max-h-48 overflow-y-auto scrollbar-thin py-1">
                    {filteredNotes.length === 0 ? (
                      <p className="text-xs text-zinc-400 text-center py-3">No notes found</p>
                    ) : (
                      filteredNotes.map(note => (
                        <button
                          key={note._id}
                          onClick={() => handleSelectContext(note)}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-zinc-50 ${
                            activeNoteContext?._id === note._id ? 'text-[#6A63E9] font-semibold' : 'text-zinc-700'
                          }`}
                        >
                          {note.title}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            <div className="flex justify-center">
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-500 max-w-sm text-center">
                {activeNoteContext
                  ? 'AI responds based on your selected note. Verify important information.'
                  : 'Select a note context above to start chatting.'}
              </div>
            </div>

            {messages.length === 0 && !isLoading && activeNoteContext && (
              <div className="flex gap-3 items-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-[#e0f5f2] flex items-center justify-center flex-shrink-0">
                  <Zap size={13} className="text-[#33b1a1]" />
                </div>
                <div className="max-w-xl">
                  <div className="bubble-ai">
                    <p>👋 Hi! I've loaded <strong>{activeNoteContext.title}</strong> as context. Ask me anything about it!</p>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">ThinkNote AI · just now</div>
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 items-start animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.role === 'ai'
                    ? 'bg-[#e0f5f2] text-[#33b1a1]'
                    : 'bg-gradient-to-br from-brand-500 to-accent-500 text-white'
                }`}>
                  {msg.role === 'ai' ? <Zap size={13} /> : 'AC'}
                </div>
                <div className="max-w-xl">
                  <div
                    className={msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}
                    dangerouslySetInnerHTML={{ __html: `<p>${renderText(msg.text)}</p>` }}
                  />
                  <div className={`text-[10px] text-zinc-400 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {msg.role === 'ai' ? 'ThinkNote AI' : 'You'} · just now
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-[#e0f5f2] flex items-center justify-center flex-shrink-0">
                  <Zap size={13} className="text-[#33b1a1]" />
                </div>
                <div className="bubble-ai flex items-center gap-1 py-3.5 px-5">
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-5 py-2.5 border-t border-zinc-100 flex gap-2 flex-wrap bg-zinc-50/50">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={!activeNoteContext || isLoading}
                className="text-xs font-medium bg-white border border-zinc-200 hover:border-brand-400 hover:text-brand-600 text-zinc-600 px-3 py-1.5 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-zinc-200 flex gap-3 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder={activeNoteContext ? 'Ask anything about your note… (Enter to send)' : 'Select a note context first…'}
              disabled={!activeNoteContext || isLoading}
              rows={1}
              className="flex-1 px-4 py-3 text-sm border border-zinc-200 rounded-2xl outline-none focus:border-[#33b1a1] resize-none transition-colors leading-relaxed disabled:opacity-50"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || !activeNoteContext || isLoading}
              className="w-11 h-11 flex-shrink-0 bg-[#33b1a1] hover:bg-[#2a9d8f] disabled:opacity-40 disabled:cursor-not-allowed text-[#e0f5f2] rounded-2xl flex items-center justify-center transition-colors shadow-md shadow-brand-200"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}