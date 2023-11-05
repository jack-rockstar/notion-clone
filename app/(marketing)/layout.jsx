import Navbar from './_components/navbar'

export default function MarketingLayout({ children }) {
  return (
    <header className='min-h-screen dark:bg-[#1f1f1f]'>
      <Navbar />
      <main className='pt-40'>
        {children}
      </main>
    </header>
  )
}
