import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const form = await req.formData()

  const slug = String(form.get('slug') ?? '').trim()
  const name = String(form.get('name') ?? '').trim()
  const body = String(form.get('body') ?? '').trim()

  if (!slug || !name || !body) {
    return NextResponse.redirect(new URL(`/article/${encodeURIComponent(slug)}`, req.url))
  }

  const article = await prisma.article.findUnique({ where: { slug }, select: { id: true } })
  if (!article) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  await prisma.comment.create({
    data: {
      articleId: article.id,
      name: name.slice(0, 64),
      body: body.slice(0, 2000),
    },
  })

  const url = new URL(`/article/${encodeURIComponent(slug)}`, req.url)
  url.searchParams.set('comment', 'submitted')
  return NextResponse.redirect(url)
}
