import Link from 'next/link'

import { ArticleCard } from '@/components/ArticleCard'
import { HeroStory } from '@/components/HeroStory'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { prisma } from '@/lib/db'
import { publishedWhere } from '@/lib/publication'

export default async function HomePage() {
  const hero = await prisma.article.findFirst({
    where: { ...publishedWhere(), isHero: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: true },
  })

  const heroFallback =
    hero ??
    (await prisma.article.findFirst({
      where: publishedWhere(),
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: { category: true },
    }))

  const latest = await prisma.article.findMany({
    where: publishedWhere(),
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 8,
    include: { category: true },
  })

  const featuredEssays = await prisma.article.findMany({
    where: { ...publishedWhere(), isFeaturedEssay: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 4,
    include: { category: true },
  })

  const trending = await prisma.article.findMany({
    where: publishedWhere(),
    orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
    take: 5,
    include: { category: true },
  })

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, description: true },
  })

  const categoryRows = await Promise.all(
    categories.map(async (c) => {
      const items = await prisma.article.findMany({
        where: { ...publishedWhere(), categoryId: c.id },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 3,
        include: { category: true },
      })
      return { category: c, items }
    }),
  )

  return (
    <div className="flex flex-col gap-12">
      {heroFallback ? <HeroStory article={heroFallback} /> : null}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-black lowercase text-black/90 dark:text-white">
                Latest Articles
              </h2>
              <p className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
                New reads and fresh takes — formatted like a magazine, not a scroll.
              </p>
            </div>
            <Link
              href="/search"
              className="text-sm font-black tracking-wide text-pop-800 hover:underline dark:text-fizz-200"
            >
              Browse all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {latest.slice(0, 4).map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {latest.slice(4).map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="relative font-display text-xl font-black lowercase text-black/90 dark:text-white">
              Trending
            </h3>
            <p className="relative mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
              Stories getting the most clicks right now.
            </p>

            <ol className="relative mt-5 flex flex-col gap-3">
              {trending.map((a, i) => (
                <li key={a.slug}>
                  <Link
                    href={`/article/${a.slug}`}
                    className="group grid grid-cols-[26px_1fr] gap-3 rounded-2xl border border-white/30 bg-white/35 p-3 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 text-xs font-black text-ink-900 shadow-fizz dark:from-pop-500 dark:to-fizz-500 dark:text-white">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-widest text-black/55 dark:text-white/55">
                        {a.category.name}
                      </div>
                      <div className="mt-1 font-display text-base font-black lowercase leading-tight text-black/90 group-hover:underline dark:text-white">
                        {a.title}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <NewsletterSignup />
        </aside>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-black lowercase text-black/90 dark:text-white">
            Featured Essays
          </h2>
          <p className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
            Long-form Popcology — the deep reads.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {featuredEssays.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="row" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div>
          <h2 className="font-display text-2xl font-black lowercase text-black/90 dark:text-white">
            Category Highlights
          </h2>
          <p className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
            Explore Popcology like an ecosystem: each section has its own vibe.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {categoryRows.map(({ category, items }) => (
            <div key={category.slug} className="glass-card p-6">
              <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Link
                    href={`/category/${category.slug}`}
                    className="font-display text-xl font-black lowercase text-black/90 hover:underline dark:text-white"
                  >
                    {category.name}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
                    {category.description}
                  </p>
                </div>
                <Link
                  href={`/category/${category.slug}`}
                  className="mt-3 text-sm font-black tracking-wide text-pop-800 hover:underline dark:text-fizz-200 sm:mt-0"
                >
                  View section
                </Link>
              </div>

              <div className="relative mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {items.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
