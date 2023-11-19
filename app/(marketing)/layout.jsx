import Navbar from './_components/navbar'

export default function MarketingLayout({ children }) {
  return (
    <header className='min-h-screen dark:bg-[#191919]'>
      <Navbar />
      <main className='pt-40'>
        {children}
      </main>
    </header>
  )
}
