import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

type ViewParams = Promise<{ slug: string }>

type ViewContext = {
  params: ViewParams
}

export async function POST(_req: Request, context: ViewContext) {
  const { slug } = await context.params

  const updated = await prisma.article.updateMany({
    where: { slug },
    data: { views: { increment: 1 } },
  })

  if (updated.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { views: true },
  })

  return NextResponse.json({ views: article?.views ?? 0 })
}

export async function GET(_req: Request, context: ViewContext) {
  const { slug } = await context.params

  const article = await prisma.article.findUnique({
    where: { slug },
    select: { views: true },
  })

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ views: article.views })
}
