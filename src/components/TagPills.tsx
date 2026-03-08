import Link from 'next/link'

import { cn } from '@/lib/cn'

type Tag = { name: string; slug: string }

export function TagPills({ tags, className }: { tags: Tag[]; className?: string }) {
  if (!tags.length) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((t) => (
        <Link
          key={t.slug}
          href={`/tag/${t.slug}`}
          className="rounded-full border border-white/25 bg-white/30 px-3 py-1 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
        >
          #{t.slug}
        </Link>
      ))}
    </div>
  )
}
