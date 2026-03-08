import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import { clampText, formatDate } from '@/lib/format'

type CardArticle = {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  heroImageUrl: string | null
  publishedAt: Date | null
  category: { name: string; slug: string }
}

export function ArticleCard({
  article,
  variant = 'grid',
  className,
}: {
  article: CardArticle
  variant?: 'grid' | 'row'
  className?: string
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-bubble border border-white/35 bg-white/45 shadow-glass backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-fizz dark:border-white/10 dark:bg-white/5',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-fizz-300/40 to-pop-300/10 blur-2xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-pop-400/30 to-fizz-400/10 blur-2xl" />
      </div>

      <div className={cn('relative', variant === 'row' ? 'grid grid-cols-1 gap-0 sm:grid-cols-[220px_1fr]' : '')}>
        <div className={cn('relative', variant === 'row' ? 'h-48 sm:h-full' : 'h-48')}>
          {article.heroImageUrl ? (
            <Image
              src={article.heroImageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-fizz-300/60 via-pop-300/40 to-white/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
          <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-white/35 px-3 py-1 text-[11px] font-black tracking-widest text-black/80 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/30 dark:text-white/85">
            {article.category.name}
          </div>
        </div>

        <div className="relative p-5">
          <div className="text-xs font-bold tracking-widest text-black/60 dark:text-white/60">
            {article.publishedAt ? formatDate(article.publishedAt) : 'Draft'}
          </div>
          <h3 className="mt-2 font-display text-xl font-black lowercase leading-tight text-black/90 dark:text-white">
            {article.title}
          </h3>
          <div className="mt-1 text-sm font-semibold text-black/70 dark:text-white/70">
            {article.subtitle}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
            {clampText(article.excerpt, 160)}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-black tracking-widest text-pop-800 dark:text-fizz-200">
            Read <span className="transition group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
