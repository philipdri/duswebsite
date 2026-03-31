import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { verifyAdminSession } from '@/lib/session'

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

async function saveToBlob(filename: string, file: File): Promise<string> {
  const { put } = await import('@vercel/blob')
  const blob = await put(`uploads/${filename}`, file, { access: 'public' })
  return blob.url
}

async function saveToFilesystem(filename: string, file: File): Promise<string> {
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(join(uploadsDir, filename), buffer)
  return `/uploads/${filename}`
}

export async function POST(request: NextRequest) {
  const ok = await verifyAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'Ingen fil mottatt.' }, { status: 400 })
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: 'Ugyldig filtype. Kun bilder (JPEG, PNG, GIF, WebP) er tillatt.' },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Filen er for stor. Maksimal størrelse er 10 MB.' }, { status: 400 })
  }

  // Use a random filename to prevent path traversal and filename collisions
  const randomPart = Math.random().toString(36).slice(2, 10)
  const filename = `${Date.now()}-${randomPart}${ext}`

  try {
    // Use Vercel Blob when the token is available (production), otherwise fall back to local filesystem
    const url = process.env.BLOB_READ_WRITE_TOKEN
      ? await saveToBlob(filename, file)
      : await saveToFilesystem(filename, file)

    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: 'Filen kunne ikke lagres. Prøv igjen.' }, { status: 500 })
  }
}
