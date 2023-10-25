import { ThemeProvider } from '@/components/providers/theme-provider'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nocion',
  description: 'el espacio de trabajo conectado donde se puede trabajar mejor y más rápido.',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.svg',
        href: '/logo.svg'
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo-dark.svg',
        href: '/logo-dark.svg'
      }
    ]
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
          storageKey='nocion-theme'
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
