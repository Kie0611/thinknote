import { useState } from 'react'
import { Plus } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import NotesList from '../components/notes/NotesList'
import MarkdownEditor from '../components/notes/MarkdownEditor'
import AIPanel from '../components/ai/AIPanel'
import { useApp } from '../context/AppContext'

export default function NotesPage() {
  const { addNote } = useApp()
  const [showAI, setShowAI] = useState(true)

  const handleNew = () => {
    addNote({
      title: 'Untitled Note',
      emoji: '📝',
      folder: 1,
      tags: [],
      tagColors: [],
      preview: 'Start writing...',
      content: '# Untitled Note\n\nStart writing here...',
      date: 'Just now',
      wordCount: 0,
      readTime: 0,
      hasSummary: false,
      flashcardCount: 0,
    })
  }

  return (
    <AppLayout
      className="flex flex-row overflow-hidden"
      topbarActions={
        <button onClick={handleNew} className="btn btn-primary btn-sm rounded-xl gap-1.5 h-9 min-h-0">
          <Plus size={14} /> New Note
        </button>
      }
    >
      {/* Notes list */}
      <NotesList />

      {/* Editor */}
      <MarkdownEditor />

      {/* AI Panel */}
      <AIPanel onClose={() => setShowAI(false)} />
    </AppLayout>
  )
}
