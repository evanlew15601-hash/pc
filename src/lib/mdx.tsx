import * as React from 'react'
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'

export function mdxComponents(): MDXComponents {
  return {
    PullQuote: ({ children }: { children: React.ReactNode }) => (
      <aside className="my-8 rounded-bubble border border-fizz-200/60 bg-white/60 px-6 py-5 text-lg font-semibold leading-snug text-ink-900 shadow-fizz backdrop-blur-xl dark:border-fizz-500/20 dark:bg-ink-950/50 dark:text-white">
        <div className="pointer-events-none absolute" />
        <div className="relative">
          <div className="mb-2 text-xs font-extrabold tracking-[0.2em] text-fizz-700/80 dark:text-fizz-200/80">
            PULL QUOTE
          </div>
          <div className="text-pretty">{children}</div>
        </div>
      </aside>
    ),
    Callout: ({
      title,
      children,
    }: {
      title?: string
      children: React.ReactNode
    }) => (
      <aside className="my-8 rounded-bubble border border-pop-200/60 bg-white/70 px-6 py-5 shadow-glass backdrop-blur-xl dark:border-pop-500/25 dark:bg-ink-950/55">
        {title ? (
          <div className="mb-2 font-display text-sm font-extrabold tracking-wide text-pop-700 dark:text-pop-200">
            {title}
          </div>
        ) : null}
        <div className="prose prose-p:my-3 prose-a:text-pop-700 dark:prose-invert dark:prose-a:text-fizz-200">
          {children}
        </div>
      </aside>
    ),
    InlineImage: ({
      src,
      alt,
      caption,
    }: {
      src: string
      alt: string
      caption?: string
    }) => (
      <figure className="my-8">
        <div className="overflow-hidden rounded-bubble border border-white/40 bg-white/40 shadow-fizz backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={900}
            className="h-auto w-full"
          />
        </div>
        {caption ? (
          <figcaption className="mt-2 text-sm text-black/70 dark:text-white/70">{caption}</figcaption>
        ) : null}
      </figure>
    ),
    VideoEmbed: ({
      youtubeId,
      title,
    }: {
      youtubeId: string
      title?: string
    }) => (
      <div className="my-8 overflow-hidden rounded-bubble border border-white/40 bg-white/40 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="relative aspect-video">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title ?? 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    ),
  }
}
