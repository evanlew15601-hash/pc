import { ArticleStatus } from '@prisma/client'
import { z } from 'zod'

import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'

export const articleSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().min(2),
  slug: z.string().optional(),
  excerpt: z.string().min(10),
  bodyMdx: z.string().min(10),
  heroImageUrl: z
    .string()
    .optional()
    .refine(
      (v) => !v || v === '' || v.startsWith('/') || /^https?:\/\//.test(v),
      'Hero image must be an absolute URL or a /public path like /uploads/file.png',
    ),
  status: z.nativeEnum(ArticleStatus),
  publishedAt: z.string().optional(),
  scheduledFor: z.string().optional(),
  isHero: z.boolean().optional(),
  isFeaturedEssay: z.boolean().optional(),
  categoryId: z.string().min(1),
  authorId: z.string().min(1),
  tags: z.string().optional(),
})

export function normalizeArticleSlug(input: string) {
  return slugify(input)
}

export async function syncTagsForArticle(articleId: string, tagList: string[]) {
  const slugs = Array.from(
    new Set(
      tagList
        .map((t) => slugify(t))
        .filter(Boolean),
    ),
  )

  const tags = await Promise.all(
    slugs.map((slug) =>
      prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { slug, name: slug.replace(/-/g, ' ') },
      }),
    ),
  )

  await prisma.articleTag.deleteMany({ where: { articleId } })
  await prisma.articleTag.createMany({
    data: tags.map((t) => ({ articleId, tagId: t.id })),
    skipDuplicates: true,
  })

  return tags
}

export function parseTagString(tags?: string) {
  if (!tags) return []
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}
