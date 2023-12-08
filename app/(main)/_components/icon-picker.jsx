'use client'

import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useTheme } from 'next-themes'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'

export default function IconPicker({ onChange, children, asChild }) {
  const { resolvedTheme } = useTheme()
  const currentTheme = (resolvedTheme || 'light')
  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT
  }

  const theme = themeMap[currentTheme]

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent className='w-full p-0 border-none shadow-none'>
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  )
}
