import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/format'

type HeroArticle = {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  heroImageUrl: string | null
  publishedAt: Date | null
  category: { name: string; slug: string }
}

export function HeroStory({ article }: { article: HeroArticle }) {
  return (
    <section className="relative overflow-hidden rounded-bubble border border-white/35 bg-white/50 shadow-fizz backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-fizz-400/40 to-pop-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-pop-500/35 to-fizz-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <div className="relative grid grid-cols-1 gap-0 lg:grid-cols-[1.2fr_0.8fr]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/0" />
          <div className="absolute left-6 top-6 inline-flex rounded-full border border-white/40 bg-white/35 px-4 py-2 text-xs font-black tracking-widest text-black/85 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/30 dark:text-white/90">
            HERO STORY · {article.category.name}
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="text-xs font-bold tracking-widest text-black/60 dark:text-white/60">
            {article.publishedAt ? formatDate(article.publishedAt) : null}
          </div>
          <h1 className="mt-2 font-display text-4xl font-black lowercase leading-[0.95] text-black/95 dark:text-white">
            {article.title}
          </h1>
          <div className="mt-3 text-base font-semibold text-black/75 dark:text-white/75">
            {article.subtitle}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-black/70 dark:text-white/70">
            {article.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/article/${article.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 py-3 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
            >
              Read now
            </Link>
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/45 px-5 py-3 text-sm font-black tracking-wide text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/65 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            >
              Explore {article.category.name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
