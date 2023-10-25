import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Heading() {
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl font-bold sm:text-5xl md:text-6xl'>Your Ideas, Documents, & Plans. Unified. Welcome to
        <span className='underline'>Nocion</span>
      </h1>
      <h3 className='text-base font-medium sm:text-xl md:text-2xl'>
        Nocion is the connected workspace where <br />
        better, faster work happens
      </h3>
      <Button>
        Enter Nocion
        <ArrowRight className='w-4 h-4 ml-2' />
      </Button>
    </div>
  )
}
