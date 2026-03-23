import { useState, useEffect } from 'react'
import { Shuffle, RotateCcw, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useFlashcardStore } from '../store/useFlashcardStore'
import { useNoteStore } from '../store/useNoteStore'

const ratings = [
  { label: 'Correct', color: 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' },
  { label: 'Wrong',   color: 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100' },
]

export default function FlashcardsPage() {
  const { flashcards, fetchFlashcardsByNote, isFetchingFlashcards, clearFlashcards } = useFlashcardStore()
  const { notes, fetchAllNotes } = useNoteStore()

  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState({})
  const [completed, setCompleted] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteSearch, setNoteSearch] = useState('')
  const [noteDropdownOpen, setNoteDropdownOpen] = useState(false)
  const [shuffled, setShuffled] = useState(false)

  useEffect(() => {
    fetchAllNotes()
  }, [fetchAllNotes])

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(noteSearch.toLowerCase())
  )

  const handleSelectNote = (note) => {
    setSelectedNote(note)
    setNoteDropdownOpen(false)
    setNoteSearch('')
    clearFlashcards()
    setCurrent(0)
    setFlipped(false)
    setResults({})
    setCompleted(false)
    fetchFlashcardsByNote(note._id)
  }

  const handleShuffle = () => {
    if (flashcards.length === 0) return
    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5)
    useFlashcardStore.setState({ flashcards: shuffledCards })
    setCurrent(0)
    setFlipped(false)
    setResults({})
    setCompleted(false)
    setShuffled(true)
  }

  const card = flashcards[current]
  const progress = flashcards.length > 0 ? Math.round((current / flashcards.length) * 100) : 0

  const next = (rating) => {
    if (rating) setResults(r => ({ ...r, [card._id]: rating }))
    setFlipped(false)
    setTimeout(() => {
      if (current + 1 >= flashcards.length) setCompleted(true)
      else setCurrent(c => c + 1)
    }, 200)
  }

  const prev = () => {
    if (current === 0) return
    setFlipped(false)
    setTimeout(() => setCurrent(c => c - 1), 200)
  }

  const reset = () => {
    setCurrent(0)
    setFlipped(false)
    setResults({})
    setCompleted(false)
    setShuffled(false)
    if (selectedNote) fetchFlashcardsByNote(selectedNote._id)
  }

  return (
    <AppLayout
      topbarActions={
        <div className="flex items-center gap-2">
          <button onClick={reset} className="btn btn-ghost btn-sm gap-1.5 text-zinc-500">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={handleShuffle} disabled={flashcards.length === 0} className="btn btn-ghost btn-sm gap-1.5 text-zinc-500 disabled:opacity-40">
            <Shuffle size={14} /> Shuffle
          </button>
        </div>
      }
    >
      <div className="h-full flex flex-col items-center justify-center p-6 overflow-y-auto bg-zinc-50">

        {/* Note selector */}
        <div className="w-full max-w-lg mb-6 relative">
          <button
            onClick={() => setNoteDropdownOpen(v => !v)}
            className="w-full flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm hover:border-brand-400 transition-colors"
          >
            <Search size={14} className="text-zinc-400 flex-shrink-0" />
            <span className={selectedNote ? 'text-zinc-800 font-medium' : 'text-zinc-400'}>
              {selectedNote ? selectedNote.title : 'Select a note to study flashcards…'}
            </span>
            <ChevronRight size={14} className={`ml-auto text-zinc-400 transition-transform ${noteDropdownOpen ? 'rotate-90' : ''}`} />
          </button>

          {noteDropdownOpen && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-2 border-b border-zinc-100">
                <input
                  type="text"
                  placeholder="Search notes…"
                  value={noteSearch}
                  onChange={e => setNoteSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none focus:border-brand-400"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto scrollbar-thin py-1">
                {filteredNotes.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-3">No notes found</p>
                ) : (
                  filteredNotes.map(note => (
                    <button
                      key={note._id}
                      onClick={() => handleSelectNote(note)}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-zinc-50 ${
                        selectedNote?._id === note._id ? 'text-brand-600 font-semibold' : 'text-zinc-700'
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

        {/* Loading */}
        {isFetchingFlashcards && (
          <div className="text-zinc-400 text-sm">Loading flashcards…</div>
        )}

        {/* No note selected */}
        {!selectedNote && !isFetchingFlashcards && (
          <div className="text-center text-zinc-400">
            <p className="text-sm">Select a note above to start studying</p>
          </div>
        )}

        {/* No flashcards */}
        {selectedNote && !isFetchingFlashcards && flashcards.length === 0 && (
          <div className="text-center text-zinc-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm">No flashcards for this note yet.</p>
            <p className="text-xs mt-1">Use AI to generate flashcards from the Notes page.</p>
          </div>
        )}

        {/* Completed */}
        {completed && flashcards.length > 0 && (
          <div className="text-center animate-fade-in max-w-sm">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl mb-2">Session Complete!</h2>
            <p className="text-zinc-500 text-sm mb-6">You reviewed all {flashcards.length} cards.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-500">
                  {Object.values(results).filter(r => r === 'Correct').length}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Correct</div>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-400">
                  {Object.values(results).filter(r => r === 'Wrong').length}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Wrong</div>
              </div>
            </div>
            <button onClick={reset} className="btn btn-primary rounded-xl w-full">Study Again</button>
          </div>
        )}

        {/* Flashcard study view */}
        {!completed && selectedNote && flashcards.length > 0 && !isFetchingFlashcards && (
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-sm text-zinc-800">Flashcard Review</h2>
                <p className="text-xs text-zinc-400">{selectedNote.title}</p>
              </div>
              <div className="text-sm text-zinc-500">
                <span className="font-bold text-zinc-800">{current + 1}</span> / {flashcards.length}
              </div>
            </div>

            <div className="mb-6">
              <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div
              className="flashcard-scene w-full h-56 mb-6 cursor-pointer"
              onClick={() => setFlipped(f => !f)}
            >
              <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
                <div className="flashcard-face bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-xl shadow-brand-200/40">
                  <div className="text-xs uppercase tracking-widest opacity-60 mb-3">Question</div>
                  <p className="text-lg font-semibold leading-snug">{card?.question}</p>
                  <div className="mt-4 text-xs opacity-50">Tap to reveal answer</div>
                </div>
                <div className="flashcard-face flashcard-back bg-white border border-zinc-200 shadow-xl">
                  <div className="text-xs uppercase tracking-widest text-zinc-400 mb-3">Answer</div>
                  <p className="text-base font-semibold text-zinc-800 leading-relaxed whitespace-pre-line">{card?.answer}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={prev}
                disabled={current === 0}
                className="btn btn-circle btn-outline btn-sm border-zinc-200 hover:border-brand-400 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2 flex-1 justify-center">
                {flipped
                  ? ratings.map(r => (
                      <button
                        key={r.label}
                        onClick={() => next(r.label)}
                        className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${r.color}`}
                      >
                        {r.label}
                      </button>
                    ))
                  : (
                    <button
                      onClick={() => setFlipped(true)}
                      className="btn btn-outline border-zinc-200 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 rounded-xl flex-1"
                    >
                      Show Answer
                    </button>
                  )
                }
              </div>
              <button
                onClick={() => next()}
                className="btn btn-circle btn-outline btn-sm border-zinc-200 hover:border-brand-400"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2">All Cards</p>
              <div className="flex gap-1.5 flex-wrap">
                {flashcards.map((c, i) => (
                  <button
                    key={c._id}
                    onClick={() => { setFlipped(false); setTimeout(() => setCurrent(i), 100) }}
                    className={`
                      w-8 h-8 rounded-lg text-xs font-bold transition-all
                      ${i === current ? 'bg-[#5048E5] text-white scale-110 shadow-md shadow-brand-200' :
                        results[c._id] === 'Correct' ? 'bg-emerald-400 text-white' :
                        results[c._id] ? 'bg-red-300 text-white' :
                        'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}