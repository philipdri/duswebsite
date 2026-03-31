'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { togglePublished } from '../actions'

export default function PublishButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const fd = new FormData()
          fd.set('id', id)
          fd.set('published', 'true')
          await togglePublished(fd)
          router.refresh()
        })
      }}
      style={{
        padding: '3px 10px',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        border: '1px solid #e5e5e5',
        backgroundColor: isPending ? '#f0f0f0' : '#f9f9f9',
        color: '#737373',
        cursor: isPending ? 'default' : 'pointer',
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {isPending ? '…' : 'UTKAST'}
    </button>
  )
}
