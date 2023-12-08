'use client'

import { api } from '@/convex/_generated/api'
import { useEdgeStore } from '@/lib/edgestore'
import { cn, getFileByUrl, getRandomPath } from '@/lib/utils'
import { coverImageStore } from '@/store/cover-image-store'
import { useMutation } from 'convex/react'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import IconPicker from '../app/(main)/_components/icon-picker'
import { Button } from './ui/button'

export default function Toolbar({ initialData, preview }) {
  const inputRef = useRef(null)
  const [value, setValue] = useState(initialData.title)
  const update = useMutation(api.documents.update)
  const removeIcon = useMutation(api.documents.removeIcon)
  const params = useParams()
  const coverStore = coverImageStore()
  const { edgestore } = useEdgeStore()

  const { icon, coverImage, title } = initialData

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

  const onCover = async () => {
    const fileRandom = getRandomPath(coverStore.getGallery())
    const file = await getFileByUrl(fileRandom)
    const res = await edgestore.publicFiles.upload({
      file,
      options: {
        replaceTargetUrl: undefined
      }
    })

    await update({
      id: initialData._id ?? params.documentId,
      coverImage: res.url
    })
    // coverStore.onOpen()
  }

  return (
    <div className={cn(
      'group relative ',
      !coverImage && 'items-center mt-8'
    )}
    >
      {icon && !preview && (
        <div className='flex flex-row items-center gap-x-2 group/icon'>
          <IconPicker onChange={onIconSelect}>
            <p
              title='Remove icon' className={cn(
                'absolute text-5xl md:text-7xl lg:text-7xl transition -top-8 md:-top-10 lg:-top-10 left-3 md:left-0 lg:-left-6 hover:opacity-75',
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
              className='text-xs bg-transparent border-none text-muted-foreground'
              variant='outline'
              size='xs'
            >
              <Smile className='w-4 h-4 mr-2 font-bold' />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {
          !coverImage && !preview && (
            <Button
              onClick={onCover}
              className='text-xs bg-transparent border-none text-muted-foreground'
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
      {!preview
        ? (
          <section className='flex items-center w-full'>
            <TextareaAutosize
              ref={inputRef}
              onKeyDown={onKeyDown}
              value={value}
              onChange={(e) => onInput(e.target.value)}
              className='text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none grow text-center'
            />
          </section>
          )
        : (
          <div
            className={cn(
              'pb-[11.5px] text-5xl font-bold mt-4 break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] text-center',
              initialData.fontFamily
            )}
          >
            {title}
          </div>
          )}
    </div>
  )
}
