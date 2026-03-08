'use client'

import { useRef, useState } from 'react'

import { cn } from '@/lib/cn'

export function ImageUploadField({
  name,
  defaultValue,
  label,
  className,
}: {
  name: string
  defaultValue?: string | null
  label: string
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [url, setUrl] = useState<string>(defaultValue ?? '')
  const [uploading, setUploading] = useState(false)

  return (
    <div
      className={cn(
        'rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5',
        className,
      )}
    >
      <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">{label}</div>
      <div className="mt-3 grid grid-cols-1 gap-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          name={name}
          placeholder="Paste an image URL or upload…"
          className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
        />

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async () => {
              const file = inputRef.current?.files?.[0]
              if (!file) return

              const form = new FormData()
              form.set('file', file)

              setUploading(true)
              const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
              setUploading(false)

              if (!res.ok) return
              const json = (await res.json()) as { url: string }
              setUrl(json.url)
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-4 py-2 text-xs font-black tracking-widest text-ink-900 shadow-fizz transition hover:brightness-110 disabled:opacity-60 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <button
            type="button"
            onClick={() => setUrl('')}
            className="rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            Clear
          </button>
        </div>

        {url ? (
          <div className="overflow-hidden rounded-bubble border border-white/25 bg-white/30 shadow-glass dark:border-white/10 dark:bg-white/5">
            <div className="relative aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
