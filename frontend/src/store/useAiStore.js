import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAiStore = create((set, get) => ({
  messages: [],
  isThinking: false,
  isSummarizing: false,
  isGeneratingFlashcards: false,
  activeNoteContext: null, // the note selected as context

  setActiveNoteContext: (note) => {
    set({ activeNoteContext: note, messages: [] })
    if (note?._id) {
      get().fetchChatHistory(note._id)
    }
  },

  fetchChatHistory: async (noteId) => {
    try {
      const res = await axiosInstance.get(`api/v1/ai/chat/${noteId}`)
      const formatted = res.data.flatMap(chat => ([
        { id: chat._id + '_q', role: 'user', text: chat.question },
        { id: chat._id + '_a', role: 'ai', text: chat.answer },
      ]))
      set({ messages: formatted })
    } catch (error) {
      toast.error("Failed to load chat history")
    }
  },

  summarizeNote: async (noteId) => {
    set({ isSummarizing: true })
    try {
      const res = await axiosInstance.post(`api/v1/ai/summarize`, { noteId })
      set((state) => ({
        messages: [...state.messages, {
          id: Date.now(),
          role: 'ai',
          text: `📝 **Summary:**\n${res.data.summary}`,
        }]
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to summarize note")
    } finally {
      set({ isSummarizing: false })
    }
  },

  generateFlashcards: async (noteId) => {
    set({ isGeneratingFlashcards: true })
    try {
      const res = await axiosInstance.post(`api/v1/ai/flashcards`, { noteId })
      const count = res.data.flashcards?.length || 0
      set((state) => ({
        messages: [...state.messages, {
          id: Date.now(),
          role: 'ai',
          text: `🃏 Generated **${count} flashcards** from your note! Head to the Flashcards tab to review them.`,
        }]
      }))
      toast.success(`${count} flashcards generated!`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate flashcards")
    } finally {
      set({ isGeneratingFlashcards: false })
    }
  },

  askQuestion: async (noteId, question) => {
    set((state) => ({
      isThinking: true,
      messages: [...state.messages, { id: Date.now(), role: 'user', text: question }]
    }))
    try {
      const res = await axiosInstance.post(`api/v1/ai/chat`, { noteId, question })
      set((state) => ({
        messages: [...state.messages, {
          id: Date.now() + 1,
          role: 'ai',
          text: res.data.chat.answer,
        }]
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get answer")
    } finally {
      set({ isThinking: false })
    }
  },

  clearMessages: () => set({ messages: [] }),
}))