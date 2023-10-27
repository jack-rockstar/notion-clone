'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useMutation } from 'convex/react'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Item({ label, onClick, icon: Icon, active, id, documentIcon, isSearch, level = 0, onExpanded, expanded }) {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight
  const create = useMutation(api.documents.create)
  const router = useRouter()
  const handleExpand = (e) => {
    e.stopPropagation()
    onExpanded?.()
  }

  const onCreate = (e) => {
    e.stopPropagation()
    if (!id) return

    const promise = create({ title: 'Untitled', parentDocument: id })
      .then((docId) => {
        if (!expanded) {
          onExpanded?.()
        }
        // router.push(`/documents/${docId}`)
      })

    toast.promise(promise, {
      loading: 'Creating new note...',
      success: 'New note created',
      error: 'Failed to create a new note'
    })
  }

  return (
    <div
      onClick={onClick} role='button'
      style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      {!!id && (
        <article
          className='h-full mr-1 rounded-sm hover:bg-neutral-300 dark:bg-neutral-600'
          role='button'
          onClick={handleExpand}
        >
          <ChevronIcon className='w-4 h-4 shrink-0 text-muted-foreground/50' />
        </article>
      )}
      {
        documentIcon
          ? <article className='shrink-0 mr-2 text-[18px]'>{documentIcon}</article>
          : <Icon className='shrink-0 h-[18px] mr-2 text-muted-foreground' />
      }
      <span className='truncate'>
        {label}
      </span>
      {
        isSearch && (
          <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
            <span className='text-xs'>&</span>K
          </kbd>
        )
      }
      {
        !!id && (
          <div className='flex items-center ml-auto gap-x-2'>
            <section role='button' onClick={onCreate} className='h-full ml-auto rounded-sm opacity-0 group-hover:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600'>
              <Plus className='w-4 h-4 text-muted-foreground' />
            </section>

          </div>
        )
      }
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }) {
  return (
    <div style={{ padding: level ? `${(level * 12) + 25}px` : '12px' }} className='flex gap-x-2 py-[3px]'>
      <Skeleton className='w-4 h-4' />
      <Skeleton className='h-4 w-[30%]' />

    </div>
  )
}
