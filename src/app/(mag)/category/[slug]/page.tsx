import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { HeroStory } from '@/components/HeroStory'
import { prisma } from '@/lib/db'
import { publishedWhere } from '@/lib/publication'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return {}

  return {
    title: category.name,
    description: category.description,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) notFound()

  const featured = await prisma.article.findFirst({
    where: { ...publishedWhere(), categoryId: category.id },
    orderBy: [{ publishedAt: 'desc' }, { views: 'desc' }],
    include: { category: true },
  })

  const articles = await prisma.article.findMany({
    where: { ...publishedWhere(), categoryId: category.id },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 20,
    include: { category: true },
  })

  return (
    <div className="flex flex-col gap-10">
      <header className="glass-card p-8">
        <div className="relative">
          <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">
            Section
          </div>
          <h1 className="mt-2 font-display text-4xl font-black lowercase text-black/95 dark:text-white">
            {category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-black/70 dark:text-white/70">
            {category.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            >
              Browse
            </Link>
          </div>
        </div>
      </header>

      {featured ? <HeroStory article={featured} /> : null}

      <section>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-black lowercase text-black/90 dark:text-white">
            Latest in {category.name}
          </h2>
          <p className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
            Fresh takes, close reads, and Popcology-level overthinking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </div>
  )
}
