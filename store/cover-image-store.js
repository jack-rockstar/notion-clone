import { create } from 'zustand'

export const coverImageStore = create((set, get) => ({
  url: undefined,
  isOpen: false,
  docId: undefined,
  gallery: null,
  loadImage: null,
  setLoadImage: (data = null) => set({ loadImage: data }),
  getLoadImage: () => get().loadImage,
  setGallery: (data) => set({ gallery: data }),
  getGallery: () => get().gallery,
  setDocId: (docId) => set({ docId }),
  getDocId: () => get().docId,
  onOpen: () => set({ isOpen: true, url: undefined }),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url) => set({ isOpen: true, url })
}))
