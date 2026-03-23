import { useState, useCallback, memo } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import FolderModal from '../ui/FolderModal'

export default function AppLayout({ children, topbarActions, className = '' }) {
  const [folderModalOpen, setFolderModalOpen] = useState(false)

  const openFolderModal = useCallback(() => setFolderModalOpen(true), [])
  const closeFolderModal = useCallback(() => setFolderModalOpen(false), [])

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar onNewFolder={openFolderModal} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar actions={topbarActions} />
        <main className={`flex-1 overflow-hidden ${className}`}>
          {children}
        </main>
      </div>
      <FolderModal open={folderModalOpen} onClose={closeFolderModal} />
    </div>
  )
}