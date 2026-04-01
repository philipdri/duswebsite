import { getAllSiteContent } from '@/lib/content-db'
import ContentForm from './ContentForm'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const content = await getAllSiteContent()

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
        Rediger innhold
      </h1>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '32px' }}>
        Her kan du redigere tekstinnhold på nettsiden.
      </p>
      <ContentForm initialValues={content} />
    </div>
  )
}
