'use client'

import { api } from '@/convex/_generated/api'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { useQuery } from 'convex/react'
import { ChevronsLeft, MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import UserItem from './user-item'

export default function Navigation() {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)
  const documents = useQuery(api.documents.get)
  const isResizingRef = useRef(false)
  const sidebarRef = useRef(null)
  const navbarRef = useRef(null)

  useEffect(() => {
    if (isMobile) {
      handleCollapse()
    } else {
      resetWidth()
    }
  }, [pathname, isMobile])

  const handleMouseUp = (e) => {
    console.log('hola up')
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e) => {
    console.log('hola move')
    if (!isResizingRef.current) return
    let newWidth = e.clientX
    console.log({ newWidth })

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(false)

      sidebarRef.current.style.width = isMobile ? '100%' : '240px'
      navbarRef.current.style.setProperty('width', isMobile ? '0' : 'calc(100% - 240px)')
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')
    }
    setTimeout(() => setIsResetting(false), 300)
  }

  const handleCollapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('width', '100%')
      navbarRef.current.style.setProperty('left', '0')

      setTimeout(() => setIsResetting(false), 300)
    }
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0',
          isCollapsed && 'w-0'
        )}
      >
        <MenuCollpase isMobile={isMobile} onClick={handleCollapse} />
        <div>
          <UserItem />
        </div>
        <div className='mt-4'>
          {documents?.map((e) => (
            <p key={e._id}>{e.title}</p>
          ))}
        </div>
        <ScrollResizing onMouseDown={handleMouseDown} onClick={resetWidth} />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}
      >
        <nav className='w-full px-3 py-2 bg-transparent'>
          {isCollapsed && <MenuIcon role='button' onClick={resetWidth} className='w-6 h-6 text-muted-foreground' />}
        </nav>
      </div>
    </>
  )
}

const MenuCollpase = ({ onClick, isMobile }) => (
  <div
    onClick={onClick}
    role='button'
    className={cn(
      'absolute w-6 h-6 transition rounded-sm opacity-0 text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-600 top-3 right-2 group-hover/sidebar:opacity-100',
      isMobile && 'opacity-100'
    )}
  >
    <ChevronsLeft className='w-6 h-6 ' />
  </div>
)

const ScrollResizing = ({ onMouseDown, onClick }) => (
  <div
    onMouseDown={onMouseDown}
    onClick={onClick}
    className='absolute top-0 right-0 w-1 h-full transition opacity-0 group-hover/sidebar:opacity-100 cursor-ew-resize bg-primary/10'
  />
)
