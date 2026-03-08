import { PrismaClient, ArticleStatus } from '@prisma/client'

const prisma = new PrismaClient()

function mdx(strings: TemplateStringsArray) {
  return strings.join('')
}

async function main() {
  const evan = await prisma.author.upsert({
    where: { slug: 'evan-lewis' },
    update: {
      name: 'Evan Lewis',
      bio: 'Evan Lewis writes Popcology — smart pop culture analysis with a fizzy Y2K heart. Film, music, internet culture, and the psychology of fandom.',
      websiteUrl: 'https://example.com',
      twitterUrl: 'https://x.com/',
    },
    create: {
      slug: 'evan-lewis',
      name: 'Evan Lewis',
      bio: 'Evan Lewis writes Popcology — smart pop culture analysis with a fizzy Y2K heart. Film, music, internet culture, and the psychology of fandom.',
      avatarUrl: null,
      websiteUrl: 'https://example.com',
      twitterUrl: 'https://x.com/',
    },
  })

  const categories = [
    {
      name: 'Retrospectives',
      slug: 'retrospectives',
      description: 'Rewatching, replaying, and re-reading: what old pop culture still teaches us now.',
    },
    {
      name: 'Analysis',
      slug: 'analysis',
      description: 'Close reads on the psychology, aesthetics, and cultural impact of pop culture.',
    },
    {
      name: 'Reviews',
      slug: 'reviews',
      description: 'New releases, old releases, and the question: does it actually work?',
    },
    {
      name: 'Essays',
      slug: 'essays',
      description: 'Long-form writing where pop culture becomes a lens, not just an object.',
    },
    {
      name: 'Lists',
      slug: 'lists',
      description: 'Rankings and curated guides — with receipts.',
    },
  ]

  const categoryRecords = await Promise.all(
    categories.map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: { name: c.name, description: c.description },
        create: c,
      }),
    ),
  )

  const tags = [
    'nostalgia',
    'fandom',
    'y2k',
    'teen-movies',
    'tv-history',
    'music-tech',
    'internet-culture',
    'franchises',
  ]

  const tagRecords = await Promise.all(
    tags.map((t) =>
      prisma.tag.upsert({
        where: { slug: t },
        update: { name: t.replace(/-/g, ' ') },
        create: { slug: t, name: t.replace(/-/g, ' ') },
      }),
    ),
  )

  const bySlug = <T extends { slug: string }>(arr: T[]) => Object.fromEntries(arr.map((a) => [a.slug, a]))
  const cats = bySlug(categoryRecords)
  const t = bySlug(tagRecords)

  const base = {
    authorId: evan.id,
    status: ArticleStatus.PUBLISHED,
    publishedAt: new Date('2025-01-15T16:00:00.000Z'),
  } as const

  const articles = [
    {
      title: 'Why Mean Girls Still Defines Teen Movies',
      subtitle: 'The candy-coated cruelty that became a cultural grammar',
      slug: 'why-mean-girls-still-defines-teen-movies',
      excerpt:
        'Mean Girls doesn’t just quote well — it teaches a language for status, insecurity, and belonging. Two decades later, it still writes the rules of the genre.',
      categoryId: cats['retrospectives'].id,
      heroImageUrl: 'https://images.unsplash.com/photo-1522648423991-5dc3a33f5f75?auto=format&fit=crop&w=1800&q=80',
      isHero: true,
      tags: ['teen-movies', 'nostalgia', 'fandom'],
      bodyMdx: mdx`
# Mean Girls as a social operating system

Pop culture hits hardest when it offers **a framework** — a way to interpret your own life. *Mean Girls* isn’t only funny. It’s **diagnostic**.

<PullQuote>Mean Girls didn’t just capture teen life. It taught the internet how to talk about it.</PullQuote>

## The Y2K high-gloss of its worldview

The movie’s look is a memory of early-2000s aspiration: clean highlights, saturated pinks, a world where the mall feels like a map of your future.

<InlineImage src="https://images.unsplash.com/photo-1520975693410-001d48b63b4c?auto=format&fit=crop&w=1600&q=80" alt="Pink hallway" caption="Aesthetic memory: the era of glossy interiors and hotter-than-real lighting." />

## Why it still travels

Because the subject isn’t trends — it’s the **physics of belonging**.

- Social groups as survival strategy
- Shame as entertainment
- Popularity as a currency with invisible fees

<Callout title="Popcology note">If a story gives you a grammar, it lasts. Quotes are just the UI.</Callout>

` ,
    },
    {
      title: 'How the iPod Changed Music Consumption',
      subtitle: 'The shuffle button turned listening into identity design',
      slug: 'how-the-ipod-changed-music-consumption',
      excerpt:
        'The iPod didn’t just put music in your pocket — it rewired how we remember, organize, and perform taste.',
      categoryId: cats['analysis'].id,
      heroImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=80',
      tags: ['music-tech', 'y2k', 'nostalgia'],
      bodyMdx: mdx`
# The playlist era begins

The iPod is a design object that quietly changed the meaning of music ownership.

<PullQuote>Shuffle didn’t randomize songs — it randomized *you*.</PullQuote>

## Music as a personal interface

Once songs became draggable files, listening became a kind of **self-curation**.

<VideoEmbed youtubeId="dQw4w9WgXcQ" title="Example embed" />

` ,
    },
    {
      title: 'The Cultural Afterlife of Lost',
      subtitle: 'Mystery boxes, message boards, and the birth of modern binge discourse',
      slug: 'the-cultural-afterlife-of-lost',
      excerpt:
        'Lost taught audiences to theorize together — then taught studios to sell that behavior back to us.',
      categoryId: cats['retrospectives'].id,
      heroImageUrl: 'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1800&q=80',
      isFeaturedEssay: true,
      tags: ['tv-history', 'internet-culture', 'fandom'],
      bodyMdx: mdx`
# Before the feed, there was the forum

*Lost* was a weekly ritual — and the space between episodes became the real show.

## The hobby of meaning-making

Theorizing wasn’t extra. It was the point.

<Callout title="Popcology note">Modern streaming shortened the gap, but the urge to decode never left.</Callout>

` ,
    },
    {
      title: 'Why Nostalgia Dominates Modern Entertainment',
      subtitle: 'Comfort content as a coping mechanism (and a business plan)',
      slug: 'why-nostalgia-dominates-modern-entertainment',
      excerpt:
        'Nostalgia isn’t just longing. It’s a technology for mood regulation — and studios have learned to monetize it with precision.',
      categoryId: cats['essays'].id,
      heroImageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1800&q=80',
      isFeaturedEssay: true,
      tags: ['nostalgia', 'internet-culture'],
      bodyMdx: mdx`
# Nostalgia as emotional infrastructure

Nostalgia works because it’s both **memory** and **design** — the past, reorganized into something safe.

<PullQuote>Nostalgia edits out the buffer time: the boredom, the waiting, the parts that didn’t photograph well.</PullQuote>

` ,
    },
    {
      title: 'The Rise of Cinematic Universes',
      subtitle: 'Franchise logic: when a story becomes a platform',
      slug: 'the-rise-of-cinematic-universes',
      excerpt:
        'Cinematic universes promise infinite continuation — but the psychological cost is that stories stop ending.',
      categoryId: cats['analysis'].id,
      heroImageUrl: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1800&q=80',
      tags: ['franchises', 'fandom'],
      bodyMdx: mdx`
# Story as subscription

Franchises are built to keep you inside a world long enough to make leaving feel like loss.

` ,
    },
  ]

  for (const a of articles) {
    const existing = await prisma.article.findUnique({ where: { slug: a.slug } })

    const article = await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        ...base,
        title: a.title,
        subtitle: a.subtitle,
        excerpt: a.excerpt,
        bodyMdx: a.bodyMdx,
        heroImageUrl: a.heroImageUrl,
        categoryId: a.categoryId,
        isHero: a.isHero ?? false,
        isFeaturedEssay: a.isFeaturedEssay ?? false,
      },
      create: {
        ...base,
        title: a.title,
        subtitle: a.subtitle,
        slug: a.slug,
        excerpt: a.excerpt,
        bodyMdx: a.bodyMdx,
        heroImageUrl: a.heroImageUrl,
        categoryId: a.categoryId,
        isHero: a.isHero ?? false,
        isFeaturedEssay: a.isFeaturedEssay ?? false,
      },
    })

    if (!existing) {
      await prisma.articleTag.createMany({
        data: a.tags.map((slug) => ({
          articleId: article.id,
          tagId: t[slug].id,
        })),
        skipDuplicates: true,
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    throw e
  })
