import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'

export async function ensureUniqueArticleSlug(input: string, excludeId?: string) {
  const base = slugify(input)
  if (!base) return base

  const existing = await prisma.article.findFirst({
    where: excludeId ? { slug: base, id: { not: excludeId } } : { slug: base },
    select: { id: true },
  })

  if (!existing) return base

  for (let i = 2; i < 200; i++) {
    const candidate = `${base}-${i}`
    const taken = await prisma.article.findFirst({
      where: excludeId ? { slug: candidate, id: { not: excludeId } } : { slug: candidate },
      select: { id: true },
    })
    if (!taken) return candidate
  }

  return `${base}-${Date.now()}`
}
