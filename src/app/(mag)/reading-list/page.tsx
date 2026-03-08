'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Entry = {
  slug: string
  title: string
  savedAt: number
}

const KEY = 'popcology.readingList.v1'

export default function ReadingListPage() {
  const [list, setList] = useState<Entry[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      setList(raw ? (JSON.parse(raw) as Entry[]) : [])
    } catch {
      setList([])
    }
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <header className="glass-card p-8">
        <div className="relative">
          <h1 className="font-display text-4xl font-black lowercase text-black/95 dark:text-white">
            Reading list
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-black/70 dark:text-white/70">
            Saved on this device. Built for long-form Popcology nights.
          </p>
        </div>
      </header>

      {list.length ? (
        <div className="space-y-3">
          {list
            .slice()
            .sort((a, b) => b.savedAt - a.savedAt)
            .map((e) => (
              <Link
                key={e.slug}
                href={`/article/${e.slug}`}
                className="glass-card block p-5"
              >
                <div className="relative">
                  <div className="font-display text-xl font-black lowercase text-black/90 dark:text-white">
                    {e.title}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-pop-800 dark:text-fizz-200">Read →</div>
                </div>
              </Link>
            ))}
        </div>
      ) : (
        <div className="glass-card p-8">
          <div className="relative text-sm font-semibold text-black/70 dark:text-white/70">
            Nothing saved yet. Open an article and hit “Save”.
          </div>
        </div>
      )}
    </div>
  )
}
