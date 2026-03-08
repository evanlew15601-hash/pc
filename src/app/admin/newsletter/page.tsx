import { redirect } from 'next/navigation'

import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/format'

export default async function AdminNewsletterPage() {
  const subs = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
  })

  async function remove(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    if (!id) return

    await prisma.newsletterSubscriber.delete({ where: { id } })
    redirect('/admin/newsletter')
  }

  return (
    <div className="glass-card p-8">
      <div className="relative">
        <h1 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">
          Newsletter
        </h1>
        <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
          Local subscriber list (replace with Mailchimp/ConvertKit when ready).
        </p>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-bubble border border-white/30 bg-white/30 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/40 text-xs font-black tracking-widest text-black/65 dark:bg-white/5 dark:text-white/65">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20 dark:divide-white/10">
            {subs.map((s) => (
              <tr key={s.id} className="text-black/80 dark:text-white/80">
                <td className="px-4 py-3 font-semibold">{s.email}</td>
                <td className="px-4 py-3 text-xs font-black tracking-widest">{formatDate(s.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <form>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      formAction={remove}
                      className="rounded-full border border-red-300/60 bg-white/45 px-3 py-2 text-xs font-black tracking-widest text-red-700 shadow-glass backdrop-blur-xl transition hover:bg-white/65 dark:border-red-500/30 dark:bg-white/5 dark:text-red-300 dark:hover:bg-white/10"
                    >
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!subs.length ? (
        <div className="relative mt-6 text-sm font-semibold text-black/70 dark:text-white/70">
          No subscribers yet.
        </div>
      ) : null}
    </div>
  )
}

export const dynamic = 'force-dynamic'
