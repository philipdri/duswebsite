'use client'
import React, { useState, useRef, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { reorderProjects, togglePublished } from '../actions'
import DeleteProjectButton from './DeleteProjectButton'
import { adminCard, adminTableCell, adminTableHead } from '../../adminStyles'

interface ProjectRow {
  id: string
  title: string
  slug: string
  year: string | null
  location: string | null
  published: boolean
  imageCount: number
}

export default function SortableProjectList({ projects: initialProjects }: { projects: ProjectRow[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [saving, setSaving] = useState(false)
  const dragId = useRef<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleDragStart(id: string) {
    dragId.current = id
    setDraggingId(id)
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    if (id !== dragId.current) setDragOverId(id)
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear when leaving the row entirely (not entering a child)
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOverId(null)
    }
  }

  async function handleDrop(targetId: string) {
    const fromId = dragId.current
    dragId.current = null
    setDraggingId(null)
    setDragOverId(null)
    if (!fromId || fromId === targetId) return

    const fromIndex = projects.findIndex((p) => p.id === fromId)
    const toIndex = projects.findIndex((p) => p.id === targetId)
    const next = [...projects]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)

    setProjects(next)
    setSaving(true)
    await reorderProjects(next.map((p) => p.id))
    setSaving(false)
  }

  function handleDragEnd() {
    dragId.current = null
    setDraggingId(null)
    setDragOverId(null)
  }

  return (
    <div>
      {saving && (
        <div className="mb-2 border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-2 text-[0.75rem] tracking-[0.1em] text-[#166534]">
          LAGRER REKKEF{"\u00d8"}LGE...
        </div>
      )}
      <div className={`${adminCard} overflow-x-auto`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e5e5e5]">
              <th className={`${adminTableHead} w-8`} />
              {['TITTEL', 'SLUG', '\u00c5R', 'STED', 'STATUS', 'BILDER', ''].map((h) => (
                <th key={h} className={adminTableHead}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                draggable
                onDragStart={() => handleDragStart(project.id)}
                onDragOver={(e) => handleDragOver(e, project.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(project.id)}
                onDragEnd={handleDragEnd}
                className={`border-b border-[#f0f0f0] transition-colors ${
                  dragOverId === project.id ? 'bg-dus-bg' : 'bg-transparent'
                } ${draggingId === project.id ? 'opacity-40' : 'opacity-100'}`}
              >
                <td
                  className="select-none px-2 py-3 pl-4 text-base leading-none text-[#aaa]"
                  aria-label={`Dra for \u00e5 endre rekkef\u00f8lge for ${project.title}`}
                  title="Dra for \u00e5 sortere"
                >
                  <span className="cursor-grab">{"\u283f"}</span>
                </td>
                <td className="px-4 py-3 text-[0.85rem] font-normal text-black">
                  {project.title}
                </td>
                <td className={`${adminTableCell} font-mono`}>{project.slug}</td>
                <td className={adminTableCell}>{project.year || '\u2014'}</td>
                <td className={adminTableCell}>{project.location || '\u2014'}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setProjects((prev) => prev.filter((p) => p.id !== project.id))
                      startTransition(async () => {
                        const fd = new FormData()
                        fd.set('id', project.id)
                        fd.set('published', 'false')
                        await togglePublished(fd)
                        router.refresh()
                      })
                    }}
                    className="inline-flex items-center justify-center border border-[#22c55e] bg-[#f0fdf4] px-2.5 py-1 text-[0.65rem] tracking-[0.1em] text-[#16a34a]"
                  >
                    PUBLISERT
                  </button>
                </td>
                <td className={adminTableCell}>{project.imageCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-[0.75rem] tracking-[0.1em] text-black no-underline"
                    >
                      REDIGER
                    </Link>
                    <DeleteProjectButton id={project.id} title={project.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
