'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { verifyAdminSession } from '@/lib/session'
import { services as staticServices } from '@/lib/services'

async function requireAdmin() {
  const ok = await verifyAdminSession()
  if (!ok) throw new Error('Unauthorized')
}

export interface ServiceFormState {
  error?: string
}

/** Seed services from static data if DB table is empty */
async function ensureServicesSeeded() {
  const count = await prisma.service.count()
  if (count === 0) {
    await prisma.service.createMany({
      data: staticServices.map((s, i) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        image: s.image,
        sortOrder: i,
      })),
    })
  }
}

export async function updateService(
  _prev: ServiceFormState | null,
  formData: FormData,
): Promise<ServiceFormState | null> {
  await requireAdmin()

  const id = formData.get('id') as string
  const title = (formData.get('title') as string).trim()
  const description = (formData.get('description') as string).trim()
  const image = (formData.get('image') as string).trim()

  if (!title || !description || !image) {
    return { error: 'Tittel, beskrivelse og bilde er påkrevd.' }
  }

  try {
    await ensureServicesSeeded()
    await prisma.service.upsert({
      where: { id },
      update: { title, description, image },
      create: {
        id,
        title,
        description,
        image,
        sortOrder: 0,
      },
    })
  } catch {
    return { error: 'Kunne ikke lagre tjeneste. Kontroller databasetilkobling.' }
  }

  revalidatePath('/admin/tjenester')
  revalidatePath('/tjenester')
  redirect('/admin/tjenester')
}

export async function seedServicesAction(): Promise<void> {
  await requireAdmin()
  try {
    await ensureServicesSeeded()
  } catch {
    // ignore
  }
  revalidatePath('/admin/tjenester')
}
