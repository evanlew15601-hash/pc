import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="glass-card p-10">
      <div className="relative">
        <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">404</div>
        <h1 className="mt-3 font-display text-5xl font-black lowercase text-black/95 dark:text-white">
          Page not found
        </h1>
        <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-black/70 dark:text-white/70">
          This page doesn’t exist in the Popcology ecosystem. Try the homepage, search, or a category
          landing.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 py-3 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-white/30 bg-white/40 px-5 py-3 text-sm font-black tracking-wide text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/65 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            Search
          </Link>
        </div>
      </div>
    </div>
  )
}
