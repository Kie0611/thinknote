import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useNoteStore = create((set) => ({
  notes: [],
  activeNote: null,
  isFetchingNotes: false,
  isCreatingNote: false,
  searchResults: [],
  isSearching: false,

  fetchNotes: async (folderId) => {
    set({ isFetchingNotes: true })
    try {
      const res = await axiosInstance.get(`api/v1/notes/folder/${folderId}`)
      set({ notes: res.data })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes")
    } finally {
      set({ isFetchingNotes: false })
    }
  },

  fetchAllNotes: async () => {
    set({ isFetchingNotes: true })
    try {
      const res = await axiosInstance.get(`api/v1/notes`)
      set({ notes: res.data })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes")
    } finally {
      set({ isFetchingNotes: false })
    }
  },

  createNote: async (folderId, data) => {
    set({ isCreatingNote: true })
    try {
      const res = await axiosInstance.post(`api/v1/notes/folder/${folderId}`, data)
      set((state) => ({ notes: [res.data, ...state.notes], activeNote: res.data }))
      toast.success("Note created")
      return res.data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note")
    } finally {
      set({ isCreatingNote: false })
    }
  },

  updateNote: async (folderId, noteId, data) => {
    try {
      const res = await axiosInstance.put(`api/v1/notes/folder/${folderId}/${noteId}`, data)
      set((state) => ({
        notes: state.notes.map(n => n._id === noteId ? res.data : n),
        activeNote: state.activeNote?._id === noteId ? res.data : state.activeNote,
      }))
      return res.data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update note")
    }
  },

  deleteNote: async (folderId, noteId) => {
    try {
      await axiosInstance.delete(`api/v1/notes/folder/${folderId}/${noteId}`)
      set((state) => ({
        notes: state.notes.filter(n => n._id !== noteId),
        activeNote: state.activeNote?._id === noteId ? null : state.activeNote,
      }))
      toast.success("Note deleted")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete note")
    }
  },

  addTag: async (folderId, noteId, tag) => {
    try {
      const state = useNoteStore.getState()
      const note = state.notes.find(n => n._id === noteId) || state.activeNote
      if (!note) return
      const updatedTags = [...new Set([...(note.tags || []), tag])]
      const res = await axiosInstance.put(`api/v1/notes/folder/${folderId}/${noteId}`, {
        title: note.title,
        content: note.content,
        tags: updatedTags,
      })
      set((state) => ({
        notes: state.notes.map(n => n._id === noteId ? res.data : n),
        activeNote: state.activeNote?._id === noteId ? res.data : state.activeNote,
      }))
    } catch (error) {
      toast.error("Failed to add tag")
    }
  },

  removeTag: async (folderId, noteId, tag) => {
    try {
      const state = useNoteStore.getState()
      const note = state.notes.find(n => n._id === noteId) || state.activeNote
      if (!note) return
      const updatedTags = (note.tags || []).filter(t => t !== tag)
      const res = await axiosInstance.put(`api/v1/notes/folder/${folderId}/${noteId}`, {
        title: note.title,
        content: note.content,
        tags: updatedTags,
      })
      set((state) => ({
        notes: state.notes.map(n => n._id === noteId ? res.data : n),
        activeNote: state.activeNote?._id === noteId ? res.data : state.activeNote,
      }))
    } catch (error) {
      toast.error("Failed to remove tag")
    }
  },

  searchNotes: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false })
      return
    }
    set({ isSearching: true })
    try {
      const res = await axiosInstance.get(`api/v1/notes/search?query=${encodeURIComponent(query)}`)
      set({ searchResults: res.data })
    } catch (error) {
      toast.error("Search failed")
    } finally {
      set({ isSearching: false })
    }
  },

  clearSearch: () => set({ searchResults: [], isSearching: false }),

  setActiveNote: (note) => set({ activeNote: note }),
}))