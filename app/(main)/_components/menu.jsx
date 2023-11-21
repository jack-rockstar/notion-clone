'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Menu({ documentId }) {
  const router = useRouter()
  const { user } = useUser()
  const archive = useMutation(api.documents.archive)

  const onArchive = () => {
    const promise = archive({ id: documentId })

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.'
    })

    router.push('/documents')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost'>
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-60 bg-white dark:bg-[#1f1f1f]'
        align='end'
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className='w-4 h-4 mr-2' />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className='p-2 text-xs text-muted-foreground'>
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return (
    <Skeleton className='w-10 h-10' />
  )
}
