# popcology

A glossy Y2K “fizzy pop” pop-culture magazine built with **Next.js + TypeScript + Tailwind + Prisma (SQLite)**.

## Quick start

```bash
npm install
cp .env.example .env

# Create the SQLite DB + generate client
npx prisma migrate dev --name init

# Seed demo content
npm run db:seed

npm run dev
```

Open:

- Site: http://localhost:3000
- Editor: http://localhost:3000/admin
- Prisma Studio: `npm run db:studio`

## Logo assets

Put the provided brand PNGs into:

- `public/brand/popcology.png`
- `public/brand/pclogo2.png`
- `public/brand/pclogobg.png`

(There’s a fallback text wordmark if they’re missing.)

## Editorial CMS

- Articles support: **draft / scheduled / published**
- Scheduled articles auto-publish when `scheduledFor <= now`
- MDX body supports:
  - `<PullQuote>…</PullQuote>`
  - `<InlineImage src="…" alt="…" caption="…" />`
  - `<VideoEmbed youtubeId="…" title="…" />`
  - `<Callout title="…">…</Callout>`

## Notes

- `/admin` is protected by Basic Auth if `ADMIN_USER` + `ADMIN_PASS` are set.
- `POST /api/admin/upload` writes to `public/uploads`. For production hosting with read-only/ephemeral disks, swap this for S3/R2 or an upload service.
