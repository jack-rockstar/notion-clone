'use client'

import { api } from '@/convex/_generated/api'
import { useSearch } from '@/hooks/use-search'
import { useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'

export default function SearchCommand() {
  const { user } = useUser()
  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)
  const [isMounted, setIsMounted] = useState(false)
  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  const onSelect = (id) => {
    router.push(`/documents/${id}`)
    onClose()
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [toggle])

  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s Nocion...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Documents'>
          {
            documents?.map((d) => (
              <CommandItem
                key={d._id}
                value={`${d._id}`}
                title={d.title}
                onSelect={onSelect}
              >
                {
                  d.icon
                    ? (
                      <p className='mr-2 text-[18px]'>{d.icon}</p>
                      )
                    : (
                      <File className='w-4 h-4 mr-2' />
                      )

                }
                <span>
                  {d.title}
                </span>
              </CommandItem>
            ))
          }
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
