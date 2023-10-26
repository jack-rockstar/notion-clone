'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SignOutButton, useUser } from '@clerk/clerk-react'
import { ChevronsLeftRight } from 'lucide-react'

export default function UserItem() {
  const { user } = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role='button' className='flex items-center w-full p-3 text-sm hover:bg-primary/5'>
          <section className='gap-x-2 flex items-center max-w-[150px]'>
            <Avatar className='w-5 h-5'>
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className='font-medium text-start line-clamp-1'>{user?.fullName}&apos;s Nocion</span>
          </section>
          <ChevronsLeftRight className='w-4 h-4 ml-2 rotate-90 text-muted-foreground' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-80'
        align='start'
        alignOffset={11}
        forceMount
      >
        <div className='flex flex-col p-2 space-y-4'>
          <p className='text-xs font-medium leading-none text-muted-foreground'>
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className='flex items-center gap-x-2 '>
            <section className='p-1 rounded-md bg-secondary'>
              <Avatar className='w-8 h-8 '>
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </section>
            <section className='space-y-1 '>
              <p className='text-sm line-clamp-1'>
                {user?.fullName}&apos;s Nocion
              </p>
            </section>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='w-full cursor-pointer text-muted-foreground' asChild>
          <SignOutButton>
            Log out
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
