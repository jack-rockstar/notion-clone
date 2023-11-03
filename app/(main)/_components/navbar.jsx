'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { MenuIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import Banner from './banner'
import Menu from './menu'
import Title from './title'

export default function Navbar({ isCollapsed, onResetWidth }) {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  })

  if (document === undefined) {
    return (
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between'>
        <Title.Skeleton />
        <div className='flex items-center gap-x-2'>
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }
  if (document === null) return null

  return (
    <>
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4'>
        {isCollapsed && (
          <MenuIcon
            role='button'
            onClick={onResetWidth}
            className='w-6 h-6 text-muted-foreground'
          />
        )}
        <div className='flex items-center justify-between w-full'>
          <Title initialDate={document} />
          <section className='flex items-center gap-x-2'>
            <Menu documentId={document._id} />
          </section>
        </div>
      </nav>
      {
        document.isArchived && (
          <Banner documentId={document._id} />
        )
      }
    </>
  )
}
