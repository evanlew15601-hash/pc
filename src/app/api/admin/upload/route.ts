import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_')
  const fileName = `${Date.now()}_${safeName}`

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const full = path.join(uploadDir, fileName)
  await writeFile(full, buffer)

  return NextResponse.json({ url: `/uploads/${fileName}` })
}
