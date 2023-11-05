'use client'

import SettingModal from '@/components/modals/setting-modal'
import { useEffect, useState } from 'react'
import CoverImageModal from '../modals/cover-image-modal'

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <SettingModal />
      <CoverImageModal />
    </>
  )
}
