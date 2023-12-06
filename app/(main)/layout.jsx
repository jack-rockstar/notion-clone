'use client'

import SearchCommand from '@/components/search-command'
import Spinner from '@/components/spinner'
import { useConvexAuth } from 'convex/react'
import { redirect } from 'next/navigation'
import Navigation from './_components/navigation'

export default function MainLayout({ children }) {
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner size='lg' />
      </div>
    )
  }

  if (!isAuthenticated) {
    return redirect('/')
  }

  return (
    <div className='h-full flex dark:bg-[#191919]'>
      <Navigation />
      <main className='flex-1 h-full overflow-y-auto custom-scrollbar'>
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}
