import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { prisma } from '@/lib/db'
import { publishedWhere } from '@/lib/publication'

type TagParams = Promise<{ slug: string }>

type TagPageProps = {
  params: TagParams
}

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
  const { slug } = await props.params

  return {
    title: `#${slug}`,
  }
}

export default async function TagPage(props: TagPageProps) {
  const { slug } = await props.params

  const tag = await prisma.tag.findUnique({ where: { slug } })
  if (!tag) notFound()

  const articles = await prisma.article.findMany({
    where: {
      ...publishedWhere(),
      tags: { some: { tagId: tag.id } },
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: true },
    take: 30,
  })

  return (
    <div className="flex flex-col gap-8">
      <header className="glass-card p-8">
        <div className="relative">
          <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Topic</div>
          <h1 className="mt-2 font-display text-4xl font-black lowercase text-black/95 dark:text-white">
            #{tag.slug}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-black/70 dark:text-white/70">
            {articles.length} article{articles.length === 1 ? '' : 's'}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  )
}
