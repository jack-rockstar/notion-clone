'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useQuery } from 'convex/react'
import { FileIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Item from './item'

export default function DocumentList({ parentDocumentId, level = 0 }) {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState({})
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId
  })
  const onExpanded = (documentId) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId]
    }))
  }

  const onRedirect = (documentId) => router.push(`/documents/${documentId}`)

  console.log({ params })

  if (!documents) {
    return (
      <>
        <Item.Skeleton level={level} />
        {
        level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )
      }
      </>
    )
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
      >No pages inside
      </p>
      {
        documents.map((e) => (
          <div key={e._id}>
            <Item
              id={e._id}
              onClick={() => onRedirect(e._id)}
              label={e.title}
              icon={FileIcon}
              documentIcon={e.icon}
              active={params.documentId === e._id}
              level={level}
              onExpanded={() => onExpanded(e._id)}
              expanded={expanded[e._id]}
            />
            {
              expanded[e._id] && (
                <DocumentList
                  parentDocumentId={e._id}
                  level={level + 1}
                />
              )
            }
          </div>
        ))
      }
    </>
  )
}
