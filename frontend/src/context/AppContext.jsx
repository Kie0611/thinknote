import { createContext, useContext, useState } from 'react'
import { mockNotes, mockFolders, mockChatMessages } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [notes, setNotes] = useState(mockNotes)
  const [folders, setFolders] = useState(mockFolders)
  const [activeNote, setActiveNote] = useState(mockNotes[0])
  const [activeFolder, setActiveFolder] = useState(null)
  const [chatMessages, setChatMessages] = useState(mockChatMessages)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const addNote = (note) => {
    const newNote = { ...note, id: Date.now(), date: 'Just now', updatedAt: new Date() }
    setNotes(prev => [newNote, ...prev])
    setActiveNote(newNote)
  }

  const updateNote = (id, updates) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
    if (activeNote?.id === id) setActiveNote(prev => ({ ...prev, ...updates }))
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    if (activeNote?.id === id) setActiveNote(notes.find(n => n.id !== id) || null)
  }

  const addFolder = (folder) => {
    setFolders(prev => [...prev, { ...folder, id: Date.now(), count: 0 }])
  }

  const addChatMessage = (msg) => {
    setChatMessages(prev => [...prev, { id: Date.now(), ...msg }])
  }

  const filteredNotes = notes.filter(n =>
    !searchQuery ||
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    n.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppContext.Provider value={{
      notes, folders, activeNote, activeFolder, chatMessages,
      sidebarOpen, searchQuery, filteredNotes,
      setActiveNote, setActiveFolder, setSidebarOpen, setSearchQuery,
      addNote, updateNote, deleteNote, addFolder, addChatMessage,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
