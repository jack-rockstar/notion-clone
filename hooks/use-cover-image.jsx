import { create } from 'zustand'

export const useCoverImage = create((set) => ({
  url: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onReplace: (url) => set({ isOpen: true, url })
}))
