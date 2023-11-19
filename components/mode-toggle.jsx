'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const menus = [
  {
    text: 'Light',
    value: 'light'
  },
  {
    text: 'Dark',
    value: 'dark'
  },
  {
    text: 'System',
    value: 'system'
  }
]

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='focus-visible:ring-1 focus-visible:ring-offset-0' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {
          menus.map(({ text, value }) => (
            <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
              {text}
            </DropdownMenuItem>
          ))
        }

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
