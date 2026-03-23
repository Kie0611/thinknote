import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useFolderStore = create((set) => ({
  folders: [],
  activeFolder: null,
  isFetchingFolders: false,
  isCreatingFolder: false,

  fetchFolders: async () => {
    set({ isFetchingFolders: true })
    try {
      const res = await axiosInstance.get("api/v1/folders")
      set({ folders: res.data })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch folders")
    } finally {
      set({ isFetchingFolders: false })
    }
  },

  createFolder: async (data) => {
    set({ isCreatingFolder: true })
    try {
      const res = await axiosInstance.post("api/v1/folders", data)
      set((state) => ({ folders: [res.data, ...state.folders] }))
      toast.success("Folder created successfully")
      return res.data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create folder")
    } finally {
      set({ isCreatingFolder: false })
    }
  },

  setActiveFolder: (folder) => {
    console.log(folder)
    set({ activeFolder: folder })
  }
}))