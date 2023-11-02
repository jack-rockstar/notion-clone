'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { useRef, useState } from 'react'

export default function Title({ initialDate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialDate?.title || 'Untitled')
  const inputRef = useRef(null)
  const update = useMutation(api.documents.update)

  const enabledInput = () => {
    setTitle(initialDate.title)
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
      id: initialDate._id,
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
        !!initialDate.icon && <p>{initialDate.icon}</p>
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
              {initialDate?.title}
            </span>
          </Button>
          )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className='w-16 rounded-md h-9' />
  )
}
