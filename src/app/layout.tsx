import type { ReactNode } from 'react'

import type { Metadata } from 'next'
import { Fredoka, Inter } from 'next/font/google'

import './globals.css'

import { ThemeProvider } from '@/components/ThemeProvider'

const display = Fredoka({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'popcology — pop culture analysis worth studying',
    template: '%s — popcology',
  },
  description:
    'Popcology is a pop culture analysis magazine: retrospectives, media criticism, reviews, and cultural essays.',
  metadataBase: new URL('https://popcology.example'),
  openGraph: {
    type: 'website',
    title: 'popcology',
    description:
      'Popcology is a pop culture analysis magazine: retrospectives, media criticism, reviews, and cultural essays.',
  },
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: 'popcology RSS' }],
    },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} pop-bg text-black dark:text-white`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
