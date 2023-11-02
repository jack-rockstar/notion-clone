'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { api } from '@/convex/_generated/api'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useSearch } from '@/hooks/use-search'
import { useSetting } from '@/hooks/use-setting'
import { cn } from '@/lib/utils'
import { useMutation } from 'convex/react'
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import DocumentList from './document-list'
import Item from './item'
import Trashbox from './trash-box'
import UserItem from './user-item'

export default function Navigation() {
  const pathname = usePathname()
  const search = useSearch()
  const setting = useSetting()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)
  const createDocument = useMutation(api.documents.create)
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
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e) => {
    if (!isResizingRef.current) return
    let newWidth = e.clientX

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

  const handleCreateDoc = () => {
    const promise = createDocument({ title: 'Untitled' })
    toast.promise(promise, {
      loading: 'Creating new note...',
      success: 'New note created!',
      error: 'Failed to create new note.'
    })
  }

  const handleSearch = () => search.onOpen()

  const handleSetting = () => setting.onOpen()

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
          <Item label='Search' icon={Search} isSearch onClick={handleSearch} />
          <Item label='Setting' icon={Settings} onClick={handleSetting} />
          <Item
            onClick={handleCreateDoc}
            label='New page'
            icon={PlusCircle}
          />
        </div>
        <div className='mt-4'>
          <DocumentList />
          <Item
            onClick={handleCreateDoc}
            icon={Plus}
            label='Add a page'
          />
          <Popover>
            <PopoverTrigger className='w-full mt-4 '>
              <Item label='Trash' icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className='p-0 w-72'
              side={isMobile ? 'bottom' : 'right'}
            >
              <Trashbox />
            </PopoverContent>
          </Popover>
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
