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
        style={{
          background: 'none',
          border: 'none',
          color: '#c0392b',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        SLETT
      </button>
    </form>
  )
}
