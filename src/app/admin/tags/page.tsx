import { redirect } from 'next/navigation'

import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  })

  async function create(formData: FormData) {
    'use server'

    const name = String(formData.get('name') ?? '').trim()
    const slugRaw = String(formData.get('slug') ?? '').trim()
    if (!name) return

    const slug = slugify(slugRaw || name)

    await prisma.tag.create({
      data: { name, slug },
    })

    redirect('/admin/tags')
  }

  async function update(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    const name = String(formData.get('name') ?? '').trim()
    const slugRaw = String(formData.get('slug') ?? '').trim()
    if (!id || !name) return

    const slug = slugify(slugRaw || name)

    await prisma.tag.update({
      where: { id },
      data: { name, slug },
    })

    redirect('/admin/tags')
  }

  async function remove(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    if (!id) return

    await prisma.tag.delete({ where: { id } })
    redirect('/admin/tags')
  }

  return (
    <div className="glass-card p-8">
      <div className="relative">
        <h1 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">Tags</h1>
        <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
          Topics for discovery and archive browsing.
        </p>
      </div>

      <form action={create} className="relative mt-8 grid grid-cols-1 gap-3 rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">New tag</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            name="name"
            required
            placeholder="Name"
            className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
          />
          <input
            name="slug"
            placeholder="slug (optional)"
            className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
          />
          <button
            type="submit"
            className="h-11 rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
          >
            Create
          </button>
        </div>
      </form>

      <div className="relative mt-8 space-y-3">
        {tags.map((t) => (
          <form
            key={t.id}
            action={update}
            className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <input type="hidden" name="id" value={t.id} />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                name="name"
                defaultValue={t.name}
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              />
              <input
                name="slug"
                defaultValue={t.slug}
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="h-11 rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
                >
                  Save
                </button>
                <button
                  formAction={remove}
                  className="h-11 rounded-full border border-red-300/60 bg-white/45 px-5 text-sm font-black tracking-wide text-red-700 shadow-glass backdrop-blur-xl transition hover:bg-white/65 dark:border-red-500/30 dark:bg-white/5 dark:text-red-300 dark:hover:bg-white/10"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs font-semibold text-black/60 dark:text-white/60">
              {t._count.articles} article{t._count.articles === 1 ? '' : 's'}
            </div>
          </form>
        ))}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
