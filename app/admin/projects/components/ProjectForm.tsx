'use client'
import { useActionState, useState } from 'react'
import type { ProjectFormState } from '../actions'
import {
  adminCompactLabel,
  adminField,
  adminForm,
  adminInput,
  adminPrimaryButton,
  adminSecondaryButton,
} from '../../adminStyles'

async function uploadImageFile(file: File): Promise<{ url: string } | { error: string }> {
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) return { error: data.error || 'Opplasting feilet.' }
    return { url: data.url as string }
  } catch {
    return { error: 'Nettverksfeil under opplasting. Prov igjen.' }
  }
}

function isSafeImageUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith('/')) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

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

export default function ProjectForm({ project, action, submitLabel }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, null)
  const [images, setImages] = useState<ProjectImage[]>(
    project?.images?.length ? project.images : [{ src: '', caption: '' }],
  )
  const [coverImageUrl, setCoverImageUrl] = useState(project?.coverImage || '')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState<Record<number, boolean>>({})
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleCoverUpload(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploadingCover(true)
    const result = await uploadImageFile(file)
    setUploadingCover(false)
    if ('error' in result) {
      setUploadError(result.error)
    } else {
      setCoverImageUrl(result.url)
    }
  }

  async function handleGalleryUpload(index: number, file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploadingGallery((prev) => ({ ...prev, [index]: true }))
    const result = await uploadImageFile(file)
    setUploadingGallery((prev) => ({ ...prev, [index]: false }))
    if ('error' in result) {
      setUploadError(result.error)
    } else {
      updateImage(index, 'src', result.url)
    }
  }

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

  const uploadButtonClass = (isUploading: boolean) =>
    `inline-flex cursor-pointer items-center border border-[#ccc] px-3.5 py-2 text-[0.7rem] tracking-[0.1em] ${
      isUploading ? 'cursor-not-allowed bg-[#f5f5f5] opacity-60' : 'bg-white'
    }`

  return (
    <form action={formAction} className={adminForm}>
      {project?.id && <input type="hidden" name="id" value={project.id} />}

      {(state?.error || uploadError) && (
        <div className="mb-6 border border-[#fca5a5] bg-[#fef2f2] px-4 py-3 text-[0.85rem] text-[#b91c1c]">
          {state?.error || uploadError}
        </div>
      )}

      <div className="grid gap-x-5 sm:grid-cols-2">
        <div className={adminField}>
          <label className={adminCompactLabel}>TITTEL *</label>
          <input name="title" required defaultValue={project?.title || ''} className={adminInput} />
        </div>
        <div className={adminField}>
          <label className={adminCompactLabel}>SLUG * (url-vennlig, kun a-z, 0-9, -)</label>
          <input
            name="slug"
            required
            pattern="[-a-z0-9]+"
            defaultValue={project?.slug || ''}
            className={adminInput}
            placeholder="f.eks. enebolig-bergen"
          />
        </div>
      </div>

      <div className={adminField}>
        <label className={adminCompactLabel}>FORSIDEBILDE *</label>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <input
            name="coverImage"
            required
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="flex-1 border border-[#ccc] bg-white px-3 py-2 text-[0.9rem] text-black outline-none"
            placeholder="/img/prosjekt/bilde.jpg eller last opp"
          />
          <label className={uploadButtonClass(uploadingCover)}>
            {uploadingCover ? 'LASTER...' : 'LAST OPP'}
            <input
              type="file"
              accept="image/*"
              disabled={uploadingCover}
              className="hidden"
              onChange={(e) => handleCoverUpload(e.target.files?.[0])}
            />
          </label>
        </div>
        {isSafeImageUrl(coverImageUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt="Forsidebildeforhandsvisning"
            width={200}
            height={120}
            className="mt-2 max-h-[120px] max-w-full border border-[#eee] object-contain"
          />
        )}
      </div>

      <div className={adminField}>
        <label className={adminCompactLabel}>KORTBESKRIVELSE</label>
        <input
          name="shortDescription"
          defaultValue={project?.shortDescription || ''}
          className={adminInput}
          placeholder="Kort tekst for oversikter"
        />
      </div>

      <div className={adminField}>
        <label className={adminCompactLabel}>BESKRIVELSE (full tekst)</label>
        <textarea
          name="description"
          defaultValue={project?.description || ''}
          rows={6}
          className={`${adminInput} resize-y`}
          placeholder="Prosjektbeskrivelse..."
        />
      </div>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <div className={adminField}>
          <label className={adminCompactLabel}>STED</label>
          <input
            name="location"
            defaultValue={project?.location || ''}
            className={adminInput}
            placeholder="Bergen, Norge"
          />
        </div>
        <div className={adminField}>
          <label className={adminCompactLabel}>ARSTALL</label>
          <input
            name="year"
            defaultValue={project?.year || ''}
            className={adminInput}
            placeholder="2024"
          />
        </div>
      </div>

      <div className={`${adminField} flex items-center gap-2.5`}>
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={project?.published ?? false}
          className="h-4 w-4"
        />
        <label htmlFor="published" className="cursor-pointer text-[0.85rem] text-[#333]">
          Publisert (synlig pa nettside)
        </label>
      </div>

      <div className="mb-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[0.65rem] font-normal tracking-[0.15em] text-dus-muted">
            GALLERIBILDER
          </span>
          <button type="button" onClick={addImage} className={adminSecondaryButton}>
            + LEGG TIL BILDE
          </button>
        </div>
        {images.map((img, i) => (
          <div key={i} className="mb-3 border border-[#eee] p-3 last:mb-0">
            <div className="mb-2 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <input
                name={`images[${i}][src]`}
                value={img.src}
                onChange={(e) => updateImage(i, 'src', e.target.value)}
                className="flex-1 border border-[#ccc] bg-white px-3 py-2 text-[0.9rem] text-black outline-none"
                placeholder="/img/prosjekt/bilde.jpg eller last opp"
              />
              <label className={uploadButtonClass(!!uploadingGallery[i])}>
                {uploadingGallery[i] ? 'LASTER...' : 'LAST OPP'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={!!uploadingGallery[i]}
                  className="hidden"
                  onChange={(e) => handleGalleryUpload(i, e.target.files?.[0])}
                />
              </label>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="shrink-0 border border-[#e5e5e5] bg-transparent px-3 py-2 text-[0.8rem] text-[#c0392b]"
              >
                X
              </button>
            </div>
            <input
              name={`images[${i}][caption]`}
              value={img.caption}
              onChange={(e) => updateImage(i, 'caption', e.target.value)}
              className={adminInput}
              placeholder="Bildetekst"
            />
            {isSafeImageUrl(img.src) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.src}
                alt=""
                width={160}
                height={80}
                className="mt-2 max-h-20 max-w-full border border-[#eee] object-contain"
              />
            )}
          </div>
        ))}
      </div>

      <button type="submit" disabled={pending} className={adminPrimaryButton}>
        {pending ? 'LAGRER...' : submitLabel}
      </button>
    </form>
  )
}
