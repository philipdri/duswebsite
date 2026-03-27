import Link from 'next/link'
import { prisma } from '@/lib/db'
import { togglePublished } from './actions'
import DeleteProjectButton from './components/DeleteProjectButton'

export const dynamic = 'force-dynamic'

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { images: { orderBy: { order: 'asc' } } },
    })
  } catch {
    return null
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', letterSpacing: '0.1em', color: '#000', margin: 0 }}>
          Prosjekter
        </h1>
        <Link
          href="/admin/projects/new"
          style={{
            padding: '8px 20px',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
          }}
        >
          + NYTT PROSJEKT
        </Link>
      </div>

      {projects === null && (
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            padding: '16px',
            fontSize: '0.85rem',
            color: '#856404',
          }}
        >
          <strong>Database ikke tilkoblet.</strong> Sett opp DATABASE_URL i .env.
        </div>
      )}

      {projects !== null && projects.length === 0 && (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e5e5',
            padding: '48px',
            textAlign: 'center',
            color: '#737373',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Ingen prosjekter ennå.</p>
          <Link
            href="/admin/projects/new"
            style={{
              display: 'inline-block',
              marginTop: '16px',
              color: '#000',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
            }}
          >
            Opprett ditt første prosjekt →
          </Link>
        </div>
      )}

      {projects !== null && projects.length > 0 && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                {['TITTEL', 'SLUG', 'ÅR', 'STED', 'STATUS', 'BILDER', ''].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      color: '#737373',
                      fontWeight: 400,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#000', fontWeight: 400 }}>
                    {project.title}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#737373', fontFamily: 'monospace' }}>
                    {project.slug}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#737373' }}>
                    {project.year || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#737373' }}>
                    {project.location || '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <form action={togglePublished}>
                      <input type="hidden" name="id" value={project.id} />
                      <input type="hidden" name="published" value={String(!project.published)} />
                      <button
                        type="submit"
                        style={{
                          padding: '3px 10px',
                          fontSize: '0.65rem',
                          letterSpacing: '0.1em',
                          border: `1px solid ${project.published ? '#22c55e' : '#e5e5e5'}`,
                          backgroundColor: project.published ? '#f0fdf4' : '#f9f9f9',
                          color: project.published ? '#16a34a' : '#737373',
                          cursor: 'pointer',
                        }}
                      >
                        {project.published ? 'PUBLISERT' : 'UTKAST'}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#737373' }}>
                    {project.images.length}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        style={{ color: '#000', fontSize: '0.75rem', letterSpacing: '0.1em', textDecoration: 'none' }}
                      >
                        REDIGER
                      </Link>
                      <DeleteProjectButton id={project.id} title={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
