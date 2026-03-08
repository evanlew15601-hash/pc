import { ArticleStatus, type Article } from '@prisma/client'

export function isArticleVisible(a: Pick<Article, 'status' | 'publishedAt' | 'scheduledFor'>) {
  const now = new Date()

  if (a.status === ArticleStatus.PUBLISHED) return true
  if (a.status === ArticleStatus.SCHEDULED) {
    if (!a.scheduledFor) return false
    return a.scheduledFor <= now
  }

  return false
}

export function publishedWhere() {
  const now = new Date()

  return {
    OR: [
      { status: ArticleStatus.PUBLISHED },
      { status: ArticleStatus.SCHEDULED, scheduledFor: { lte: now } },
    ],
  } as const
}
