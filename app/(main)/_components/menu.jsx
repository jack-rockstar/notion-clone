'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { ArrowDownToLine, FileUp, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const fonts = [
  {
    fontName: '',
    title: 'Predeterminado'
  },
  {
    fontName: 'font-serif',
    title: 'Serifa'
  },
  {
    fontName: 'font-mono',
    title: 'Mono'
  }
]

export default function Menu({ documentId, fontFamily }) {
  const router = useRouter()
  const { user } = useUser()
  const archive = useMutation(api.documents.archive)
  const update = useMutation(api.documents.update)
  const [open, setOpen] = useState(false)
  const onArchive = () => {
    const promise = archive({ id: documentId })

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.'
    })

    router.push('/documents')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost' className='focus-visible:ring-0 focus-visible:ring-offset-0' onClick={setOpen}>
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-60 bg-white dark:bg-[#1f1f1f]'
        align='end'
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem className='focus:bg-[#1f1f1f] cursor-pointer'>
          <div className='w-full mx-2'>
            <small className='text-xs font-normal text-[#ffffff71] opacity-95 block mb-1'>Estilos</small>
            <article className='flex items-center justify-between w-full'>
              {
                fonts.map(({ fontName, title }) => (
                  <section
                    key={title}
                    className={cn(
                      'flex flex-col items-center justify-center p-2 rounded cursor-pointer gap-y-2 hover:bg-accent'
                    )}
                    onClick={() => update({ fontFamily: fontName, id: documentId })} role='button'
                  >
                    <div className={cn(
                      `text-2xl font-medium ${fontName}`,
                      (fontFamily === fontName) && 'text-blue-500'
                    )}
                    >Ag
                    </div>
                    <small className='text-xs font-normal text-[#ffffff71] opacity-95'>{title}</small>
                  </section>
                ))
              }
            </article>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='flex justify-between cursor-pointer'>
            <label htmlFor='chkText' className='block mb-1 text-xs font-medium cursor-pointer text-white/75'>Texto pequeño</label>
            <Switch id='chkText' className='data-[state=unchecked]:bg-gray-500 data-[state=checked]:bg-blue-600 text-white h-4 w-8' classNameLog='h-4 w-4  data-[state=checked]:translate-x-4' />
          </DropdownMenuItem>
          <DropdownMenuItem className='flex justify-between'>
            <label htmlFor='chkAncho' className='block mb-1 text-xs font-medium cursor-pointer text-white/75'>Ancho completo</label>
            <Switch id='chkAncho' className='data-[state=unchecked]:bg-gray-500 data-[state=checked]:bg-blue-600 text-white  h-4 w-8' classNameLog='h-4 w-4  data-[state=checked]:translate-x-4' />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='cursor-pointer'>
            <ArrowDownToLine className='w-4 h-4 mr-2' />
            <small className='text-xs'>Import</small>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer'>
            <FileUp className='w-4 h-4 mr-2' />
            <div className='flex flex-col'>
              <small className='text-xs'>Export</small>
              <span className='text-[#ffffff71] text-xs opacity-95  mb-1'>PDF, HTML, Markdown</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onArchive} className='cursor-pointer'>
          <Trash className='w-4 h-4 mr-2' />
          <small className='text-xs'>Delete</small>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className='p-2 text-xs text-muted-foreground'>
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return (
    <Skeleton className='w-10 h-10' />
  )
}
