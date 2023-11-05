'use client'

import { api } from '@/convex/_generated/api'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useMutation } from 'convex/react'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import IconPicker from './icon-picker'
import { Button } from './ui/button'

export default function Toolbar({ initialData, preview }) {
  const inputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialData.title)

  const update = useMutation(api.documents.update)
  const removeIcon = useMutation(api.documents.removeIcon)
  const coverImage = useCoverImage()

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disabledInput = () => setIsEditing(false)

  const onInput = (value) => {
    setValue(value)
    update({
      id: initialData._id,
      title: value || 'Untitled'
    })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      disabledInput()
    }
  }

  const onIconSelect = (icon) => {
    update({
      id: initialData._id,
      icon
    })
  }

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id
    })
  }

  const handleOpen = () => coverImage.onOpen()

  return (
    <div className='pl-[54px] group relative'>
      {initialData.icon && !preview && (
        <div className='flex items-center pt-6 gap-x-2 group/icon'>
          <IconPicker onChange={onIconSelect}>
            <p className='text-6xl transition hover:opacity-75'>
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className='text-xs transition rounded-full opacity-0 group-hover/icon:opacity-100 text-muted-foreground'
            variant='outline'
            size='icon'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
      )}
      {
        !!initialData.icon && preview && (
          <p className='pt-6 text-6xl'>
            {initialData.icon}
          </p>
        )
      }
      <div className='flex items-center py-4 opacity-0 group-hover:opacity-100 gap-x-1'>
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className='text-xs text-muted-foreground'
              variant='outline'
              size='sm'
            >
              <Smile className='w-4 h-4 mr-2' />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {
          !initialData.coverImage && !preview && (
            <Button
              onClick={handleOpen}
              className='text-xs text-muted-foreground'
              variant='outline'
              size='sm'
            >
              <ImageIcon className='w-4 h-4 mr-2' />
              Add cover
            </Button>
          )
        }
      </div>
      {isEditing && !preview
        ? (
          <TextareaAutosize
            ref={inputRef}
            onBlur={disabledInput}
            onKeyDown={onKeyDown}
            value={value}
            onChange={(e) => onInput(e.target.value)}
            className='text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none'
          />
          )
        : (
          <div
            onClick={enableInput}
            className='pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]'
          >
            {initialData.title}
          </div>
          )}
    </div>
  )
}
