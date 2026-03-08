import Link from 'next/link'

import { ArticleCard } from '@/components/ArticleCard'
import { SearchBar } from '@/components/SearchBar'
import { prisma } from '@/lib/db'
import { publishedWhere } from '@/lib/publication'

export const metadata = {
  title: 'Search',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? '').trim()

  const results = query
    ? await prisma.article.findMany({
        where: {
          ...publishedWhere(),
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { subtitle: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { bodyMdx: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: [{ publishedAt: 'desc' }, { views: 'desc' }],
        take: 30,
        include: { category: true },
      })
    : []

  const trending = await prisma.article.findMany({
    where: publishedWhere(),
    orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
    take: 8,
    include: { category: true },
  })

  return (
    <div className="flex flex-col gap-10">
      <header className="glass-card p-8">
        <div className="relative">
          <h1 className="font-display text-4xl font-black lowercase text-black/95 dark:text-white">
            Search
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-black/70 dark:text-white/70">
            Explore the archive — essays, reviews, analysis, and the occasional list.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </header>

      {query ? (
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-black lowercase text-black/90 dark:text-white">
                Results
              </h2>
              <p className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
                {results.length} match{results.length === 1 ? '' : 'es'} for “{query}”
              </p>
            </div>
            <Link
              href="/tags"
              className="text-sm font-black tracking-wide text-pop-800 hover:underline dark:text-fizz-200"
            >
              Browse tags
            </Link>
          </div>

          {results.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {results.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8">
              <div className="relative text-sm font-semibold text-black/70 dark:text-white/70">
                No matches yet. Try a different keyword — or browse sections.
              </div>
              <div className="relative mt-5 flex flex-wrap gap-2">
                {['retrospectives', 'analysis', 'reviews', 'essays', 'lists'].map((s) => (
                  <Link
                    key={s}
                    href={`/category/${s}`}
                    className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : null}

      <section>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-black lowercase text-black/90 dark:text-white">
            Trending
          </h2>
          <p className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
            The archive’s current gravity wells.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {trending.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </div>
  )
}
