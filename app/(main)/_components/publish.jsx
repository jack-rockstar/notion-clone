'use client'

import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { api } from '@/convex/_generated/api'
import useOrigin from '@/hooks/use-origin'
import { useMutation } from 'convex/react'
import { Check, Copy, Globe } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Publish({ initialData }) {
  const origin = useOrigin()
  const update = useMutation(api.documents.publish)
  const stopPosting = useMutation(api.documents.update)
  const [url, setUrl] = useState(initialData?.urlMask || initialData?._id)
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pathPreview = url || initialData._id

  const handlePublish = () => {
    setIsSubmitting(true)
    update({
      id: initialData._id,
      isPublished: true,
      urlMask: pathPreview
    }).then((e) => {
      if (!e.status) {
        toast.error(`${e.code === 409 ? 'A publication already exists with that domain.' : 'Error publishing the page.'}`)
        return
      }
      toast.success('Page published successfully')
    }).finally(() => setIsSubmitting(false))
  }

  const onCopy = () => {
    navigator.clipboard.writeText(`${origin}/preview/${url || initialData._id}`)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const onPublish = () => {
    setIsSubmitting(true)
    setUrl('')
    const promise = stopPosting({
      id: initialData._id,
      isPublished: false,
      urlMask: ''
    }).finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: 'Unpublishing...',
      success: 'Note unpublished',
      error: 'Failed to unpublish note.'
    })
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
                    value={`${origin}/preview/${pathPreview}`}
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
                  onClick={() => onPublish(false)}
                >
                  {
                    isSubmitting ? <Spinner size='lg' /> : 'Unpublish'
                  }
                </Button>
              </div>
              )
            : (
              <div className='flex flex-col items-center justify-center'>
                <Globe className='w-8 h-8 mb-2 text-muted-foreground' />
                <p className='mb-2 text-sm font-medium'>Publish this note</p>
                <span className='mb-4 text-xs text-muted-foreground '>Share your work with others</span>
                <Input onChange={(e) => setUrl(e.target.value)} className='mb-4 bg-transparent h-9 focus-visible:ring-0 focus-visible:border-blue-700 focus-visible:ring-offset-0' placeholder='/miportafolio' />
                <Button
                  disabled={isSubmitting}
                  onClick={handlePublish}
                  className='w-full text-xs'
                  size='sm'
                >
                  {
                    isSubmitting ? <Spinner size='lg' /> : 'Publish'
                  }
                </Button>
              </div>
              )
        }
      </PopoverContent>
    </Popover>
  )
}
