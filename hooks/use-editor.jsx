import { create } from 'zustand'

export const useEditor = create((set, get) => ({
  isOpen: false,
  document: null,
  setDoc: (id) => set({ document: id }),
  getDoc: () => get().document,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))
