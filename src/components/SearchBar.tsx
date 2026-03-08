'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/cn'

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter()
  const params = useSearchParams()

  const initial = useMemo(() => params.get('q') ?? '', [params])
  const [q, setQ] = useState(initial)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const next = q.trim()
        router.push(next ? `/search?q=${encodeURIComponent(next)}` : '/search')
      }}
      className={cn(
        'relative flex h-11 items-center gap-2 rounded-full border border-white/35 bg-white/45 px-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5',
        className,
      )}
    >
      <Search className="text-black/60 dark:text-white/70" size={18} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the archive…"
        className="h-full w-full bg-transparent text-sm font-semibold text-black/85 placeholder:text-black/45 focus:outline-none dark:text-white/85 dark:placeholder:text-white/40"
      />
      <button
        type="submit"
        className="rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-3 py-1 text-xs font-black tracking-wide text-ink-900 shadow-[0_10px_20px_rgba(255,31,240,0.20)] transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
      >
        GO
      </button>
    </form>
  )
}
