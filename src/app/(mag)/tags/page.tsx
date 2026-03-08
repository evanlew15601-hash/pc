import Link from 'next/link'

import { prisma } from '@/lib/db'

export const metadata = {
  title: 'Tags',
}

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  })

  return (
    <div className="flex flex-col gap-8">
      <header className="glass-card p-8">
        <div className="relative">
          <h1 className="font-display text-4xl font-black lowercase text-black/95 dark:text-white">
            Tags
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-black/70 dark:text-white/70">
            Browse Popcology by topic — fandom, nostalgia, Y2K tech, and whatever else becomes the story.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((t) => (
          <Link
            key={t.slug}
            href={`/tag/${t.slug}`}
            className="glass-card p-5"
          >
            <div className="relative flex items-center justify-between">
              <div>
                <div className="font-display text-xl font-black lowercase text-black/90 dark:text-white">
                  #{t.slug}
                </div>
                <div className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
                  {t._count.articles} article{t._count.articles === 1 ? '' : 's'}
                </div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 text-sm font-black text-ink-900 shadow-fizz dark:from-pop-500 dark:to-fizz-500 dark:text-white">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
