'use client'
import { useActionState } from 'react'
import { updateService, type ServiceFormState } from '../../actions'
import type { ServiceData } from '@/lib/content-db'
import { useState } from 'react'

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  letterSpacing: '0.1em',
  color: '#444',
  marginBottom: '6px',
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d0d0d0',
  fontSize: '0.9rem',
  backgroundColor: '#fff',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const TEXTAREA_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  resize: 'vertical',
  minHeight: '120px',
}

interface ServiceEditFormProps {
  service: ServiceData
}

export default function ServiceEditForm({ service }: ServiceEditFormProps) {
  const [state, formAction, pending] = useActionState<ServiceFormState | null, FormData>(
    updateService,
    null,
  )
  const [imageUrl, setImageUrl] = useState(service.image)
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setImageUrl(url)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} style={{ maxWidth: '600px' }}>
      <input type="hidden" name="id" value={service.id} />

      {state?.error && (
        <div
          style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '0.85rem',
          }}
        >
          {state.error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="title" style={LABEL_STYLE}>
          TITTEL
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={service.title}
          required
          style={INPUT_STYLE}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="description" style={LABEL_STYLE}>
          BESKRIVELSE
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={service.description}
          required
          style={TEXTAREA_STYLE}
        />
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label style={LABEL_STYLE}>BILDE</label>
        {imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt="Forhåndsvisning"
            style={{
              width: '100%',
              maxHeight: '220px',
              objectFit: 'cover',
              marginBottom: '10px',
              border: '1px solid #e0e0e0',
            }}
          />
        )}
        <input type="hidden" name="image" value={imageUrl} />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          style={{ fontSize: '0.85rem' }}
        />
        {uploading && (
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '6px' }}>Laster opp...</p>
        )}
        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '6px' }}>
          Last opp et nytt bilde, eller la feltet stå tomt for å beholde eksisterende.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={pending || uploading}
          style={{
            padding: '12px 32px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            cursor: pending || uploading ? 'not-allowed' : 'pointer',
            opacity: pending || uploading ? 0.6 : 1,
          }}
        >
          {pending ? 'LAGRER...' : 'LAGRE'}
        </button>
        <a
          href="/admin/tjenester"
          style={{
            padding: '12px 24px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #000',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          AVBRYT
        </a>
      </div>
    </form>
  )
}
