import { notFound } from 'next/navigation'
import { getServices } from '@/lib/content-db'
import ServiceEditForm from './ServiceEditForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params
  const services = await getServices()
  const service = services.find((s) => s.id === id)

  if (!service) notFound()

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
        Rediger tjeneste
      </h1>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '32px' }}>
        {service.title}
      </p>
      <ServiceEditForm service={service} />
    </div>
  )
}
