import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Monitor, MessageSquare,
  Plus, LogOut, Zap, ChevronDown, Hash,
  BookOpen, Briefcase, Rocket, FlaskConical, ClipboardList,
  Star, Target, Lightbulb, TestTube, BookMarked, FolderOpen, BarChart2, Folder
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import FolderModal from '../ui/FolderModal'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useFolderStore } from '../../store/useFolderStore'
import { useNoteStore } from '../../store/useNoteStore'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText,        label: 'All Notes',  path: '/notes'     },
  { icon: Monitor,         label: 'Flashcards', path: '/flashcards'},
  { icon: MessageSquare,   label: 'AI Chat',    path: '/ai-chat'   },
]

const ICON_MAP = {
  BookOpen, Briefcase, Rocket, FlaskConical, ClipboardList,
  Star, Target, Lightbulb, TestTube, BookMarked, FolderOpen, BarChart2, Folder
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarOpen } = useApp()
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [foldersOpen, setFoldersOpen] = useState(true)
  const [tagsOpen, setTagsOpen] = useState(true)

  const { authUser, logout } = useAuthStore()
  const { folders, activeFolder, setActiveFolder, fetchFolders } = useFolderStore()
  const { notes, activeNote, fetchAllNotes } = useNoteStore()

  useEffect(() => {
    fetchFolders()
    fetchAllNotes()
  }, [fetchFolders, fetchAllNotes])

  // Collect unique tags — from active note if selected, else from all notes
  const tags = activeNote
    ? [...new Set(activeNote.tags || [])]
    : [...new Set(notes.flatMap(n => n.tags || []))]

  return (
    <>
      <aside className={`
        flex flex-col h-full bg-[#181a39] border-r border-zinc-200 transition-all duration-250 overflow-hidden flex-shrink-0
        ${sidebarOpen ? 'w-60' : 'w-[60px]'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-[#272849] flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg text-[#E2E8F0]">ThinkNote</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 pt-3 overflow-y-auto scrollbar-thin">
          <div className="flex flex-col gap-0.5">
            {navItems.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => { setActiveFolder(null); navigate(path) }}
                className={`nav-item w-full text-left text-[#C8CEDA] ${
                  location.pathname === path && !activeFolder ? 'active' : ''
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </button>
            ))}
          </div>

          {sidebarOpen && (
            <>
              {/* Folders */}
              <div className="mt-4 border-t-[0.1px] border-[#272849]">
                <div className="flex items-center justify-between px-3 mb-1 mt-4">
                  <button
                    onClick={() => setFoldersOpen(prev => !prev)}
                    className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${foldersOpen ? '' : '-rotate-90'}`}
                    />
                    Folders
                  </button>
                  <button
                    onClick={() => setFolderModalOpen(true)}
                    className="w-5 h-5 flex items-center justify-center rounded text-zinc-400 hover:text-brand-600 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {foldersOpen && (
                  <div className="flex flex-col gap-0.5">
                    {folders.map(folder => {
                      const FolderIcon = ICON_MAP[folder.icon] || Folder
                      return (
                        <button
                          key={folder._id}
                          onClick={() => { setActiveFolder(folder); navigate('/notes') }}
                          className={`
                            flex items-center justify-between px-3 py-2 rounded-xl text-sm cursor-pointer transition-all duration-150 w-full text-left
                            ${activeFolder?._id === folder._id ? 'bg-[#23225b] text-[#655ee0]' : 'text-zinc-50 hover:bg-[#24264c] hover:text-[#C8CEDA]'}
                          `}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FolderIcon size={15} className="flex-shrink-0 text-zinc-400" />
                            <span className="truncate font-medium text-[#C8CEDA]">{folder.name}</span>
                          </div>
                          <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 text-[#c8ceda]">
                            {folder.count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Tags */}
              {activeNote && (
                <div className="mt-4 border-t-[0.1px] border-[#272849]">
                  <div className="flex items-center justify-between px-3 mb-1 mt-4">
                    <button
                      onClick={() => setTagsOpen(prev => !prev)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${tagsOpen ? '' : '-rotate-90'}`}
                      />
                      Tags
                    </button>
                  </div>

                  {tagsOpen && (
                    <div className="flex flex-col gap-0.5">
                      {(activeNote.tags || []).length === 0 ? (
                        <p className="text-xs text-zinc-600 px-3 py-1.5">No tags on this note</p>
                      ) : (
                        (activeNote.tags || []).map(tag => (
                          <button
                            key={tag}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all duration-150 w-full text-left text-[#C8CEDA] hover:bg-[#24264c]"
                          >
                            <Hash size={14} className="text-zinc-500 flex-shrink-0" />
                            <span className="truncate font-medium">{tag}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[#272849] flex-shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {authUser?.username ? authUser.username.slice(0, 2).toUpperCase() : 'JD'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-[#e2e8f0]">{authUser?.username || 'John Doe'}</div>
              </div>
              <LogOut size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" onClick={logout} />
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer" onClick={() => navigate('/login')}>
              AC
            </div>
          )}
        </div>
      </aside>

      <FolderModal open={folderModalOpen} onClose={() => setFolderModalOpen(false)} />
    </>
  )
}