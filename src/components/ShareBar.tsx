'use client'

import { Copy, Link2, Send } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/cn'

export function ShareBar({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  const [href, setHref] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setHref(window.location.href)
  }, [])

  const tweet = useMemo(() => {
    if (!href) return '#'
    const text = `${title} — popcology`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(href)}`
  }, [href, title])

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <a
        href={tweet}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-4 py-2 text-xs font-black tracking-widest text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
      >
        <Send size={14} />
        Share
      </a>

      <button
        type="button"
        onClick={async () => {
          if (!href) return
          await navigator.clipboard.writeText(href)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1100)
        }}
        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/35 px-4 py-2 text-xs font-black tracking-widest text-black/75 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
      >
        {copied ? <Copy size={14} /> : <Link2 size={14} />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
