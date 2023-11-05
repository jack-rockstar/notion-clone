'use client'

import CoverImage from '@/components/cover-image'
import Toolbar from '@/components/toolbar'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export default function DocumentIdPage({ params }) {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  })

  if (document === undefined) {
    return (
      <div>
        loading...
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className='pb-40'>
      <CoverImage url={document.coverImage} />
      <header className='h-[35vh]' />
      <div className='mx-auto md:max-w-3xl lg:max-w-4xl'>
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}
