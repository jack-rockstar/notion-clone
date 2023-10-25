'use client'
import { ModeToggle } from '@/components/mode-toggle'
import useScrollTop from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import Logo from './logo'

export default function Navbar() {
  const scrolled = useScrollTop()
  return (
    <nav className={cn(
      'z-50 bg-background fixed dark:bg-[#1f1f1f] top-0 flex items-center w-full py-6 px-8',
      scrolled && 'border-b shadow-sm '
    )}
    >
      <Logo />
      <div className='flex items-center justify-between w-full md:ml-auto md:justify-end gap-x-2'>
        <ModeToggle />
      </div>
    </nav>
  )
}
