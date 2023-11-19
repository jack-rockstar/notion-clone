import { Button } from '@/components/ui/button'
import Logo from './logo'

export default function Footer() {
  return (
    <footer className='z-50 flex items-center dark:bg-[#191919] w-full p-6 bg-background'>
      <Logo />
      <div className='flex items-center justify-between w-full md:ml-auto md:justify-end gap-x-2 text-muted-foreground'>
        <Button variant='ghost' size='sm'>
          Privacy Policy
        </Button>
        <Button variant='ghost' size='sm'>
          Terms & Conditions
        </Button>
      </div>
    </footer>
  )
}
