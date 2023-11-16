'use client'

import { api } from '@/convex/_generated/api'
import { useCoverImage } from '@/hooks/use-cover-image'
import { cn } from '@/lib/utils'
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
  const coverImageModal = useCoverImage()

  const { icon, coverImage, title } = initialData

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

  const handleOpen = () => coverImageModal.onOpen()

  return (
    <div className={cn(
      'pl-[54px] group relative ',
      !coverImage && 'items-center mt-8'
    )}
    >
      {icon && !preview && (
        <div className='flex flex-row items-center gap-x-2 group/icon'>
          <IconPicker onChange={onIconSelect}>
            <p
              title='Remove icon' className={cn(
                'absolute text-7xl transition -top-9 md:left-0 lg:-left-6 hover:opacity-75',
                !coverImage && 'sticky'
              )}
            >
              {icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className='absolute w-8 h-8 p-2 text-xs transition rounded-full opacity-0 -top-6 group-hover/icon:opacity-100 text-muted-foreground'
            variant='outline'
            size='icon'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
      )}
      <div className='flex items-center py-4 opacity-0 group-hover:opacity-100 gap-x-1'>
        {!icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className='text-xs text-muted-foreground'
              variant='outline'
              size='xs'
            >
              <Smile className='w-4 h-4 mr-2' />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {
          !coverImage && !preview && (
            <Button
              onClick={handleOpen}
              className='text-xs text-muted-foreground'
              variant='outline'
              size='xs'
            >
              <ImageIcon className='w-4 h-4 mr-2' />
              Add cover
            </Button>
          )
        }
      </div>

      {
        !!icon && preview && (
          <p className='pt-6 text-6xl'>
            {icon}
          </p>
        )
      }
      {/* <div className='flex items-center py-4 opacity-0 group-hover:opacity-100 gap-x-1'>
        {!icon && !preview && (
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
          !coverImage && !preview && (
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
      </div> */}
      {!isEditing && !preview
        ? (
          <section className='flex items-center w-full'>
            <TextareaAutosize
              ref={inputRef}
              onBlur={disabledInput}
              onKeyDown={onKeyDown}
              value={value}
              onChange={(e) => onInput(e.target.value)}
              className='text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none grow text-center'
            />
          </section>
          )
        : (
          <div
            onClick={enableInput}
            className='pb-[11.5px]  text-5xl font-bold mt-4 break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] text-center'
          >
            {title}
          </div>
          )}
    </div>
  )
}
