'use client'
import { deleteProject } from '../actions'

interface DeleteProjectButtonProps {
  id: string
  title: string
}

export default function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  return (
    <form
      action={deleteProject}
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
