'use client'

import { Bookmark } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/cn'

type Entry = {
  slug: string
  title: string
  savedAt: number
}

const KEY = 'popcology.readingList.v1'

function load(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Entry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(list: Entry[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function ReadingListButton({
  slug,
  title,
  className,
}: {
  slug: string
  title: string
  className?: string
}) {
  const [ready, setReady] = useState(false)
  const [list, setList] = useState<Entry[]>([])

  useEffect(() => {
    setList(load())
    setReady(true)
  }, [])

  const saved = useMemo(() => list.some((e) => e.slug === slug), [list, slug])

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => {
        const next = saved ? list.filter((e) => e.slug !== slug) : [{ slug, title, savedAt: Date.now() }, ...list]
        setList(next)
        save(next)
      }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/35 px-4 py-2 text-xs font-black tracking-widest text-black/75 shadow-glass backdrop-blur-xl transition hover:bg-white/60 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10',
        saved &&
          'border-fizz-300/70 bg-gradient-to-b from-fizz-200/70 to-pop-200/40 text-ink-900 dark:border-fizz-500/30 dark:from-pop-500/25 dark:to-fizz-500/10 dark:text-white',
        className,
      )}
    >
      <Bookmark size={14} />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
