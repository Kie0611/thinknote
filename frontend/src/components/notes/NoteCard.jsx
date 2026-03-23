import { useNavigate } from 'react-router-dom'
import { FileText, Layers } from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'

const tagColors = {
  biology:   { bg: '#dbeafe', text: '#1d4ed8' },
  exam:      { bg: '#d1fae5', text: '#065f46' },
  meeting:   { bg: '#fce7f3', text: '#9d174d' },
  important: { bg: '#ede9fe', text: '#6d28d9' },
  research:  { bg: '#fef3c7', text: '#92400e' },
  cs:        { bg: '#cffafe', text: '#0e7490' },
  work:      { bg: '#d1fae5', text: '#065f46' },
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getPreview = (content) => {
  if (!content) return ''
  return content.replace(/^#+\s.*/gm, '').replace(/[#*_`]/g, '').trim().slice(0, 100)
}

export default function NoteCard({ note, compact = false }) {
  const navigate = useNavigate()
  const { setActiveNote } = useNoteStore()

  const handleClick = () => {
    setActiveNote(note)
    navigate('/notes')
  }

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className="p-4 border-b border-zinc-100 cursor-pointer hover:bg-white transition-colors group"
      >
        <div className="font-semibold text-sm mb-1 group-hover:text-[#2119b7] transition-colors truncate">{note.title}</div>
        <div className="text-xs text-zinc-400 mb-2 line-clamp-2 leading-relaxed">{getPreview(note.content)}</div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {(note.tags || []).slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="tag-chip text-[10px]"
                style={{ backgroundColor: tagColors[tag]?.bg || '#f4f4f5', color: tagColors[tag]?.text || '#71717a' }}
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-zinc-400">{formatDate(note.createdAt)}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-zinc-200 rounded-2xl p-5 note-card-hover cursor-pointer animate-fade-in"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{note.emoji || '📝'}</span>
        <span className="text-xs text-zinc-400">{formatDate(note.createdAt)}</span>
      </div>
      <h3 className="font-bold text-sm mb-1.5 line-clamp-1">{note.title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-3">{getPreview(note.content)}</p>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {(note.tags || []).map((tag) => (
          <span
            key={tag}
            className="tag-chip text-[11px]"
            style={{ backgroundColor: tagColors[tag]?.bg || '#f4f4f5', color: tagColors[tag]?.text || '#71717a' }}
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex gap-1.5 pt-2 border-t border-zinc-100">
        {note.hasSummary && (
          <span className="flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">
            <FileText size={10} /> Summary
          </span>
        )}
        {note.flashcardCount > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">
            <Layers size={10} /> {note.flashcardCount} cards
          </span>
        )}
      </div>
    </div>
  )
}