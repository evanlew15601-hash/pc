import { redirect } from 'next/navigation'

import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  async function create(formData: FormData) {
    'use server'

    const name = String(formData.get('name') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const slugRaw = String(formData.get('slug') ?? '').trim()

    if (!name || !description) return

    const slug = slugify(slugRaw || name)

    await prisma.category.create({
      data: { name, description, slug },
    })

    redirect('/admin/categories')
  }

  async function update(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    const name = String(formData.get('name') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const slugRaw = String(formData.get('slug') ?? '').trim()

    if (!id || !name || !description) return

    const slug = slugify(slugRaw || name)

    await prisma.category.update({
      where: { id },
      data: { name, description, slug },
    })

    redirect('/admin/categories')
  }

  async function remove(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    if (!id) return

    await prisma.category.delete({ where: { id } })
    redirect('/admin/categories')
  }

  return (
    <div className="glass-card p-8">
      <div className="relative">
        <h1 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">
          Categories
        </h1>
        <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
          Magazine sections with landing pages.
        </p>
      </div>

      <form action={create} className="relative mt-8 grid grid-cols-1 gap-3 rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">New category</div>
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
        <textarea
          name="description"
          required
          placeholder="Description"
          className="min-h-[90px] rounded-bubble border border-white/35 bg-white/60 px-4 py-3 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
        />
      </form>

      <div className="relative mt-8 space-y-4">
        {categories.map((c) => (
          <form
            key={c.id}
            action={update}
            className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <input type="hidden" name="id" value={c.id} />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
                <input
                  name="name"
                  defaultValue={c.name}
                  className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
                />
                <input
                  name="slug"
                  defaultValue={c.slug}
                  className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="h-11 flex-1 rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
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
            </div>
            <textarea
              name="description"
              defaultValue={c.description}
              className="mt-3 min-h-[90px] w-full rounded-bubble border border-white/35 bg-white/60 px-4 py-3 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
            />
          </form>
        ))}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
