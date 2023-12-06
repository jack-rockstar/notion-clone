'use client'

import { api } from '@/convex/_generated/api'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useEdgeStore } from '@/lib/edgestore'
import { useMutation } from 'convex/react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { SingleImageDropzone } from '../single-image-dropzone'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

export default function CoverImageModal() {
  const params = useParams()
  const update = useMutation(api.documents.update)
  const [file, setFile] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  const onChange = async (file) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url
        }
      })

      await update({
        id: coverImage.getDocId() ?? params.documentId,
        coverImage: res.url
      })

      onClose()
    }
  }

  const handleClose = () => coverImage.onClose()

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className='text-lg font-semibold text-center'>
            Cover Image
          </h2>
        </DialogHeader>
        <SingleImageDropzone
          className='w-full outline-none'
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}
