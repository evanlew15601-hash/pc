import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { prisma } from '@/lib/db'
import { publishedWhere } from '@/lib/publication'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const author = await prisma.author.findUnique({ where: { slug: params.slug } })
  if (!author) return {}

  return {
    title: author.name,
    description: author.bio,
  }
}

export default async function AuthorPage({
  params,
}: {
  params: { slug: string }
}) {
  const author = await prisma.author.findUnique({ where: { slug: params.slug } })
  if (!author) notFound()

  const articles = await prisma.article.findMany({
    where: { ...publishedWhere(), authorId: author.id },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: true },
    take: 40,
  })

  return (
    <div className="flex flex-col gap-10">
      <header className="glass-card p-8">
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5">
            {author.avatarUrl ? (
              <div className="h-20 w-20 overflow-hidden rounded-bubble border border-white/35 bg-white/40 shadow-fizz backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                <Image src={author.avatarUrl} alt={author.name} width={160} height={160} />
              </div>
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-bubble bg-gradient-to-b from-fizz-300 to-pop-300 text-xl font-black text-ink-900 shadow-fizz dark:from-pop-500 dark:to-fizz-500 dark:text-white">
                {author.name
                  .split(' ')
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join('')}
              </div>
            )}

            <div>
              <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Writer</div>
              <h1 className="mt-2 font-display text-4xl font-black lowercase text-black/95 dark:text-white">
                {author.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-black/70 dark:text-white/70">
                {author.bio}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {author.websiteUrl ? (
                  <a
                    href={author.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Website
                  </a>
                ) : null}
                {author.twitterUrl ? (
                  <a
                    href={author.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Social
                  </a>
                ) : null}
                <Link
                  href="/about"
                  className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                >
                  About Popcology
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-bubble border border-white/25 bg-white/30 px-5 py-3 text-sm font-black tracking-widest text-black/75 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white/80">
            {articles.length} article{articles.length === 1 ? '' : 's'}
          </div>
        </div>
      </header>

      <section>
        <div className="mb-5">
          <h2 className="font-display text-2xl font-black lowercase text-black/90 dark:text-white">
            Published
          </h2>
          <p className="mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
            Everything currently live.
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
