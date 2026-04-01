import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const total = await prisma.project.count()
    const published = await prisma.project.count({ where: { published: true } })
    return { total, published, unpublished: total - published }
  } catch {
    return null
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <h1 style={{ fontWeight: 300, fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '8px', color: '#000' }}>
        Dashboard
      </h1>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '32px' }}>
        Administrer prosjekter og innhold på DUS Arkitekter nettside.
      </p>

      {stats === null && (
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '0.85rem',
            color: '#856404',
          }}
        >
          <strong>Database ikke tilkoblet.</strong> Sett opp DATABASE_URL i .env for å aktivere databasefunksjonalitet.
        </div>
      )}

      {stats !== null && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Totalt prosjekter', value: stats.total },
            { label: 'Publiserte', value: stats.published },
            { label: 'Upubliserte', value: stats.unpublished },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '2rem', fontWeight: 300, margin: 0, color: '#000' }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#737373', margin: '4px 0 0' }}>
                {s.label.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link
          href="/admin/projects"
          style={{
            padding: '10px 24px',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
          }}
        >
          SE ALLE PROSJEKTER
        </Link>
        <Link
          href="/admin/projects/new"
          style={{
            padding: '10px 24px',
            backgroundColor: '#fff',
            color: '#000',
            textDecoration: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            border: '1px solid #000',
          }}
        >
          + NYTT PROSJEKT
        </Link>
        <Link
          href="/admin/tjenester"
          style={{
            padding: '10px 24px',
            backgroundColor: '#fff',
            color: '#000',
            textDecoration: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            border: '1px solid #000',
          }}
        >
          TJENESTER
        </Link>
        <Link
          href="/admin/content"
          style={{
            padding: '10px 24px',
            backgroundColor: '#fff',
            color: '#000',
            textDecoration: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            border: '1px solid #000',
          }}
        >
          INNHOLD
        </Link>
      </div>
    </div>
  )
}
