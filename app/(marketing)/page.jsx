import Footer from './_components/footer'
import Heading from './_components/heading'
import Heroes from './_components/heroes'

export default function MarketingPage() {
  return (
    <div className='flex flex-col '>
      <div className='flex flex-col items-center justify-center flex-1 px-6 pb-10 text-center md:justify-start gap-y-8'>
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  )
}
