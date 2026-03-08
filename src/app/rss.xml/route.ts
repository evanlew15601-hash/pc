import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { publishedWhere } from '@/lib/publication'

function escapeXml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://popcology.example'

  const articles = await prisma.article.findMany({
    where: publishedWhere(),
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 30,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
    },
  })

  const items = articles
    .map((a) => {
      const link = `${site}/article/${a.slug}`
      const date = (a.publishedAt ?? new Date()).toUTCString()
      return `\n    <item>\n      <title>${escapeXml(a.title)}</title>\n      <link>${escapeXml(link)}</link>\n      <guid>${escapeXml(link)}</guid>\n      <pubDate>${escapeXml(date)}</pubDate>\n      <description>${escapeXml(a.excerpt)}</description>\n    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>popcology</title>
    <link>${site}</link>
    <description>Pop culture analysis worth studying.</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
