'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { verifyAdminSession } from '@/lib/session'

async function requireAdmin() {
  const ok = await verifyAdminSession()
  if (!ok) throw new Error('Unauthorized')
}

export async function deleteProject(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  await prisma.project.delete({ where: { id } })
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function togglePublished(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const published = formData.get('published') === 'true'

  let sortOrder: number | null = null
  if (published) {
    const result = await prisma.project.aggregate({
      where: { published: true },
      _max: { sortOrder: true },
    })
    sortOrder = (result._max.sortOrder ?? -1) + 1
  }

  await prisma.project.update({ where: { id }, data: { published, sortOrder } })
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function reorderProjects(ids: string[]): Promise<void> {
  await requireAdmin()
  await prisma.$transaction(ids.map((id, index) => prisma.project.update({ where: { id }, data: { sortOrder: index } })))
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export interface ProjectFormState {
  error?: string
}

function parseImages(formData: FormData) {
  const images: { src: string; caption: string; order: number }[] = []
  let i = 0
  while (formData.has(`images[${i}][src]`)) {
    const src = (formData.get(`images[${i}][src]`) as string).trim()
    if (src) {
      images.push({
        src,
        caption: (formData.get(`images[${i}][caption]`) as string | null)?.trim() || '',
        order: i,
      })
    }
    i++
  }
  return images
}

export async function createProject(
  _prev: ProjectFormState | null,
  formData: FormData,
): Promise<ProjectFormState | null> {
  await requireAdmin()

  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const coverImage = (formData.get('coverImage') as string).trim()

  if (!title || !slug || !coverImage) {
    return { error: 'Tittel, slug og forsidebilde er påkrevd.' }
  }

  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(slug)) {
    return { error: 'Slug kan kun inneholde små bokstaver, tall og bindestrek.' }
  }

  const existing = await prisma.project.findUnique({ where: { slug } })
  if (existing) {
    return { error: `Slug "${slug}" er allerede i bruk.` }
  }

  const isPublished = formData.get('published') === 'on'
  let sortOrder: number | null = null
  if (isPublished) {
    const result = await prisma.project.aggregate({
      where: { published: true },
      _max: { sortOrder: true },
    })
    sortOrder = (result._max.sortOrder ?? -1) + 1
  }

  const images = parseImages(formData)

  await prisma.project.create({
    data: {
      title,
      slug,
      shortDescription: (formData.get('shortDescription') as string | null)?.trim() || null,
      description: (formData.get('description') as string | null)?.trim() || null,
      location: (formData.get('location') as string | null)?.trim() || null,
      year: (formData.get('year') as string | null)?.trim() || null,
      coverImage,
      published: isPublished,
      sortOrder,
      images: {
        create: images,
      },
    },
  })

  revalidatePath('/admin/projects')
  revalidatePath('/')
  redirect('/admin/projects')
}

export async function updateProject(
  _prev: ProjectFormState | null,
  formData: FormData,
): Promise<ProjectFormState | null> {
  await requireAdmin()

  const id = formData.get('id') as string
  const title = (formData.get('title') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const coverImage = (formData.get('coverImage') as string).trim()

  if (!title || !slug || !coverImage) {
    return { error: 'Tittel, slug og forsidebilde er påkrevd.' }
  }

  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(slug)) {
    return { error: 'Slug kan kun inneholde små bokstaver, tall og bindestrek.' }
  }

  const existing = await prisma.project.findUnique({ where: { slug } })
  if (existing && existing.id !== id) {
    return { error: `Slug "${slug}" er allerede i bruk av et annet prosjekt.` }
  }

  const current = await prisma.project.findUnique({ where: { id }, select: { published: true, sortOrder: true } })
  const isPublished = formData.get('published') === 'on'

  let sortOrder: number | null = current?.sortOrder ?? null
  if (isPublished && !current?.published) {
    // Project is being published for the first time — append to end of portfolio
    const result = await prisma.project.aggregate({
      where: { published: true },
      _max: { sortOrder: true },
    })
    sortOrder = (result._max.sortOrder ?? -1) + 1
  } else if (!isPublished) {
    sortOrder = null
  }

  const images = parseImages(formData)

  // Replace all images
  await prisma.$transaction([
    prisma.projectImage.deleteMany({ where: { projectId: id } }),
    prisma.project.update({
      where: { id },
      data: {
        title,
        slug,
        shortDescription: (formData.get('shortDescription') as string | null)?.trim() || null,
        description: (formData.get('description') as string | null)?.trim() || null,
        location: (formData.get('location') as string | null)?.trim() || null,
        year: (formData.get('year') as string | null)?.trim() || null,
        coverImage,
        published: isPublished,
        sortOrder,
        images: {
          create: images,
        },
      },
    }),
  ])

  revalidatePath('/admin/projects')
  revalidatePath(`/prosjekter/${slug}`)
  revalidatePath('/')
  redirect('/admin/projects')
}
