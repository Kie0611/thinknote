import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, SlidersHorizontal } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import StatCard from '../components/ui/StatCard'
import NoteCard from '../components/notes/NoteCard'
import FolderModal from '../components/ui/FolderModal'
import { useAuthStore } from '../store/useAuthStore'
import { useNoteStore } from '../store/useNoteStore'
import { useFolderStore } from '../store/useFolderStore'
import { useFlashcardStore } from '../store/useFlashcardStore'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const ICON_MAP_EMOJI = {
  BookOpen: '📖', Briefcase: '💼', Rocket: '🚀', FlaskConical: '🧪',
  ClipboardList: '📋', Star: '⭐', Target: '🎯', Lightbulb: '💡',
  TestTube: '🧫', BookMarked: '🔖', FolderOpen: '📂', BarChart2: '📊', Folder: '📁',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [folderModal, setFolderModal] = useState(false)

  const { authUser } = useAuthStore()
  const { notes, fetchAllNotes, createNote, isCreatingNote } = useNoteStore()
  const { folders, fetchFolders, setActiveFolder } = useFolderStore()
  const { flashcards } = useFlashcardStore()

  useEffect(() => {
    fetchAllNotes()
    fetchFolders()
  }, [fetchAllNotes, fetchFolders])

  const summaryCount = notes.filter(n => n.summary).length
  const recentNotes = notes.slice(0, 6)

  const handleNewNote = async () => {
    if (folders.length === 0) {
      setFolderModal(true)
      return
    }
    const firstFolder = folders[0]
    await createNote(firstFolder._id, {
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing here...',
      tags: [],
    })
    navigate('/notes')
  }

  const handleFolderClick = (folder) => {
    setActiveFolder(folder)
    navigate('/notes')
  }

  return (
    <AppLayout
      topbarActions={
        <button
          onClick={handleNewNote}
          disabled={isCreatingNote}
          className="btn btn-primary btn-sm rounded-xl gap-1.5 h-9 min-h-0"
        >
          <Plus size={14} /> {isCreatingNote ? 'Creating…' : 'New Note'}
        </button>
      }
    >
      <div className="h-full overflow-y-auto scrollbar-thin p-6">
        <div className="max-w-5xl mx-auto">

          {/* Greeting */}
          <div className="mb-7 animate-fade-in">
            <h1 className="text-3xl font-normal mb-1">
              {getGreeting()}, {authUser?.username || 'there'} 👋
            </h1>
            <p className="text-zinc-500 text-sm">
              You have {notes.length} note{notes.length !== 1 ? 's' : ''} across {folders.length} folder{folders.length !== 1 ? 's' : ''}.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total Notes"
              value={notes.length}
              sub={notes.length > 0 ? `Across ${folders.length} folders` : 'No notes yet'}
              subColor="text-emerald-500"
            />
            <StatCard
              label="AI Summaries"
              value={summaryCount}
              sub="Generated"
              subColor="text-brand-600"
            />
            <StatCard
              label="Flashcards"
              value={flashcards.length}
              sub="Ready to study"
              subColor="text-accent-600"
            />
          </div>

          {/* Recent Notes */}
          <div className="mb-6 animate-fade-in stagger-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base">Recent Notes</h2>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-xs gap-1 text-zinc-500">
                  <SlidersHorizontal size={12} /> Filter
                </button>
                <button
                  onClick={() => navigate('/notes')}
                  className="text-xs text-brand-600 font-semibold hover:underline"
                >
                  View all →
                </button>
              </div>
            </div>
            {recentNotes.length === 0 ? (
              <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-8 text-center text-zinc-400">
                <p className="text-sm">No notes yet. Create your first note!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentNotes.map((note, i) => (
                  <div key={note._id} className={`stagger-${Math.min(i + 1, 5)}`}>
                    <NoteCard note={note} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Folders */}
          <div className="animate-fade-in stagger-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base">Folders</h2>
              <button
                onClick={() => setFolderModal(true)}
                className="btn btn-ghost btn-xs gap-1 text-brand-600"
              >
                <Plus size={12} /> New Folder
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {folders.map(folder => (
                <button
                  key={folder._id}
                  onClick={() => handleFolderClick(folder)}
                  className="bg-white border border-zinc-200 rounded-xl p-4 text-left hover:border-brand-400 hover:shadow-md transition-all group"
                >
                  <div className="text-2xl mb-2">
                    {ICON_MAP_EMOJI[folder.icon] || '📁'}
                  </div>
                  <div className="font-semibold text-sm group-hover:text-brand-600 transition-colors truncate">
                    {folder.name}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">{folder.count ?? 0} notes</div>
                </button>
              ))}
              <button
                onClick={() => setFolderModal(true)}
                className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl p-4 text-left hover:border-brand-400 transition-all flex flex-col items-center justify-center text-zinc-400 hover:text-brand-600 min-h-[88px]"
              >
                <Plus size={20} className="mb-1" />
                <span className="text-xs font-medium">New Folder</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <FolderModal open={folderModal} onClose={() => setFolderModal(false)} />
    </AppLayout>
  )
}