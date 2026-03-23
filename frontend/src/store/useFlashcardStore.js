import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useFlashcardStore = create((set) => ({
  flashcards: [],
  isFetchingFlashcards: false,

  fetchFlashcardsByNote: async (noteId) => {
    set({ isFetchingFlashcards: true })
    try {
      const res = await axiosInstance.get(`api/v1/flashcards/note/${noteId}`)
      set({ flashcards: res.data.flashcards || [] })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch flashcards")
    } finally {
      set({ isFetchingFlashcards: false })
    }
  },

  clearFlashcards: () => set({ flashcards: [] }),
}))