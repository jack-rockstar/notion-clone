'use client'

import SettingModal from '@/components/modals/setting-modal'
import { useEffect, useState } from 'react'
import EditorModal from '../modals/editor-modal'

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <SettingModal />
      <EditorModal />
    </>
  )
}
