import { Search, Bell, Menu, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useNoteStore } from '../../store/useNoteStore'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, actions }) {
  const { sidebarOpen, setSidebarOpen } = useApp()
  const { searchResults, isSearching, searchNotes, clearSearch, setActiveNote } = useNoteStore()
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchNotes(query)
        setDropdownOpen(true)
      } else {
        clearSearch()
        setDropdownOpen(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (note) => {
    setActiveNote(note)
    setQuery('')
    setDropdownOpen(false)
    clearSearch()
    navigate('/notes')
  }

  const handleClear = () => {
    setQuery('')
    clearSearch()
    setDropdownOpen(false)
  }

  const getPreview = (content) => {
    if (!content) return ''
    return content.replace(/^#+\s.*/gm, '').replace(/[#*_`]/g, '').trim().slice(0, 60)
  }

  return (
    <header className="h-14 flex items-center px-4 bg-white border-b border-zinc-200 flex-shrink-0 relative z-40">

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(v => !v)}
        className="btn btn-ghost btn-circle btn-sm text-zinc-500"
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Search */}
      <div className="left-1/2 -translate-x-1/2 w-full max-w-md absolute" ref={searchRef}>
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
        <input
          type="text"
          placeholder="Search notes by title, tag, or content…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (query.trim() && searchResults.length > 0) setDropdownOpen(true) }}
          className="w-full pl-8 pr-8 py-2 text-sm bg-zinc-50 border border-zinc-300 rounded-xl outline-none focus:border-[#a7a3f2] focus:bg-white transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X size={13} />
          </button>
        )}

        {/* Results dropdown */}
        {dropdownOpen && (
          <div className="absolute top-11 left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
            {isSearching ? (
              <div className="px-4 py-3 text-xs text-zinc-400 text-center">Searching…</div>
            ) : searchResults.length === 0 ? (
              <div className="px-4 py-3 text-xs text-zinc-400 text-center">No notes found for "{query}"</div>
            ) : (
              <>
                <div className="px-3 py-2 border-b border-zinc-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto scrollbar-thin">
                  {searchResults.map(note => (
                    <button
                      key={note._id}
                      onClick={() => handleSelect(note)}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0"
                    >
                      <div className="font-semibold text-sm text-zinc-800 truncate mb-0.5">
                        {note.title}
                      </div>
                      <div className="text-xs text-zinc-400 truncate mb-1.5">
                        {getPreview(note.content)}
                      </div>
                      {(note.tags || []).length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {note.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          AC
        </div>
      </div>

    </header>
  )
}