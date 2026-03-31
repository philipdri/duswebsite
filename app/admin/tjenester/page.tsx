import Link from 'next/link'
import { getServices } from '@/lib/content-db'

export const dynamic = 'force-dynamic'

export default async function TjenesterAdminPage() {
  const services = await getServices()

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <h1
        style={{
          fontWeight: 300,
          fontSize: '1.5rem',
          letterSpacing: '0.1em',
          marginBottom: '8px',
          color: '#000',
        }}
      >
        Tjenester
      </h1>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '32px' }}>
        Rediger tjenestene som vises på Tjenester-siden.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#e0e0e0' }}>
        {services.map((service) => (
          <div
            key={service.id}
            style={{
              backgroundColor: '#fff',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.title}
                style={{ width: '60px', height: '40px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 400,
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                    color: '#000',
                  }}
                >
                  {service.title}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '0.78rem',
                    color: '#737373',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {service.description}
                </p>
              </div>
            </div>
            <Link
              href={`/admin/tjenester/${service.id}/edit`}
              style={{
                padding: '8px 20px',
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                flexShrink: 0,
              }}
            >
              REDIGER
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
