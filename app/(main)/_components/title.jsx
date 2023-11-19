'use client'

import IconPicker from '@/components/icon-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { FileText } from 'lucide-react'
import { useRef, useState } from 'react'
import BreadCrumb from './breadcrumb'

export default function Title({ initialData }) {
  const { _id, icon, title: titleDoc, parentDocument } = initialData
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

  const onIconSelect = (icon) => {
    update({
      id: initialData._id,
      icon
    })
  }

  const onChange = (e) => {
    setTitle(e.target.value)
    update({
      id: _id,
      title: e.target.value || 'Untitled'
    })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      // disabledInput()
      setIsEditing(false)
    }
  }

  return (
    <div className='relative flex items-center gap-x-1'>
      {
        parentDocument && <BreadCrumb parent={parentDocument} icon={icon} title={titleDoc} />
      }
      <Popover open={isEditing} onOpenChange={setIsEditing}>
        <PopoverTrigger asChild>
          <Button
            onClick={enabledInput}
            variant='ghost'
            size='sm'
            className='h-auto p-1 font-normal focus-visible:ring-0 focus-visible:ring-offset-0'
          >
            <span className='truncate'>
              {icon}{titleDoc}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='flex p-2 bg-white dark:bg-[#1F1F1F] border rounded-lg shadow-lg gap-x-2'>
          <TitleEditing icon={icon} inputRef={inputRef} onChange={onChange} onIconSelect={onIconSelect} onKeyDown={onKeyDown} title={title} />
        </PopoverContent>

      </Popover>
    </div>
  )
}

const TitleEditing = ({ onIconSelect, icon, inputRef, onChange, onKeyDown, title }) => {
  return (
    <>
      <IconPicker asChild onChange={onIconSelect}>
        <Button
          className='h-8 text-xs transition bg-transparent border border-gray-400 rounded dark:border-gray-700 w-9 text-muted-foreground'
          variant='outline'
          size='icon'
        >
          {!icon ? <FileText className='w-4 h-4' /> : icon}
        </Button>
      </IconPicker>
      <Input
        ref={inputRef}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={title}
        className='h-8 px-2 bg-transparent border border-gray-400 dark:border-gray-700 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'
      />
    </>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className='w-20 h-4 rounded-md' />
  )
}
