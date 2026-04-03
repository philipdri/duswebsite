'use client'
import { deleteService } from './actions'

interface DeleteServiceButtonProps {
  id: string
  title: string
}

export default function DeleteServiceButton({ id, title }: DeleteServiceButtonProps) {
  return (
    <form
      action={deleteService}
      onSubmit={(e) => {
        if (!confirm(`Slett "${title}"? Dette kan ikke angres.`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="border-0 bg-transparent p-0 text-[0.75rem] tracking-[0.1em] text-[#c0392b] transition-opacity hover:opacity-70"
      >
        SLETT
      </button>
    </form>
  )
}
