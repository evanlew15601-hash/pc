import Link from 'next/link'

import { prisma } from '@/lib/db'
import { BrandWordmark } from '@/components/BrandWordmark'
import { SearchBar } from '@/components/SearchBar'
import { ThemeToggle } from '@/components/ThemeToggle'

export async function NavBar() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, slug: true },
  })

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-white/45 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <BrandWordmark />
          <div className="flex items-center gap-3">
            <SearchBar className="hidden w-[360px] md:flex" />
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/75 shadow-glass transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/tags"
            className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/75 shadow-glass transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            Tags
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/75 shadow-glass transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            About
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/75 shadow-glass transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 md:hidden"
          >
            Search
          </Link>
        </nav>
      </div>
    </header>
  )
}
