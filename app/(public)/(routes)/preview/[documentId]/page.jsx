'use client'

import CoverImage from '@/components/cover-image'
import Toolbar from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useMutation, useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import { useEffect, useMemo } from 'react'

export default function PreviewPage({ params }) {
  const Editor = useMemo(() => dynamic(() => import('@/components/editor'), { ssr: false }), [])

  const document = useQuery(api.documents.getByUrlMask, {
    urlMask: params.documentId
  })

  const update = useMutation(api.documents.update)

  const onChange = (content) => {
    update({
      id: document._id,
      content
    })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.title = document?.title ?? 'Nocion'
    }
  }, [document?.title])

  if (document === undefined) {
    return (
      <div>
        <CoverImage.Skeleton />
        <div className='mx-auto mt-10 md:max-w-3xl lg:max-w-4xl'>
          <div className='pt-4 pl-8 space-y-4 '>
            <Skeleton className='h-14 w-[50%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[40%]' />
            <Skeleton className='h-4 w-[60%]' />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className='pb-40'>
      <CoverImage url={document.coverImage} />
      <div className={cn(
        'max-w-3xl mx-auto',
        document.maxWidth && 'max-w-4xl',
        document.fontFamily
      )}
      >
        <Toolbar initialData={document} />
        <Editor
          onChange={onChange}
          initialContent={document.content}
          fontFamily={document.fontFamily}
          maxWidth={document.maxWidth}
          readOnly
        />
      </div>
    </div>
  )
}
