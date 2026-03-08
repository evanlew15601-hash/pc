import { ArticleStatus } from '@prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { prisma } from '@/lib/db'
import { parseTagString, articleSchema } from '@/lib/admin/article'
import { ensureUniqueArticleSlug } from '@/lib/admin/uniqueSlug'

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.author.findMany({ orderBy: { name: 'asc' } }),
  ])

  async function createArticle(formData: FormData) {
    'use server'

    const raw = {
      title: String(formData.get('title') ?? ''),
      subtitle: String(formData.get('subtitle') ?? ''),
      slug: String(formData.get('slug') ?? ''),
      excerpt: String(formData.get('excerpt') ?? ''),
      bodyMdx: String(formData.get('bodyMdx') ?? ''),
      heroImageUrl: String(formData.get('heroImageUrl') ?? ''),
      status: String(formData.get('status') ?? ArticleStatus.DRAFT) as ArticleStatus,
      publishedAt: String(formData.get('publishedAt') ?? ''),
      scheduledFor: String(formData.get('scheduledFor') ?? ''),
      isHero: Boolean(formData.get('isHero')),
      isFeaturedEssay: Boolean(formData.get('isFeaturedEssay')),
      categoryId: String(formData.get('categoryId') ?? ''),
      authorId: String(formData.get('authorId') ?? ''),
      tags: String(formData.get('tags') ?? ''),
    }

    const parsed = articleSchema.safeParse(raw)
    if (!parsed.success) {
      return
    }

    const slug = await ensureUniqueArticleSlug(parsed.data.slug || parsed.data.title)

    const publishedAt =
      parsed.data.status === ArticleStatus.PUBLISHED
        ? parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : new Date()
        : null

    const scheduledFor =
      parsed.data.status === ArticleStatus.SCHEDULED && parsed.data.scheduledFor
        ? new Date(parsed.data.scheduledFor)
        : null

    const article = await prisma.article.create({
      data: {
        title: parsed.data.title,
        subtitle: parsed.data.subtitle,
        slug,
        excerpt: parsed.data.excerpt,
        bodyMdx: parsed.data.bodyMdx,
        heroImageUrl: parsed.data.heroImageUrl || null,
        status: parsed.data.status,
        publishedAt,
        scheduledFor,
        isHero: Boolean(parsed.data.isHero),
        isFeaturedEssay: Boolean(parsed.data.isFeaturedEssay),
        categoryId: parsed.data.categoryId,
        authorId: parsed.data.authorId,
      },
    })

    const tags = parseTagString(parsed.data.tags)
    if (tags.length) {
      const { syncTagsForArticle } = await import('@/lib/admin/article')
      await syncTagsForArticle(article.id, tags)
    }

    redirect(`/admin/articles/${article.id}/edit`)
  }

  return (
    <div className="glass-card p-8">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black lowercase text-black/95 dark:text-white">
            New article
          </h1>
          <p className="mt-2 text-sm font-semibold text-black/70 dark:text-white/70">
            Write in MDX. Use <span className="font-black">&lt;PullQuote&gt;</span>, <span className="font-black">&lt;InlineImage /&gt;</span>, and <span className="font-black">&lt;VideoEmbed /&gt;</span> inside the body.
          </p>
        </div>
        <Link
          href="/admin/articles"
          className="text-sm font-black tracking-wide text-pop-800 hover:underline dark:text-fizz-200"
        >
          Back to articles
        </Link>
      </div>

      <form action={createArticle} className="relative mt-8 grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Title</div>
            <input
              name="title"
              required
              className="mt-3 h-11 w-full rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
            />
          </div>
          <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Subtitle</div>
            <input
              name="subtitle"
              required
              className="mt-3 h-11 w-full rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:col-span-1">
            <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Slug</div>
            <input
              name="slug"
              placeholder="auto-from-title-if-empty"
              className="mt-3 h-11 w-full rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
            />
            <div className="mt-2 text-xs font-semibold text-black/55 dark:text-white/55">
              Used in the URL: /article/slug
            </div>
          </div>

          <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Category</div>
            <select
              name="categoryId"
              required
              className="mt-3 h-11 w-full rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              defaultValue={categories[0]?.id}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Author</div>
            <select
              name="authorId"
              required
              className="mt-3 h-11 w-full rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              defaultValue={authors[0]?.id}
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ImageUploadField name="heroImageUrl" label="Hero image" />

        <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Excerpt</div>
          <textarea
            name="excerpt"
            required
            className="mt-3 min-h-[120px] w-full rounded-bubble border border-white/35 bg-white/60 px-4 py-3 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
          />
        </div>

        <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Body (MDX)</div>
              <div className="mt-1 text-xs font-semibold text-black/55 dark:text-white/55">
                Tip: Keep paragraphs short; use pull quotes to give the page air.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <input type="checkbox" name="isHero" className="h-4 w-4" /> Hero
              </label>
              <label className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/30 px-4 py-2 text-xs font-black tracking-widest text-black/70 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <input type="checkbox" name="isFeaturedEssay" className="h-4 w-4" /> Featured essay
              </label>
            </div>
          </div>
          <textarea
            name="bodyMdx"
            required
            className="mt-4 min-h-[420px] w-full rounded-bubble border border-white/35 bg-white/60 px-4 py-3 font-mono text-sm text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Tags</div>
            <input
              name="tags"
              placeholder="comma, separated, tags"
              className="mt-3 h-11 w-full rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 placeholder:text-black/40 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35"
            />
          </div>

          <div className="rounded-bubble border border-white/25 bg-white/30 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-black tracking-widest text-black/60 dark:text-white/60">Publishing</div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                name="status"
                defaultValue={ArticleStatus.DRAFT}
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              >
                <option value={ArticleStatus.DRAFT}>Draft</option>
                <option value={ArticleStatus.SCHEDULED}>Scheduled</option>
                <option value={ArticleStatus.PUBLISHED}>Published</option>
              </select>
              <input
                name="publishedAt"
                type="datetime-local"
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85"
              />
              <input
                name="scheduledFor"
                type="datetime-local"
                className="h-11 rounded-full border border-white/35 bg-white/60 px-4 text-sm font-semibold text-black/85 shadow-inner focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/85 sm:col-span-2"
              />
            </div>
            <div className="mt-2 text-xs font-semibold text-black/55 dark:text-white/55">
              For scheduled posts, fill “Scheduled for”. For published posts, “Published at” is optional.
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="h-12 rounded-full bg-gradient-to-b from-fizz-300 to-pop-300 px-6 text-sm font-black tracking-wide text-ink-900 shadow-fizz transition hover:brightness-110 dark:from-pop-500 dark:to-fizz-500 dark:text-white"
        >
          Create article
        </button>
      </form>
    </div>
  )
}
