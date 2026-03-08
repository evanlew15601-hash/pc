import Link from 'next/link'

import { prisma } from '@/lib/db'

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: [{ createdAt: 'desc' }],
    include: { category: true, author: true },
    take: 200,
  })

  return (
    <div className="glass-card p-8">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">
            Articles
          </h1>
          <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
            Drafts, scheduled posts, and published stories.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
        >
          New article
        </Link>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-bubble border border-white/30 bg-white/30 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/40 text-xs font-black tracking-widest text-black/65 dark:bg-white/5 dark:text-white/65">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20 dark:divide-white/10">
            {articles.map((a) => (
              <tr key={a.id} className="text-black/80 dark:text-white/80">
                <td className="px-4 py-3">
                  <div className="font-display text-base font-black lowercase text-black/95 dark:text-white">
                    {a.title}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-black/60 dark:text-white/60">
                    {a.slug} · {a.author.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-black tracking-widest">{a.status}</td>
                <td className="px-4 py-3 text-xs font-black tracking-widest">{a.category.name}</td>
                <td className="px-4 py-3 text-xs font-black tracking-widest">{a.views.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs font-black tracking-widest">
                  {a.isHero ? 'HERO ' : ''}
                  {a.isFeaturedEssay ? 'ESSAY' : ''}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="rounded-full border border-white/25 bg-white/30 px-3 py-2 text-xs font-black tracking-widest text-black/75 shadow-glass backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
