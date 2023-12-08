'use client'

import ButtonCover from '@/app/(main)/_components/button-cover'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useEditor } from '@/hooks/use-editor'
import { useEdgeStore } from '@/lib/edgestore'
import { cn } from '@/lib/utils'
import { useMutation } from 'convex/react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import ConfirmModal from './modals/confirm-modal'
import { Skeleton } from './ui/skeleton'

export default function CoverImage({ url, inModal = false, preview }) {
  const params = useParams()
  const editor = useEditor()
  const removeImage = useMutation(api.documents.removeImage)
  const { edgestore } = useEdgeStore()

  const onRemove = async () => {
    if (!url) return
    const promise = removeImage({ id: editor.getDoc() ?? params.documentId })
      .then(() => {
        edgestore.publicFiles.delete({
          url
        })
      })

    toast.promise(promise, {
      loading: 'Removing image...',
      success: 'Image deleted!',
      error: 'Failed to delete image'
    })
  }

  return (
    <div className={cn(
      'relative w-full h-[35vh] group',
      !url && 'h-[20vh]',
      url && 'bg-muted',
      inModal && !url && 'h-[]0vh]'
    )}
    >
      {
        url && (
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
          <ButtonCover replaceUrl={url} />
          {/* <Button
            onClick={onOpen}
            className='text-xs text-muted-foreground'
            variant='outline'
            size='sm'
          >
            <ImageIcon className='w-4 h-4' />
            Change cover
          </Button> */}
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
