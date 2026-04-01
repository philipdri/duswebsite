'use client'
import { useActionState } from 'react'
import { saveSiteContent, type ContentFormState } from './actions'

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  letterSpacing: '0.1em',
  color: '#444',
  marginBottom: '6px',
}

const HINT_STYLE: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#888',
  marginTop: '4px',
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

interface ContentFormProps {
  initialValues: Record<string, string>
}

export default function ContentForm({ initialValues }: ContentFormProps) {
  const [state, formAction, pending] = useActionState<ContentFormState | null, FormData>(
    saveSiteContent,
    null,
  )

  return (
    <form action={formAction} style={{ maxWidth: '700px' }}>
      {state?.success && (
        <div
          style={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '0.85rem',
          }}
        >
          Innhold lagret.
        </div>
      )}
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

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontWeight: 400,
            fontSize: '1rem',
            letterSpacing: '0.1em',
            marginBottom: '20px',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '8px',
          }}
        >
          INTRO-TEKST (mellom logo og portefølje)
        </h2>
        <div>
          <label htmlFor="intro_text" style={LABEL_STYLE}>
            TEKST
          </label>
          <textarea
            id="intro_text"
            name="intro_text"
            defaultValue={initialValues.intro_text}
            style={{ ...TEXTAREA_STYLE, minHeight: '80px' }}
          />
          <p style={HINT_STYLE}>Vist på forsiden mellom header og portefølje-grid.</p>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontWeight: 400,
            fontSize: '1rem',
            letterSpacing: '0.1em',
            marginBottom: '20px',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '8px',
          }}
        >
          OM OSS SEKSJONEN
        </h2>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="about_heading" style={LABEL_STYLE}>
            OVERSKRIFT
          </label>
          <input
            id="about_heading"
            name="about_heading"
            type="text"
            defaultValue={initialValues.about_heading}
            style={INPUT_STYLE}
          />
        </div>
        <div>
          <label htmlFor="about_text" style={LABEL_STYLE}>
            BRØDTEKST
          </label>
          <textarea
            id="about_text"
            name="about_text"
            defaultValue={initialValues.about_text}
            style={{ ...TEXTAREA_STYLE, minHeight: '200px' }}
          />
          <p style={HINT_STYLE}>Separate avsnitt med tom linje (trykk Enter to ganger).</p>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontWeight: 400,
            fontSize: '1rem',
            letterSpacing: '0.1em',
            marginBottom: '20px',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '8px',
          }}
        >
          TJENESTER-SIDEN (introduksjonstekst)
        </h2>
        <div>
          <label htmlFor="tjenester_intro" style={LABEL_STYLE}>
            TEKST
          </label>
          <textarea
            id="tjenester_intro"
            name="tjenester_intro"
            defaultValue={initialValues.tjenester_intro}
            style={{ ...TEXTAREA_STYLE, minHeight: '100px' }}
          />
          <p style={HINT_STYLE}>Vist øverst på Tjenester-siden.</p>
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '12px 32px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          cursor: pending ? 'not-allowed' : 'pointer',
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? 'LAGRER...' : 'LAGRE INNHOLD'}
      </button>
    </form>
  )
}
