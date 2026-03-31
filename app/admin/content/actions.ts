'use server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { verifyAdminSession } from '@/lib/session'

async function requireAdmin() {
  const ok = await verifyAdminSession()
  if (!ok) throw new Error('Unauthorized')
}

export interface ContentFormState {
  success?: boolean
  error?: string
}

export async function saveSiteContent(
  _prev: ContentFormState | null,
  formData: FormData,
): Promise<ContentFormState | null> {
  await requireAdmin()

  const keys = ['intro_text', 'about_heading', 'about_text', 'tjenester_intro']

  try {
    await prisma.$transaction(
      keys
        .filter((key) => formData.has(key))
        .map((key) => {
          const value = (formData.get(key) as string).trim()
          return prisma.siteContent.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          })
        }),
    )
  } catch {
    return { error: 'Kunne ikke lagre innhold. Kontroller databasetilkobling.' }
  }

  revalidatePath('/')
  revalidatePath('/tjenester')
  return { success: true }
}
