'use client'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Heading() {
  const { isAuthenticated, isLoading } = useConvexAuth()

  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl font-bold sm:text-5xl md:text-6xl'>Your Ideas, Documents, & Plans. Unified. Welcome to
        <span className='underline'>Nocion</span>
      </h1>
      <h3 className='text-base font-medium sm:text-xl md:text-2xl'>
        Nocion is the connected workspace where <br />
        better, faster work happens
      </h3>
      {
        isLoading && (
          <div className='grid w-full place-content-center'>
            <Spinner size='lg' />
          </div>
        )
      }
      {
        isAuthenticated && !isLoading && (
          <Button asChild>
            <Link href='/documents'>
              Enter Nocion
              <ArrowRight className='w-4 h-4 ml-2' />
            </Link>
          </Button>
        )
      }
      {
        !isAuthenticated && !isLoading && (
          <SignInButton mode='modal'>
            <Button>
              Get Nocion free
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          </SignInButton>
        )
      }
    </div>
  )
}
