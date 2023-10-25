import Image from 'next/image'

export default function Heroes() {
  return (
    <section className='flex flex-col items-center justify-center max-w-5xl'>
      <div className='flex items-center'>
        <article className='relative  w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]'>
          <Image
            src='/documents.png'
            fill
            className='object-contain dark:hidden'
            alt='Documents'
          />
          <Image
            src='/documents-dark.png'
            fill
            className='hidden object-contain dark:block'
            alt='Documents'
          />
        </article>
        <article className='h-[400px] w-[400px] relative hidden md:block'>
          <Image
            src='/reading.png'
            fill
            className='object-contain dark:hidden'
            alt='Reading'
          />
          <Image
            src='/reading-dark.png'
            fill
            className='hidden object-contain dark:block'
            alt='Reading'
          />

        </article>
      </div>
    </section>
  )
}
