import { useState } from 'react'
import { X, BookOpen, Briefcase, Rocket, FlaskConical, ClipboardList, Star, Target, Lightbulb, TestTube, BookMarked, FolderOpen, BarChart2, Folder } from 'lucide-react'
import { useFolderStore } from '../../store/useFolderStore'

const ICONS = [
  { key: 'BookOpen', component: BookOpen },
  { key: 'Briefcase', component: Briefcase },
  { key: 'Rocket', component: Rocket },
  { key: 'FlaskConical', component: FlaskConical },
  { key: 'ClipboardList', component: ClipboardList },
  { key: 'Star', component: Star },
  { key: 'Target', component: Target },
  { key: 'Lightbulb', component: Lightbulb },
  { key: 'TestTube', component: TestTube },
  { key: 'BookMarked', component: BookMarked },
  { key: 'FolderOpen', component: FolderOpen },
  { key: 'BarChart2', component: BarChart2 },
]

export default function FolderModal({ open, onClose }) {
  const { createFolder, setActiveFolder, isCreatingFolder } = useFolderStore()
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('Folder')

  const handleCreate = async () => {
    if (!name.trim()) return
    const newFolder = await createFolder({ name: name.trim(), icon: selectedIcon })
    if (newFolder) setActiveFolder(newFolder)
    setName('')
    setSelectedIcon('Folder')
    onClose()
  }

  if (!open) return null

  const SelectedIconComponent = ICONS.find(i => i.key === selectedIcon)?.component || Folder

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base">Create New Folder</h3>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle text-zinc-400">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="e.g. Research Papers"
              autoFocus
              className="input input-bordered w-full rounded-xl text-sm h-10 focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-2">Choose Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(({ key, component: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedIcon(key)}
                  className={`
                    p-2 rounded-lg border-2 transition-all
                    ${selectedIcon === key ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-transparent hover:bg-zinc-100 text-zinc-500'}
                  `}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button onClick={onClose} className="btn btn-ghost btn-sm rounded-xl flex-1">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || isCreatingFolder}
              className="btn btn-primary btn-sm rounded-xl flex-1 gap-1.5"
            >
              {isCreatingFolder ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <SelectedIconComponent size={15} />
              )}
              {isCreatingFolder ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}