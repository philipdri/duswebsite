import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import ProjectForm from '../../components/ProjectForm'
import { updateProject } from '../../actions'

interface Props {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  let project = null
  let dbAvailable = false

  try {
    project = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    })
    dbAvailable = true
  } catch {
    // DB not connected
  }

  if (dbAvailable && project === null) {
    notFound()
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link
          href="/admin/projects"
          style={{ color: '#737373', fontSize: '0.75rem', letterSpacing: '0.1em', textDecoration: 'none' }}
        >
          ← PROSJEKTER
        </Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', letterSpacing: '0.1em', color: '#000', margin: 0 }}>
          Rediger: {project?.title || id}
        </h1>
      </div>
      {project ? (
        <ProjectForm
          project={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            shortDescription: project.shortDescription,
            description: project.description,
            location: project.location,
            year: project.year,
            coverImage: project.coverImage,
            published: project.published,
            sortOrder: project.sortOrder,
            images: project.images.map((img) => ({ src: img.src, caption: img.caption || '' })),
          }}
          action={updateProject}
          submitLabel="LAGRE ENDRINGER"
        />
      ) : (
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            padding: '16px',
            fontSize: '0.85rem',
            color: '#856404',
          }}
        >
          Database ikke tilkoblet.
        </div>
      )}
    </div>
  )
}
