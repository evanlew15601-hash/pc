import Link from 'next/link'

import { prisma } from '@/lib/db'

export default async function AdminDashboard() {
  const [articles, categories, tags, authors, pendingComments, subscribers] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.author.count(),
    prisma.comment.count({ where: { approved: false } }),
    prisma.newsletterSubscriber.count(),
  ])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="glass-card p-8">
        <div className="relative">
          <h1 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">
            Editor dashboard
          </h1>
          <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
            Create and schedule articles, manage categories/tags, approve comments, and keep the magazine
            feeling alive.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ['Articles', articles, '/admin/articles'],
              ['Categories', categories, '/admin/categories'],
              ['Tags', tags, '/admin/tags'],
              ['Authors', authors, '/admin/authors'],
              ['Pending comments', pendingComments, '/admin/comments'],
              ['Newsletter subs', subscribers, '/admin/newsletter'],
            ].map(([label, count, href]) => (
              <Link key={href} href={href} className="glass-card p-5">
                <div className="relative">
                  <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">
                    {label}
                  </div>
                  <div className="mt-2 font-display text-3xl font-black lowercase text-black/95 dark:text-white">
                    {count}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-pop-800 dark:text-fizz-200">
                    Open →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-6">
        <div className="glass-card p-6">
          <h2 className="relative font-display text-xl font-black lowercase text-black/90 dark:text-white">
            Quick actions
          </h2>
          <div className="relative mt-4 flex flex-col gap-2">
            <Link
              href="/admin/articles/new"
              className="rounded-2xl bg-gradient-to-b from-fizz-300 to-pop-300 px-4 py-3 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
            >
              New article
            </Link>
            <Link
              href="/admin/comments"
              className="rounded-2xl border border-white/25 bg-white/30 px-4 py-3 text-sm font-black tracking-wide text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            >
              Moderate comments
            </Link>
            <Link
              href="/admin/articles"
              className="rounded-2xl border border-white/25 bg-white/30 px-4 py-3 text-sm font-black tracking-wide text-black/80 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            >
              Manage articles
            </Link>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="relative font-display text-xl font-black lowercase text-black/90 dark:text-white">
            Scheduling
          </h2>
          <p className="relative mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
            Use <span className="font-black">Status: Scheduled</span> + <span className="font-black">Scheduled for</span>.
            Articles automatically go live once the timestamp passes.
          </p>
        </div>
      </aside>
    </div>
  )
}
