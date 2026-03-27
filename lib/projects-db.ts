import { prisma } from './db'

export interface PublicProject {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  description: string | null
  location: string | null
  year: string | null
  coverImage: string
  sortOrder: number | null
  images: { src: string; caption: string | null }[]
}

export async function getPublishedProjects(): Promise<PublicProject[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: {
      images: { orderBy: { order: 'asc' } },
    },
  })

  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    description: p.description,
    location: p.location,
    year: p.year,
    coverImage: p.coverImage,
    sortOrder: p.sortOrder,
    images: p.images.map((img) => ({ src: img.src, caption: img.caption })),
  }))
}

export async function getPublishedProjectBySlug(slug: string): Promise<PublicProject | null> {
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    include: {
      images: { orderBy: { order: 'asc' } },
    },
  })

  if (!project) return null

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    description: project.description,
    location: project.location,
    year: project.year,
    coverImage: project.coverImage,
    sortOrder: project.sortOrder,
    images: project.images.map((img) => ({ src: img.src, caption: img.caption })),
  }
}

export async function getPublishedProjectSlugs(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return projects.map((p) => p.slug)
}
