import { create } from 'zustand'

export const useCoverImage = create((set, get) => ({
  url: undefined,
  isOpen: false,
  docId: undefined,
  setDocId: (docId) => set({ docId }),
  getDocId: () => get().docId,
  onOpen: () => set({ isOpen: true, url: undefined }),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url) => set({ isOpen: true, url })
}))
