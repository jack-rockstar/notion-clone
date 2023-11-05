'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { useRef, useState } from 'react'

export default function Title({ initialData }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialData?.title || 'Untitled')
  const inputRef = useRef(null)
  const update = useMutation(api.documents.update)

  const enabledInput = () => {
    setTitle(initialData.title)
    setIsEditing(true)

    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current?.value?.length)
    }, 0)
  }

  const disabledInput = () => {
    setIsEditing(false)
  }

  const onChange = (e) => {
    setTitle(e.target.value)
    update({
      id: initialData._id,
      title: e.target.value || 'Untitled'
    })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      disabledInput()
    }
  }

  return (
    <div className='flex items-center gap-x-1'>
      {
        !!initialData.icon && <p>{initialData.icon}</p>
      }
      {isEditing
        ? (
          <Input
            ref={inputRef}
            onClick={enabledInput}
            onBlur={disabledInput}
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={title}
            className='px-2 h-7 focus-visible:ring-transparent'
          />
          )
        : (
          <Button
            onClick={enabledInput}
            variant='ghost'
            size='sm'
            className='h-auto p-1 font-normal'
          >
            <span className='truncate'>
              {initialData?.title}
            </span>
          </Button>
          )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className='w-20 h-4 rounded-md' />
  )
}
