import { useState, useEffect, useRef } from 'react'
import { Search, Plus, SlidersHorizontal, X, Check } from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'
import { useFolderStore } from '../../store/useFolderStore'
import NoteCard from './NoteCard'
import toast from 'react-hot-toast'

const SORT_OPTIONS = [
  { label: 'Newest first',  value: 'newest' },
  { label: 'Oldest first',  value: 'oldest' },
  { label: 'A → Z',         value: 'az'     },
  { label: 'Z → A',         value: 'za'     },
]

export default function NotesList() {
  const { notes, activeNote, setActiveNote, fetchNotes, fetchAllNotes, createNote, isFetchingNotes } = useNoteStore()
  const { activeFolder } = useFolderStore()

  const [localSearch, setLocalSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedTags, setSelectedTags] = useState([])
  const filterRef = useRef(null)

  useEffect(() => {
    if (activeFolder) fetchNotes(activeFolder._id)
    else fetchAllNotes()
  }, [activeFolder])

  // Close filter on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // All unique tags across visible notes
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))]

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSortBy('newest')
    setSelectedTags([])
    setLocalSearch('')
  }

  const hasActiveFilters = sortBy !== 'newest' || selectedTags.length > 0

  // Apply search + tag filter + sort
  const displayed = notes
    .filter(n => {
      const matchesSearch =
        !localSearch ||
        n.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        n.tags?.some(t => t.toLowerCase().includes(localSearch.toLowerCase()))

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => n.tags?.includes(tag))

      return matchesSearch && matchesTags
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'az')     return a.title.localeCompare(b.title)
      if (sortBy === 'za')     return b.title.localeCompare(a.title)
      return 0
    })

  const handleNew = async () => {
    if (!activeFolder) {
      toast.error("Select a folder first to create a note")
      return
    }
    await createNote(activeFolder._id, {
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing here...',
      tags: [],
    })
  }

  return (
    <div className="w-72 flex-shrink-0 flex flex-col bg-zinc-50 border-r border-zinc-200">
      {/* Header */}
      <div className="px-3.5 py-3 border-b border-zinc-200 flex items-center justify-between flex-shrink-0">
        <span className="font-bold text-sm text-zinc-800">
          {activeFolder ? activeFolder.name : 'All Notes'}
        </span>
        <div className="flex gap-1.5 items-center">
          {/* Filter button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(prev => !prev)}
              className={`btn btn-ghost btn-xs btn-circle relative ${hasActiveFilters ? 'text-brand-600' : 'text-zinc-400'}`}
            >
              <SlidersHorizontal size={13} />
              {hasActiveFilters && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-600 rounded-full" />
              )}
            </button>

            {filterOpen && (
              <div className="absolute top-8 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {/* Sort */}
                <div className="px-3 py-2 border-b border-zinc-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Sort by</p>
                  <div className="flex flex-col gap-0.5">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                          sortBy === opt.value
                            ? 'bg-brand-50 text-brand-600 font-semibold'
                            : 'text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {opt.label}
                        {sortBy === opt.value && <Check size={11} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags filter */}
                {allTags.length > 0 && (
                  <div className="px-3 py-2 border-b border-zinc-100">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Filter by tag</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'border-zinc-200 text-zinc-600 hover:border-brand-400 hover:text-brand-600'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear */}
                {hasActiveFilters && (
                  <div className="px-3 py-2">
                    <button
                      onClick={clearFilters}
                      className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium py-1"
                    >
                      <X size={11} /> Clear filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleNew}
            className="gap-1 btn btn-primary btn-xs rounded-lg text-xs h-7 min-h-0 bg-[#5048e5] border-[#5048e5] hover:bg-[#4239b4] hover:border-[#4239b4]"
          >
            <Plus size={12} />New
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-zinc-200 flex-shrink-0">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes…"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg outline-none focus:border-brand-400 transition-colors"
          />
        </div>
      </div>

      {/* Active filter chips */}
      {(selectedTags.length > 0) && (
        <div className="px-3 py-2 border-b border-zinc-100 flex flex-wrap gap-1.5">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[11px] bg-brand-50 text-brand-600 border border-brand-200 px-2 py-0.5 rounded-full"
            >
              #{tag}
              <button onClick={() => toggleTag(tag)} className="hover:text-red-500 transition-colors">
                <X size={9} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isFetchingNotes ? (
          <div className="flex items-center justify-center h-32 text-zinc-400 text-xs">
            Loading...
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-400">
            <Search size={20} className="mb-2 opacity-50" />
            <span className="text-xs">No notes found</span>
          </div>
        ) : (
          displayed.map(note => (
            <div
              key={note._id}
              onClick={() => setActiveNote(note)}
              className={`cursor-pointer transition-all ${activeNote?._id === note._id ? 'border-l-[3px] border-[#28058b] bg-white' : ''}`}
            >
              <NoteCard note={note} compact />
            </div>
          ))
        )}
      </div>
    </div>
  )
}