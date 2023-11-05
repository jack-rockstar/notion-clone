'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useEdgeStore } from '@/lib/edgestore'
import { cn } from '@/lib/utils'
import { useMutation } from 'convex/react'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import ConfirmModal from './modals/confirm-modal'
import { Skeleton } from './ui/skeleton'

export default function CoverImage({ url, preview }) {
  const removeImage = useMutation(api.documents.removeImage)
  const { edgestore } = useEdgeStore()
  const params = useParams()
  const coverImage = useCoverImage()
  const handleOpen = () => coverImage.onReplace(url)

  const onRemove = () => {
    if (!url) return
    const promise = removeImage({ id: params.documentId })
      .then(() => {
        edgestore.publicFiles.delete({
          url
        })
      })

    toast.promise(promise, {
      loading: 'Removing image...',
      success: 'Image deleted!',
      error: 'Failed to delete noiamgete'
    })
  }

  return (
    <div className={cn(
      'relative w-full h-[35vh] group',
      !url && 'h-[12vh]',
      url && 'bg-muted'
    )}
    >
      {
        !!url && (
          <Image
            src={url}
            fill
            alt='Cover'
            className='object-cover'
          />
        )
      }
      {url && !preview && (
        <div className='absolute flex items-center opacity-0 group-hover:opacity-100 bottom-5 right-5 gap-x-2'>
          <Button
            onClick={handleOpen}
            className='text-xs text-muted-foreground'
            variant='outline'
            size='sm'
          >
            <ImageIcon className='w-4 h-4' />
            Change cover
          </Button>
          <ConfirmModal onConfirm={onRemove}>
            <Button
              className='text-xs text-muted-foreground'
              variant='outline'
              size='sm'
            >
              <X className='w-4 h-4' />
              Remove
            </Button>

          </ConfirmModal>
        </div>
      )}
    </div>
  )
}

CoverImage.Skeleton = function CoverSkeleton() {
  return (
    <Skeleton className='w-full h-[12vh]' />
  )
}
