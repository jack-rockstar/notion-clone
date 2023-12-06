'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useEditor } from '@/hooks/use-editor'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Trash } from 'lucide-react'
import { toast } from 'sonner'

export default function Item({ label, onClick, icon: Icon, active, id, documentIcon, isSearch, level = 0, onExpanded, expanded }) {
  const { user } = useUser()
  const ChevronIcon = expanded ? ChevronDown : ChevronRight
  const create = useMutation(api.documents.create)
  const archive = useMutation(api.documents.archive)
  const editor = useEditor()
  const handleExpand = (e) => {
    e.stopPropagation()
    onExpanded?.()
  }

  const onCreate = (e) => {
    e.stopPropagation()
    if (!id) return

    const promise = create({ title: 'Untitled', parentDocument: id })
      .then((id) => {
        if (!expanded) {
          onExpanded?.()
        }

        editor.setDoc(id)
        editor.onOpen()
        // router.replace(`/documents/${id}`)
        // router.push(`/documents/${docId}`)
      })

    toast.promise(promise, {
      loading: 'Creating new note...',
      success: 'New note created',
      error: 'Failed to create a new note'
    })
  }

  const onArchived = (e) => {
    e.stopPropagation()
    if (!id) return

    const promise = archive({ id })
    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.'
    })
  }

  return (
    <>
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
            className='h-full mr-1 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
            role='button'
            onClick={handleExpand}
          >
            <ChevronIcon className='w-4 h-4 shrink-0 text-muted-foreground/50' />
          </article>
        )}
        {
        documentIcon
          ? <article className='shrink-0 mr-2 text-[18px]'>{documentIcon}</article>
          : <Icon className='shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground' />
      }
        <span className='truncate'>
          {label}
        </span>
        {
        isSearch && (
          <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
            <span className='text-xs'>⌘</span>K
          </kbd>
        )
      }
        {
        !!id && (
          <div className='flex items-center ml-auto gap-x-2'>
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                asChild
              >
                <div role='button' className='h-full ml-auto rounded-sm opacity-0 group-hover:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600'>
                  <MoreHorizontal className='w-4 h-4 text-muted-foreground' />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-60'
                align='start'
                side='rigth'
                forceMount
              >
                <DropdownMenuItem onClick={onArchived}>
                  <Trash className='w-4 h-4 mr-2' />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className='p-2 text-xs text-muted-foreground'>
                  Last edited by: {user?.fullName}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <section role='button' onClick={onCreate} className='h-full ml-auto rounded-sm opacity-0 group-hover:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600'>
              <Plus className='w-4 h-4 text-muted-foreground' />
            </section>

          </div>
        )
      }
      </div>
    </>
  )
}

Item.Skeleton = function ItemSkeleton({ level }) {
  return (
    <div style={{ paddingLeft: level ? `${(level * 12) + 5}px` : '12px' }} className='flex gap-x-2 py-[3px]'>
      <Skeleton className='w-4 h-4' />
      <Skeleton className='h-4 w-[30%]' />

    </div>
  )
}
