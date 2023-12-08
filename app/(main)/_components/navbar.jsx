'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Clock, MenuIcon, MessageSquare, Star } from 'lucide-react'
import { useParams } from 'next/navigation'
import Banner from './banner'
import Menu from './menu'
import Publish from './publish'
import Title from './title'

const MENU_ITEMS = [
  {
    title: 'Comments',
    icon: MessageSquare
  },
  {
    title: 'History',
    icon: Clock
  },
  {
    title: 'Star',
    icon: Star
  }
]

export default function Navbar({ isCollapsed, onResetWidth, id = null }) {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: id ?? params.documentId
  })

  if (document === undefined) {
    return (
      <nav className='bg-background dark:bg-[#191919] px-3 py-2 w-full flex items-center justify-between'>
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
      <nav className='bg-background dark:bg-[#191919] px-3 py-2 w-full flex items-center gap-x-4 h-11'>
        {isCollapsed && (
          <MenuIcon
            role='button'
            onClick={onResetWidth}
            className='w-6 h-6 text-muted-foreground'
          />
        )}
        <div className='flex items-center justify-between w-full'>
          <Title initialData={document} />
          <section className='flex items-center'>
            <Publish initialData={document} />
            {
              MENU_ITEMS.map(({ title, icon: Icon }) => (
                <Button
                  key={title}
                  size='icon'
                  variant='ghost'
                  className='hidden md:flex lg:flex xl:flex focus-visible:ring-0 focus-visible:ring-offset-0 h-7'
                >
                  <Icon className='w-4 h-4' />
                </Button>
              ))
            }
            <Menu document={document} />
          </section>
        </div>
      </nav>
      {
        document?.isArchived && (
          <Banner documentId={document._id} />
        )
      }
    </>
  )
}
