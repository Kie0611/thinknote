import { useState, useEffect, useRef } from 'react'
import { Bold, Italic, Heading1, Heading2, List, Code, Link, Image, Eye, Edit3, Check, Trash2, MoreHorizontal, X, Plus } from 'lucide-react'
import { useNoteStore } from '../../store/useNoteStore'
import { useFolderStore } from '../../store/useFolderStore'
import toast from 'react-hot-toast'

const tagColors = {
  biology:   { bg: '#dbeafe', text: '#1d4ed8' },
  exam:      { bg: '#d1fae5', text: '#065f46' },
  meeting:   { bg: '#fce7f3', text: '#9d174d' },
  important: { bg: '#ede9fe', text: '#6d28d9' },
  research:  { bg: '#fef3c7', text: '#92400e' },
  cs:        { bg: '#cffafe', text: '#0e7490' },
  work:      { bg: '#d1fae5', text: '#065f46' },
}

function MarkdownPreview({ content }) {
  const parseLine = (line) => {
    return line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand-600 underline">$1</a>')
  }

  const lines = content.split('\n')
  const html = lines.map(line => {
    if (line.startsWith('# '))   return `<h1 class="font-serif text-3xl font-normal mt-0 mb-4 pb-3 border-b border-zinc-200">${parseLine(line.slice(2))}</h1>`
    if (line.startsWith('## '))  return `<h2 class="text-xl font-bold mt-6 mb-2">${parseLine(line.slice(3))}</h2>`
    if (line.startsWith('### ')) return `<h3 class="text-base font-bold mt-4 mb-1.5">${parseLine(line.slice(4))}</h3>`
    if (line.startsWith('- '))   return `<li class="ml-4 list-disc mb-1">${parseLine(line.slice(2))}</li>`
    if (/^\d+\. /.test(line))    return `<li class="ml-4 list-decimal mb-1">${parseLine(line.replace(/^\d+\. /, ''))}</li>`
    if (line.trim() === '')      return '<div class="mb-3"></div>'
    return `<p class="mb-3 leading-relaxed">${parseLine(line)}</p>`
  }).join('')

  return (
    <div
      className="prose prose-sm max-w-none text-zinc-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default function MarkdownEditor() {
  const { activeNote, updateNote, deleteNote, addTag, removeTag } = useNoteStore()
  const { activeFolder } = useFolderStore()
  const [preview, setPreview] = useState(false)
  const [saved, setSaved] = useState(true)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tagInputOpen, setTagInputOpen] = useState(false)
  const menuRef = useRef(null)
  const tagInputRef = useRef(null)

  const isUserEdit = useRef(false)
  const activeNoteRef = useRef(activeNote)

  useEffect(() => { activeNoteRef.current = activeNote }, [activeNote])

  useEffect(() => {
    if (activeNote) {
      isUserEdit.current = false
      setContent(activeNote.content || '')
      setTitle(activeNote.title || '')
      setSaved(true)
      setTagInputOpen(false)
      setTagInput('')
    }
  }, [activeNote?._id])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close tag input on outside click
  useEffect(() => {
    const handler = (e) => {
      if (tagInputRef.current && !tagInputRef.current.contains(e.target)) {
        setTagInputOpen(false)
        setTagInput('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!isUserEdit.current) return
    if (!activeNoteRef.current) return
    setSaved(false)
    const timer = setTimeout(async () => {
      const note = activeNoteRef.current
      if (!note) return
      try {
        await updateNote(note.folderId, note._id, {
          title, content, tags: note.tags || [],
        })
        setSaved(true)
      } catch {
        toast.error('Failed to save note')
        setSaved(true)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [content, title])

  const handleContentChange = (e) => { isUserEdit.current = true; setContent(e.target.value) }
  const handleTitleChange   = (e) => { isUserEdit.current = true; setTitle(e.target.value) }

  const handleAddTag = async () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!tag || !activeNote) return
    if ((activeNote.tags || []).includes(tag)) {
      toast.error('Tag already exists')
      return
    }
    await addTag(activeNote.folderId, activeNote._id, tag)
    setTagInput('')
    setTagInputOpen(false)
  }

  const handleRemoveTag = async (tag) => {
    if (!activeNote) return
    await removeTag(activeNote.folderId, activeNote._id, tag)
  }

  const handleDelete = async () => {
    if (!activeNote) return
    setIsDeleting(true)
    setMenuOpen(false)
    await deleteNote(activeNote.folderId, activeNote._id)
    setIsDeleting(false)
  }

  const insertFormat = (before, after = '') => {
    const ta = document.getElementById('md-editor')
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.substring(start, end)
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end)
    isUserEdit.current = true
    setContent(newContent)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        <div className="text-center">
          <Edit3 size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a note to edit</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Note header */}
      <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between flex-shrink-0">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="font-bold text-base bg-transparent border-none outline-none min-w-[200px] text-zinc-800 placeholder:text-zinc-300"
          placeholder="Note title…"
        />
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-xs font-semibold transition-colors ${saved ? 'text-emerald-500' : 'text-zinc-400'}`}>
            {saved ? <><Check size={11} /> Saved</> : 'Saving…'}
          </span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="btn btn-ghost btn-xs btn-circle text-zinc-400 hover:text-zinc-600"
            >
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 w-40 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  {isDeleting ? 'Deleting…' : 'Delete note'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags bar */}
      <div className="px-5 py-2 border-b border-zinc-200 flex items-center gap-2 flex-shrink-0 flex-wrap">
        {(activeNote.tags || []).map(tag => (
          <span
            key={tag}
            className="tag-chip text-xs flex items-center gap-1 group"
            style={{ backgroundColor: tagColors[tag]?.bg || '#f4f4f5', color: tagColors[tag]?.text || '#71717a' }}
          >
            #{tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 ml-0.5"
            >
              <X size={10} />
            </button>
          </span>
        ))}

        {/* Add tag */}
        <div className="relative" ref={tagInputRef}>
          {tagInputOpen ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddTag()
                  if (e.key === 'Escape') { setTagInputOpen(false); setTagInput('') }
                }}
                placeholder="tag name…"
                autoFocus
                className="text-xs border border-zinc-300 rounded-full px-2.5 py-0.5 outline-none focus:border-brand-400 w-24 transition-colors"
              />
              <button
                onClick={handleAddTag}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
              >
                <Check size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setTagInputOpen(true)}
              className="text-xs text-zinc-400 border border-dashed border-zinc-300 px-2.5 py-0.5 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              <Plus size={10} /> tag
            </button>
          )}
        </div>

        <div className="ml-auto flex gap-1.5">
          <button
            onClick={() => setPreview(false)}
            className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${!preview ? 'bg-[#5048e533] text-[#6760e3]' : 'text-zinc-400 hover:bg-zinc-100'}`}
          >
            <Edit3 size={12} className="inline mr-1" />Edit
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${preview ? 'bg-[#5048e533] text-[#6760e3]' : 'text-zinc-400 hover:bg-zinc-100'}`}
          >
            <Eye size={12} className="inline mr-1" />Preview
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {!preview && (
        <div className="px-4 py-2 border-b border-zinc-100 flex items-center gap-1 flex-shrink-0 flex-wrap">
          <button onClick={() => insertFormat('**', '**')} className="toolbar-btn" title="Bold"><Bold size={13} /></button>
          <button onClick={() => insertFormat('*', '*')} className="toolbar-btn" title="Italic"><Italic size={13} /></button>
          <div className="w-px h-5 bg-zinc-200 mx-1" />
          <button onClick={() => insertFormat('# ')} className="toolbar-btn" title="H1"><Heading1 size={13} /></button>
          <button onClick={() => insertFormat('## ')} className="toolbar-btn" title="H2"><Heading2 size={13} /></button>
          <div className="w-px h-5 bg-zinc-200 mx-1" />
          <button onClick={() => insertFormat('- ')} className="toolbar-btn" title="List"><List size={13} /></button>
          <button onClick={() => insertFormat('`', '`')} className="toolbar-btn" title="Inline code"><Code size={13} /></button>
          <button onClick={() => insertFormat('[', '](url)')} className="toolbar-btn" title="Link"><Link size={13} /></button>
          <button onClick={() => insertFormat('![alt](', ')')} className="toolbar-btn" title="Image"><Image size={13} /></button>
          <div className="ml-auto font-mono text-[11px] text-zinc-400">
            {content.split(/\s+/).filter(Boolean).length} words · {Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read
          </div>
        </div>
      )}

      {/* Editor / Preview */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 pb-16">
        {preview ? (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <MarkdownPreview content={content} />
          </div>
        ) : (
          <textarea
            id="md-editor"
            value={content}
            onChange={handleContentChange}
            className="w-full h-full min-h-[400px] font-mono text-sm leading-7 bg-transparent border-none outline-none resize-none text-zinc-800 max-w-2xl"
            placeholder="Start writing in Markdown…"
          />
        )}
      </div>
    </div>
  )
}