import Link from 'next/link'

import { BrandIcon } from '@/components/BrandIcon'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/25 bg-white/30 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/25">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandIcon className="h-11 w-11 drop-shadow-[0_16px_30px_rgba(255,31,240,0.25)]" />
            <div>
              <div className="font-display text-lg font-black lowercase tracking-tight text-black/85 dark:text-white/90">
                popcology
              </div>
              <div className="text-sm text-black/65 dark:text-white/65">
                Pop culture analysis worth studying.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-black/70 dark:text-white/70">
            <Link href="/about" className="hover:text-black dark:hover:text-white">
              About
            </Link>
            <Link href="/search" className="hover:text-black dark:hover:text-white">
              Search
            </Link>
            <Link href="/tags" className="hover:text-black dark:hover:text-white">
              Tags
            </Link>
            <Link href="/reading-list" className="hover:text-black dark:hover:text-white">
              Reading list
            </Link>
            <Link href="/admin" className="hover:text-black dark:hover:text-white">
              Editor
            </Link>
          </div>
        </div>

        <div className="mt-8 text-xs font-semibold tracking-wide text-black/55 dark:text-white/55">
          © {new Date().getFullYear()} Popcology. Written by Evan Lewis.
        </div>
      </div>
    </footer>
  )
}
