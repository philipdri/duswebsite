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
      className={`inline-flex items-center justify-center border px-2.5 py-1 text-[0.65rem] tracking-[0.1em] ${
        isPending
          ? 'cursor-default border-[#e5e5e5] bg-[#f0f0f0] text-dus-muted opacity-60'
          : 'border-[#e5e5e5] bg-[#f9f9f9] text-dus-muted'
      }`}
    >
      {isPending ? '...' : 'UTKAST'}
    </button>
  )
}
