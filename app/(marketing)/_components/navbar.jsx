'use client'
import { ModeToggle } from '@/components/mode-toggle'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import useScrollTop from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import Link from 'next/link'
import Logo from './logo'

export default function Navbar() {
  const scrolled = useScrollTop()
  const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <nav className={cn(
      'z-50 bg-background fixed dark:bg-[#191919] top-0 flex items-center w-full py-6 px-8',
      scrolled && 'border-b shadow-sm '
    )}
    >
      <Logo />
      <div className='flex items-center justify-between w-full md:ml-auto md:justify-end gap-x-2'>
        {
          isLoading && <Spinner />
        }
        {
          !isAuthenticated && !isLoading && (
            <>
              <SignInButton mode='modal'>
                <Button variant='ghost' size='sm'>
                  Log in
                </Button>
              </SignInButton>
              <SignInButton mode='modal'>
                <Button size='sm'>
                  Get Nocion free
                </Button>
              </SignInButton>
            </>
          )
        }
        {isAuthenticated && !isLoading && (
          <>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/documents'>
                Enter Nocion
              </Link>
            </Button>
            <UserButton afterSignOutUrl='/' />
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  )
}
