'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import { createService, type ServiceFormState } from '../actions'
import { useState } from 'react'
import {
  adminErrorAlert,
  adminField,
  adminFormNarrow,
  adminHint,
  adminInput,
  adminLabel,
  adminPrimaryButton,
  adminSecondaryButton,
  adminTextarea,
} from '../../adminStyles'

export default function NewServiceForm() {
  const [state, formAction, pending] = useActionState<ServiceFormState | null, FormData>(
    createService,
    null,
  )
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setImageUrl(url)
      } else {
        setUploadError('Kunne ikke laste opp bilde. Prøv igjen.')
      }
    } catch {
      setUploadError('Kunne ikke laste opp bilde. Kontroller nettverkstilkobling.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className={adminFormNarrow}>
      {state?.error && <div className={adminErrorAlert}>{state.error}</div>}

      <div className={adminField}>
        <label htmlFor="title" className={adminLabel}>
          TITTEL
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className={adminInput}
        />
      </div>

      <div className={adminField}>
        <label htmlFor="description" className={adminLabel}>
          BESKRIVELSE
        </label>
        <textarea
          id="description"
          name="description"
          required
          className={`${adminTextarea} min-h-[120px]`}
        />
      </div>

      <div className="mb-7">
        <label className={adminLabel}>BILDE</label>
        {imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt="Forh\u00e5ndsvisning"
            className="mb-2.5 max-h-[220px] w-full border border-[#e0e0e0] object-cover"
          />
        )}
        <input type="hidden" name="image" value={imageUrl} />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="text-[0.85rem]"
        />
        {uploading && <p className="mt-1.5 text-[0.8rem] text-[#666]">Laster opp...</p>}
        {uploadError && <p className="mt-1.5 text-[0.8rem] text-[#c0392b]">{uploadError}</p>}
        <p className={adminHint}>Last opp et bilde for tjenesten.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className={adminPrimaryButton}
        >
          {pending ? 'OPPRETTER...' : 'OPPRETT TJENESTE'}
        </button>
        <Link href="/admin/tjenester" className={adminSecondaryButton}>
          AVBRYT
        </Link>
      </div>
    </form>
  )
}
