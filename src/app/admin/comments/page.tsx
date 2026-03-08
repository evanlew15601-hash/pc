import Link from 'next/link'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/format'

export default async function AdminCommentsPage() {
  const pending = await prisma.comment.findMany({
    where: { approved: false },
    orderBy: { createdAt: 'desc' },
    include: { article: { select: { slug: true, title: true } } },
    take: 200,
  })

  const approved = await prisma.comment.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    include: { article: { select: { slug: true, title: true } } },
    take: 50,
  })

  async function approve(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    if (!id) return

    await prisma.comment.update({ where: { id }, data: { approved: true } })
    redirect('/admin/comments')
  }

  async function remove(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    if (!id) return

    await prisma.comment.delete({ where: { id } })
    redirect('/admin/comments')
  }

  const Card = ({
    id,
    name,
    body,
    createdAt,
    article,
    mode,
  }: {
    id: string
    name: string
    body: string
    createdAt: Date
    article: { slug: string; title: string }
    mode: 'pending' | 'approved'
  }) => (
    <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">
            {name} · {formatDate(createdAt)}
          </div>
          <div className="mt-1 text-sm font-semibold text-black/80 dark:text-white/80">{body}</div>
          <Link
            href={`/article/${article.slug}`}
            className="mt-3 inline-flex text-xs font-black tracking-widest text-pop-800 hover:underline dark:text-fizz-200"
          >
            {article.title} →
          </Link>
        </div>

        <form className="flex flex-wrap gap-2">
          <input type="hidden" name="id" value={id} />
          {mode === 'pending' ? (
            <button
              formAction={approve}
              className="h-10 rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-4 text-xs font-black tracking-widest text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
            >
              Approve
            </button>
          ) : null}
          <button
            formAction={remove}
            className="h-10 rounded-full border border-red-300/60 bg-white/45 px-4 text-xs font-black tracking-widest text-red-700 shadow-glass backdrop-blur-xl transition hover:bg-white/65 dark:border-red-500/30 dark:bg-white/5 dark:text-red-300 dark:hover:bg-white/10"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="glass-card p-8">
        <div className="relative">
          <h1 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">
            Pending
          </h1>
          <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
            Approve thoughtful comments. Delete the rest.
          </p>
        </div>

        <div className="relative mt-6 space-y-3">
          {pending.length ? (
            pending.map((c) => (
              <Card
                key={c.id}
                id={c.id}
                name={c.name}
                body={c.body}
                createdAt={c.createdAt}
                article={c.article}
                mode="pending"
              />
            ))
          ) : (
            <div className="rounded-bubble border border-white/25 bg-white/30 p-6 text-sm font-semibold text-black/70 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              No pending comments.
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-8">
        <div className="relative">
          <h2 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">
            Approved
          </h2>
          <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
            Recently approved comments.
          </p>
        </div>

        <div className="relative mt-6 space-y-3">
          {approved.length ? (
            approved.map((c) => (
              <Card
                key={c.id}
                id={c.id}
                name={c.name}
                body={c.body}
                createdAt={c.createdAt}
                article={c.article}
                mode="approved"
              />
            ))
          ) : (
            <div className="rounded-bubble border border-white/25 bg-white/30 p-6 text-sm font-semibold text-black/70 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              Nothing approved yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
