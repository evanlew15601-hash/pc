import type { ReactNode } from 'react'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export default function MagazineLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
      <Footer />
    </>
  )
}
