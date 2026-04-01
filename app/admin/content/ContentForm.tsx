'use client'
import { useActionState } from 'react'
import { saveSiteContent, type ContentFormState } from './actions'
import {
  adminErrorAlert,
  adminField,
  adminForm,
  adminHint,
  adminInput,
  adminLabel,
  adminPrimaryButton,
  adminSectionTitle,
  adminSuccessAlert,
  adminTextarea,
} from '../adminStyles'

interface ContentFormProps {
  initialValues: Record<string, string>
}

export default function ContentForm({ initialValues }: ContentFormProps) {
  const [state, formAction, pending] = useActionState<ContentFormState | null, FormData>(
    saveSiteContent,
    null,
  )

  return (
    <form action={formAction} className={adminForm}>
      {state?.success && <div className={adminSuccessAlert}>Innhold lagret.</div>}
      {state?.error && <div className={adminErrorAlert}>{state.error}</div>}

      <section className="mb-10">
        <h2 className={adminSectionTitle}>
          INTRO-TEKST (mellom logo og portef{"\u00f8"}lje)
        </h2>
        <div>
          <label htmlFor="intro_text" className={adminLabel}>
            TEKST
          </label>
          <textarea
            id="intro_text"
            name="intro_text"
            defaultValue={initialValues.intro_text}
            className={`${adminTextarea} min-h-20`}
          />
          <p className={adminHint}>
            Vist p{"\u00e5"} forsiden mellom header og portef{"\u00f8"}lje-grid.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className={adminSectionTitle}>OM OSS SEKSJONEN</h2>
        <div className={adminField}>
          <label htmlFor="about_heading" className={adminLabel}>
            OVERSKRIFT
          </label>
          <input
            id="about_heading"
            name="about_heading"
            type="text"
            defaultValue={initialValues.about_heading}
            className={adminInput}
          />
        </div>
        <div>
          <label htmlFor="about_text" className={adminLabel}>
            BR{"\u00d8"}DTEKST
          </label>
          <textarea
            id="about_text"
            name="about_text"
            defaultValue={initialValues.about_text}
            className={`${adminTextarea} min-h-[200px]`}
          />
          <p className={adminHint}>Separate avsnitt med tom linje (trykk Enter to ganger).</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className={adminSectionTitle}>TJENESTER-SIDEN (introduksjonstekst)</h2>
        <div>
          <label htmlFor="tjenester_intro" className={adminLabel}>
            TEKST
          </label>
          <textarea
            id="tjenester_intro"
            name="tjenester_intro"
            defaultValue={initialValues.tjenester_intro}
            className={`${adminTextarea} min-h-[100px]`}
          />
          <p className={adminHint}>Vist {"\u00f8"}verst p{"\u00e5"} Tjenester-siden.</p>
        </div>
      </section>

      <button type="submit" disabled={pending} className={adminPrimaryButton}>
        {pending ? 'LAGRER...' : 'LAGRE INNHOLD'}
      </button>
    </form>
  )
}
