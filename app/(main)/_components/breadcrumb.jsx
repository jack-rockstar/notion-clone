import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import Link from 'next/link'

export default function BreadCrumb({ parent }) {
  const document = useQuery(api.documents.getById, {
    documentId: parent
  })
  return (
    <header className='flex gap-x-2'>
      {document?.parentDocument && <BreadCrumb parent={document?.parentDocument} />}
      <Button
        variant='ghost'
        size='sm'
        className='h-auto p-1 font-normal'
        asChild
      >
        <Link href={`/documents/${document?._id}`}>
          <span className='truncate'>
            {document?.icon}{document?.title}
          </span>
        </Link>
      </Button>
      /
    </header>
  )
}
