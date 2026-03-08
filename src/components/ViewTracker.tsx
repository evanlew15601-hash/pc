'use client'

import { Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'

export function ViewTracker({ slug, className }: { slug: string; className?: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    const run = async () => {
      await fetch(`/api/views/${encodeURIComponent(slug)}`, { method: 'POST' })
      const res = await fetch(`/api/views/${encodeURIComponent(slug)}`)
      if (!res.ok) return
      const json = (await res.json()) as { views: number }
      if (active) setViews(json.views)
    }

    run()

    return () => {
      active = false
    }
  }, [slug])

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/35 px-3 py-1 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white/75',
        className,
      )}
    >
      <Eye size={14} />
      {views === null ? '—' : views.toLocaleString()} views
    </div>
  )
}
