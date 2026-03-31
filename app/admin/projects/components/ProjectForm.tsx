'use client'
import { useActionState, useState } from 'react'
import type { ProjectFormState } from '../actions'

interface ProjectImage {
  src: string
  caption: string
}

interface Project {
  id?: string
  title: string
  slug: string
  shortDescription: string | null
  description: string | null
  location: string | null
  year: string | null
  coverImage: string
  published: boolean
  images: ProjectImage[]
}

interface ProjectFormProps {
  project?: Project
  action: (prev: ProjectFormState | null, formData: FormData) => Promise<ProjectFormState | null>
  submitLabel: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ccc',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  letterSpacing: '0.15em',
  color: '#737373',
  marginBottom: '6px',
  fontWeight: 400,
}

const fieldStyle: React.CSSProperties = {
  marginBottom: '20px',
}

export default function ProjectForm({ project, action, submitLabel }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, null)
  const [images, setImages] = useState<ProjectImage[]>(
    project?.images?.length ? project.images : [{ src: '', caption: '' }],
  )

  function addImage() {
    setImages([...images, { src: '', caption: '' }])
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index))
  }

  function updateImage(index: number, field: 'src' | 'caption', value: string) {
    const updated = [...images]
    updated[index] = { ...updated[index], [field]: value }
    setImages(updated)
  }

  return (
    <form action={formAction} style={{ maxWidth: '700px' }}>
      {project?.id && <input type="hidden" name="id" value={project.id} />}

      {state?.error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '0.85rem',
            color: '#b91c1c',
          }}
        >
          {state.error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>TITTEL *</label>
          <input name="title" required defaultValue={project?.title || ''} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>SLUG * (url-vennlig, kun a-z, 0-9, -)</label>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            defaultValue={project?.slug || ''}
            style={inputStyle}
            placeholder="f.eks. enebolig-bergen"
          />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>FORSIDEBILDE URL *</label>
        <input
          name="coverImage"
          required
          defaultValue={project?.coverImage || ''}
          style={inputStyle}
          placeholder="/img/prosjekt/bilde.jpg"
        />
        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#999' }}>
          Sti til bilde i /public/img/ eller ekstern URL.
        </p>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>KORTBESKRIVELSE</label>
        <input
          name="shortDescription"
          defaultValue={project?.shortDescription || ''}
          style={inputStyle}
          placeholder="Kort tekst for oversikter"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>BESKRIVELSE (full tekst)</label>
        <textarea
          name="description"
          defaultValue={project?.description || ''}
          rows={6}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Prosjektbeskrivelse…"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>STED</label>
          <input name="location" defaultValue={project?.location || ''} style={inputStyle} placeholder="Bergen, Norge" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>ÅRSTALL</label>
          <input name="year" defaultValue={project?.year || ''} style={inputStyle} placeholder="2024" />
        </div>
      </div>

      <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={project?.published ?? false}
          style={{ width: '16px', height: '16px' }}
        />
        <label htmlFor="published" style={{ fontSize: '0.85rem', color: '#333', margin: 0, cursor: 'pointer' }}>
          Publisert (synlig på nettside)
        </label>
      </div>

      {/* Gallery images */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ ...labelStyle, margin: 0 }}>GALLERIBILDER</span>
          <button
            type="button"
            onClick={addImage}
            style={{
              padding: '4px 12px',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              border: '1px solid #000',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            + LEGG TIL BILDE
          </button>
        </div>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr auto',
              gap: '8px',
              marginBottom: '8px',
              alignItems: 'start',
            }}
          >
            <div>
              <input
                name={`images[${i}][src]`}
                value={img.src}
                onChange={(e) => updateImage(i, 'src', e.target.value)}
                style={inputStyle}
                placeholder="/img/prosjekt/bilde.jpg"
              />
            </div>
            <div>
              <input
                name={`images[${i}][caption]`}
                value={img.caption}
                onChange={(e) => updateImage(i, 'caption', e.target.value)}
                style={inputStyle}
                placeholder="Bildetekst"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(i)}
              style={{
                padding: '8px 12px',
                background: 'none',
                border: '1px solid #e5e5e5',
                color: '#c0392b',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '12px 32px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          cursor: pending ? 'not-allowed' : 'pointer',
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? 'LAGRER…' : submitLabel}
      </button>
    </form>
  )
}
