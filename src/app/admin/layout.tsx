import type { ReactNode } from 'react'

import Link from 'next/link'

import { BrandWordmark } from '@/components/BrandWordmark'

export const metadata = {
  title: 'Editor',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="glass-card p-6">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandWordmark />
          <nav className="flex flex-wrap gap-2">
            {[
              ['Dashboard', '/admin'],
              ['Articles', '/admin/articles'],
              ['Categories', '/admin/categories'],
              ['Tags', '/admin/tags'],
              ['Authors', '/admin/authors'],
              ['Comments', '/admin/comments'],
              ['Newsletter', '/admin/newsletter'],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-4 py-2 text-xs font-black tracking-widest text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
            >
              View site
            </Link>
          </nav>
        </div>
      </header>

      {children}
    </main>
  )
}
