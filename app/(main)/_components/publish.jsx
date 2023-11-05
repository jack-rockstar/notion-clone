'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { api } from '@/convex/_generated/api'
import useOrigin from '@/hooks/use-origin'
import { useMutation } from 'convex/react'
import { Check, Copy, Globe } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Publish({ initialData }) {
  const origin = useOrigin()
  const update = useMutation(api.documents.update)
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const url = `${origin}/preview/${initialData._id}`

  const handlePublish = (publish = true) => {
    console.log({ publish })
    setIsSubmitting(true)
    const promise = update({
      id: initialData._id,
      isPublished: publish
    }).finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: `${publish ? 'Publishing...' : 'Unpublishing...'}`,
      success: `${publish ? 'Note published' : 'Note unpublished'}`,
      error: `${publish ? 'Failed to publish note.' : 'Failed to unpublish note.'}`
    })
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='ghost'>
          Publish
          {initialData.isPublished && (
            <Globe className='w-4 h-4 mt-2 text-sky-500' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-72'
        align='end'
        alignOffset={8}
        forceMount
      >
        {
          initialData.isPublished
            ? (
              <div className='space-y-4'>
                <div className='flex items-center gap-x-2'>
                  <Globe className='w-4 h-4 text-sky-500 animate-pulse' />
                  <p className='text-xs font-medium text-sky-500 '>This note is live on web.</p>
                </div>
                <div className='flex items-center'>
                  <input
                    value={url}
                    className='flex-1 h-8 px-2 text-xs truncate border rounded-l-md bg-muted'
                    disabled
                  />
                  <Button
                    onClick={onCopy}
                    disabled={copied}
                    className='h-8 rounded-l-none'
                  >
                    {
                      copied
                        ? <Check className='w-4 h-4' />
                        : <Copy className='w-4 h-4 ' />
                    }
                  </Button>
                </div>
                <Button
                  size='sm'
                  className='w-full text-xs'
                  disabled={isSubmitting}
                  onClick={() => handlePublish(false)}
                >
                  Unpublish
                </Button>
              </div>
              )
            : (
              <div className='flex flex-col items-center justify-center'>
                <Globe className='w-8 h-8 mb-2 text-muted-foreground' />
                <p className='mb-2 text-sm font-medium'>Publish this note</p>
                <span className='mb-4 text-xs text-muted-foreground '>Share your work with others</span>
                <Button
                  disabled={isSubmitting}
                  onClick={() => handlePublish()}
                  className='w-full text-xs'
                  size='sm'
                >
                  Publish
                </Button>
              </div>
              )
        }
      </PopoverContent>
    </Popover>
  )
}
