'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const { user } = useUser()
  const router = useRouter()
  const create = useMutation(api.documents.create)

  const onCreate = () => {
    const promise = create({ title: 'untitled' })
      .then((docId) => router.push(`/documents/${docId}`))
    toast.promise(promise, {
      loading: 'Creating new note...',
      success: 'New note created',
      error: 'Failed to create new note'
    })
  }

  return (
    <div className='flex flex-col items-center justify-center h-full space-y-4'>
      <Image
        src='/empty.png'
        height={300}
        width={300}
        alt='Empty'
        className='dark:hidden'
      />
      <Image
        src='/empty-dark.png'
        height={300}
        width={300}
        alt='Empty'
        className='hidden dark:block'
      />
      <h2 className='text-lg font-medium'>Welcome to {user?.firstName}&apos;s Nocion</h2>
      <Button onClick={onCreate}>
        <PlusCircle className='w-4 h-4 mr-2' />
        Create a note
      </Button>
    </div>
  )
}
