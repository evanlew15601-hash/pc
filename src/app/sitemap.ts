import type { MetadataRoute } from 'next'

import { prisma } from '@/lib/db'
import { publishedWhere } from '@/lib/publication'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://popcology.example'

  const [articles, categories, tags] = await Promise.all([
    prisma.article.findMany({
      where: publishedWhere(),
      select: { slug: true, updatedAt: true },
      take: 5000,
    }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.tag.findMany({ select: { slug: true, updatedAt: true } }),
  ])

  return [
    { url: `${site}/`, lastModified: new Date() },
    { url: `${site}/about`, lastModified: new Date() },
    { url: `${site}/search`, lastModified: new Date() },
    { url: `${site}/tags`, lastModified: new Date() },
    ...categories.map((c) => ({
      url: `${site}/category/${c.slug}`,
      lastModified: c.updatedAt,
    })),
    ...tags.map((t) => ({
      url: `${site}/tag/${t.slug}`,
      lastModified: t.updatedAt,
    })),
    ...articles.map((a) => ({
      url: `${site}/article/${a.slug}`,
      lastModified: a.updatedAt,
    })),
  ]
}
