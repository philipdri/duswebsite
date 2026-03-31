import Link from 'next/link'
import { prisma } from '@/lib/db'
import { togglePublished } from './actions'
import DeleteProjectButton from './components/DeleteProjectButton'
import SortableProjectList from './components/SortableProjectList'

export const dynamic = 'force-dynamic'

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { images: { select: { id: true } } },
    })
  } catch {
    return null
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  const published = projects?.filter((p) => p.published) ?? []
  const drafts = projects?.filter((p) => !p.published) ?? []

  const toRow = (p: NonNullable<typeof projects>[number]) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    year: p.year,
    location: p.location,
    published: p.published,
    imageCount: p.images.length,
  })

  const headStyle = {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    color: '#737373',
    fontWeight: 400,
  }
  const cellStyle = { padding: '12px 16px', fontSize: '0.8rem', color: '#737373' }

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
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

      {projects !== null && (
        <>
          {/* Published / portfolio list */}
          <div style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontWeight: 400,
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                color: '#737373',
                margin: '0 0 12px',
                textTransform: 'uppercase',
              }}
            >
              Portfolio (publiserte prosjekter)
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#aaa', margin: '0 0 12px' }}>
              Dra i ⠿-ikonet for å endre rekkefølgen i portfolioen.
            </p>

            {published.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  padding: '32px',
                  textAlign: 'center',
                  color: '#737373',
                  fontSize: '0.85rem',
                }}
              >
                Ingen publiserte prosjekter ennå. Publiser et utkast for å legge det til i portfolioen.
              </div>
            ) : (
              <SortableProjectList projects={published.map(toRow)} />
            )}
          </div>

          {/* Drafts list */}
          <div>
            <h2
              style={{
                fontWeight: 400,
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                color: '#737373',
                margin: '0 0 12px',
                textTransform: 'uppercase',
              }}
            >
              Utkast (ikke publiserte)
            </h2>

            {drafts.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  padding: '32px',
                  textAlign: 'center',
                  color: '#737373',
                  fontSize: '0.85rem',
                }}
              >
                {projects.length === 0 ? (
                  <>
                    <p style={{ margin: '0 0 12px' }}>Ingen prosjekter ennå.</p>
                    <Link
                      href="/admin/projects/new"
                      style={{ color: '#000', fontSize: '0.8rem', letterSpacing: '0.1em' }}
                    >
                      Opprett ditt første prosjekt →
                    </Link>
                  </>
                ) : (
                  'Ingen utkast.'
                )}
              </div>
            ) : (
              <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                      {['TITTEL', 'SLUG', 'ÅR', 'STED', 'STATUS', 'BILDER', ''].map((h) => (
                        <th key={h} style={headStyle}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {drafts.map((project) => (
                      <tr key={project.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#000', fontWeight: 400 }}>
                          {project.title}
                        </td>
                        <td style={{ ...cellStyle, fontFamily: 'monospace' }}>{project.slug}</td>
                        <td style={cellStyle}>{project.year || '—'}</td>
                        <td style={cellStyle}>{project.location || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <form action={togglePublished}>
                            <input type="hidden" name="id" value={project.id} />
                            <input type="hidden" name="published" value="true" />
                            <button
                              type="submit"
                              style={{
                                padding: '3px 10px',
                                fontSize: '0.65rem',
                                letterSpacing: '0.1em',
                                border: '1px solid #e5e5e5',
                                backgroundColor: '#f9f9f9',
                                color: '#737373',
                                cursor: 'pointer',
                              }}
                            >
                              UTKAST
                            </button>
                          </form>
                        </td>
                        <td style={cellStyle}>{project.images.length}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Link
                              href={`/admin/projects/${project.id}/edit`}
                              style={{
                                color: '#000',
                                fontSize: '0.75rem',
                                letterSpacing: '0.1em',
                                textDecoration: 'none',
                              }}
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
        </>
      )}
    </div>
  )
}

