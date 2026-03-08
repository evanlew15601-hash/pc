import { redirect } from 'next/navigation'

import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'

export default async function AdminAuthorsPage() {
  const authors = await prisma.author.findMany({ orderBy: { name: 'asc' } })

  async function create(formData: FormData) {
    'use server'

    const name = String(formData.get('name') ?? '').trim()
    const slugRaw = String(formData.get('slug') ?? '').trim()
    const bio = String(formData.get('bio') ?? '').trim()
    const avatarUrl = String(formData.get('avatarUrl') ?? '').trim()
    const websiteUrl = String(formData.get('websiteUrl') ?? '').trim()
    const twitterUrl = String(formData.get('twitterUrl') ?? '').trim()

    if (!name || !bio) return

    const slug = slugify(slugRaw || name)

    await prisma.author.create({
      data: {
        name,
        slug,
        bio,
        avatarUrl: avatarUrl || null,
        websiteUrl: websiteUrl || null,
        twitterUrl: twitterUrl || null,
      },
    })

    redirect('/admin/authors')
  }

  async function update(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    const name = String(formData.get('name') ?? '').trim()
    const slugRaw = String(formData.get('slug') ?? '').trim()
    const bio = String(formData.get('bio') ?? '').trim()
    const avatarUrl = String(formData.get('avatarUrl') ?? '').trim()
    const websiteUrl = String(formData.get('websiteUrl') ?? '').trim()
    const twitterUrl = String(formData.get('twitterUrl') ?? '').trim()

    if (!id || !name || !bio) return

    const slug = slugify(slugRaw || name)

    await prisma.author.update({
      where: { id },
      data: {
        name,
        slug,
        bio,
        avatarUrl: avatarUrl || null,
        websiteUrl: websiteUrl || null,
        twitterUrl: twitterUrl || null,
      },
    })

    redirect('/admin/authors')
  }

  async function remove(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')
    if (!id) return

    await prisma.author.delete({ where: { id } })
    redirect('/admin/authors')
  }

  return (
    <div className="glass-card p-8">
      <div className="relative">
        <h1 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">Authors</h1>
        <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
          Writer profiles. Popcology is currently solo — but the system supports more.
        </p>
      </div>

      <form action={create} className="relative mt-8 grid grid-cols-1 gap-4 rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">New author</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
        </div>

        <textarea
          name="bio"
          required
          placeholder="Bio"
          className="min-h-[110px] rounded-bubble border border-white/35 bg-white/60 px-4 py-3 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            name="websiteUrl"
            placeholder="Website URL (optional)"
            className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
          />
          <input
            name="twitterUrl"
            placeholder="Social URL (optional)"
            className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
          />
        </div>

        <ImageUploadField name="avatarUrl" label="Avatar" />

        <button
          type="submit"
          className="h-11 rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-5 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
        >
          Create
        </button>
      </form>

      <div className="relative mt-8 space-y-4">
        {authors.map((a) => (
          <form
            key={a.id}
            action={update}
            className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <input type="hidden" name="id" value={a.id} />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                name="name"
                defaultValue={a.name}
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              />
              <input
                name="slug"
                defaultValue={a.slug}
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              />
            </div>

            <textarea
              name="bio"
              defaultValue={a.bio}
              className="mt-3 min-h-[110px] w-full rounded-bubble border border-white/35 bg-white/60 px-4 py-3 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                name="websiteUrl"
                defaultValue={a.websiteUrl ?? ''}
                placeholder="Website URL (optional)"
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
              />
              <input
                name="twitterUrl"
                defaultValue={a.twitterUrl ?? ''}
                placeholder="Social URL (optional)"
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
              />
            </div>

            <ImageUploadField name="avatarUrl" label="Avatar" defaultValue={a.avatarUrl} className="mt-3" />

            <div className="mt-4 flex flex-wrap gap-2">
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
          </form>
        ))}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
