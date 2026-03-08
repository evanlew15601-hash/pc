import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

import { ArticleCard } from '@/components/ArticleCard'
import { ReadingListButton } from '@/components/ReadingListButton'
import { ShareBar } from '@/components/ShareBar'
import { TagPills } from '@/components/TagPills'
import { ViewTracker } from '@/components/ViewTracker'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/format'
import { mdxComponents } from '@/lib/mdx'
import { publishedWhere } from '@/lib/publication'
import { getReadingTimeMinutes } from '@/lib/readingTime'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params

  const article = await prisma.article.findFirst({
    where: { ...publishedWhere(), slug },
    include: { category: true },
  })

  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.heroImageUrl ? [{ url: article.heroImageUrl }] : undefined,
      type: 'article',
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  const article = await prisma.article.findFirst({
    where: { ...publishedWhere(), slug },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 30,
      },
    },
  })

  if (!article) notFound()

  const related = await prisma.article.findMany({
    where: { ...publishedWhere(), categoryId: article.categoryId, slug: { not: article.slug } },
    orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
    take: 4,
    include: { category: true },
  })

  const readingMinutes = getReadingTimeMinutes(article.bodyMdx)
  const tags = article.tags.map((t) => t.tag)

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://popcology.example'
  const articleUrl = `${site}/article/${article.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: `${site}/author/${article.author.slug}`,
    },
    articleSection: article.category.name,
    keywords: tags.map((t) => t.slug).join(', '),
    image: article.heroImageUrl ? [article.heroImageUrl.startsWith('/') ? `${site}${article.heroImageUrl}` : article.heroImageUrl] : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  }

  return (
    <article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="relative overflow-hidden rounded-bubble border border-white/35 bg-white/50 shadow-fizz backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-fizz-400/40 to-pop-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-pop-500/35 to-fizz-400/10 blur-3xl" />
        </div>

        <div className="relative grid grid-cols-1 gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[320px]">
            {article.heroImageUrl ? (
              <Image
                src={article.heroImageUrl}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-fizz-300/60 via-pop-300/30 to-white/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />

            <div className="absolute left-6 top-6 flex flex-wrap items-center gap-2">
              <Link
                href={`/category/${article.category.slug}`}
                className="rounded-full border border-white/40 bg-white/35 px-4 py-2 text-xs font-black tracking-widest text-black/85 backdrop-blur-xl transition hover:bg-white/55 dark:border-white/10 dark:bg-ink-950/30 dark:text-white/90 dark:hover:bg-white/10"
              >
                {article.category.name}
              </Link>
              <ViewTracker slug={article.slug} />
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <div className="text-xs font-bold tracking-widest text-black/60 dark:text-white/60">
              {article.publishedAt ? formatDate(article.publishedAt) : null} · {readingMinutes} min read
            </div>

            <h1 className="mt-3 font-display text-4xl font-black lowercase leading-[0.95] text-black/95 dark:text-white">
              {article.title}
            </h1>
            <div className="mt-3 text-base font-semibold text-black/75 dark:text-white/75">
              {article.subtitle}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/author/${article.author.slug}`}
                className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/40 px-4 py-2 shadow-glass backdrop-blur-xl transition hover:bg-white/65 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 text-xs font-black text-ink-900 shadow-fizz dark:from-pop-500 dark:to-fizz-500 dark:text-white">
                  {article.author.name
                    .split(' ')
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join('')}
                </span>
                <span className="text-sm font-black tracking-wide text-black/85 dark:text-white">
                  {article.author.name}
                </span>
              </Link>

              <ReadingListButton slug={article.slug} title={article.title} />
            </div>

            <TagPills tags={tags} className="mt-6" />

            <ShareBar title={article.title} className="mt-6" />
          </div>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="glass-card p-6 sm:p-8">
            <div className="relative prose-pop">
              <MDXRemote
                source={article.bodyMdx}
                components={mdxComponents()}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                  },
                }}
              />
            </div>
          </div>

          <section className="mt-10 glass-card p-6 sm:p-8">
            <h2 className="relative font-display text-2xl font-black lowercase text-black/90 dark:text-white">
              Comments
            </h2>
            <p className="relative mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
              Popcology is editorial-first. Comments are moderated.
            </p>

            <form
              action="/api/comments"
              method="post"
              className="relative mt-6 grid grid-cols-1 gap-3"
            >
              <input type="hidden" name="slug" value={article.slug} />
              <input
                name="name"
                required
                placeholder="Name"
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
              />
              <textarea
                name="body"
                required
                placeholder="Write a thoughtful comment…"
                className="min-h-[120px] rounded-bubble border border-white/35 bg-white/60 px-4 py-3 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
              />
              <button
                type="submit"
                className="h-11 justify-self-start rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
              >
                Submit for review
              </button>
            </form>

            {article.comments.length ? (
              <div className="relative mt-8 space-y-4">
                {article.comments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-bubble border border-white/30 bg-white/35 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">
                      {c.name} · {formatDate(c.createdAt)}
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-black/75 dark:text-white/75">
                      {c.body}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative mt-8 text-sm font-semibold text-black/65 dark:text-white/65">
                No approved comments yet.
              </div>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="relative font-display text-xl font-black lowercase text-black/90 dark:text-white">
              Related
            </h3>
            <p className="relative mt-1 text-sm font-semibold text-black/65 dark:text-white/65">
              More from {article.category.name}.
            </p>
            <div className="relative mt-5 flex flex-col gap-4">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="row" />
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="relative font-display text-xl font-black lowercase text-black/90 dark:text-white">
              Explore
            </h3>
            <div className="relative mt-4 flex flex-col gap-2 text-sm font-semibold">
              <Link
                href={`/category/${article.category.slug}`}
                className="rounded-2xl border border-white/25 bg-white/30 px-4 py-3 text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                More {article.category.name}
              </Link>
              <Link
                href={`/author/${article.author.slug}`}
                className="rounded-2xl border border-white/25 bg-white/30 px-4 py-3 text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                More by {article.author.name}
              </Link>
              <Link
                href="/tags"
                className="rounded-2xl border border-white/25 bg-white/30 px-4 py-3 text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                Browse tags
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}
