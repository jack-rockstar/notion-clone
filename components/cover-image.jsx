'use client'

import ButtonCover from '@/app/(main)/_components/button-cover'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Skeleton } from './ui/skeleton'

export default function CoverImage({ url, inModal = false, preview }) {
  return (
    <div className={cn(
      'relative w-full h-[35vh] group',
      !url && 'h-[20vh]',
      url && 'bg-muted',
      inModal && !url && 'h-[]0vh]'
    )}
    >
      {
        url && (
          <Image
            src={url}
            fill
            alt='Cover'
            className='object-cover'
          />
        )
      }
      {url && !preview && (
        <div className='absolute flex items-center opacity-100 md:opacity-0 lg:opacity-0 group-hover:opacity-100 bottom-5 right-5 gap-x-2'>
          <ButtonCover replaceUrl={url} />
        </div>
      )}
    </div>
  )
}

CoverImage.Skeleton = function CoverSkeleton() {
  return (
    <Skeleton className='w-full h-[12vh]' />
  )
}
