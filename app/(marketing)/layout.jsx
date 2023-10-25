import Navbar from './_components/navbar'

export default function MarketingLayout({ children }) {
  return (
    <header className='h-full dark:bg-[#1f1f1f]'>
      <Navbar />
      <main className='h-full pt-40'>
        {children}
      </main>
    </header>
  )
}
