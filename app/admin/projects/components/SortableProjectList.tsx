'use client'
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { reorderProjects, togglePublished } from '../actions'
import DeleteProjectButton from './DeleteProjectButton'

interface ProjectRow {
  id: string
  title: string
  slug: string
  year: string | null
  location: string | null
  published: boolean
  imageCount: number
}

const cellStyle = { padding: '12px 16px', fontSize: '0.8rem', color: '#737373' } as const
const headStyle = {
  padding: '12px 16px',
  textAlign: 'left' as const,
  fontSize: '0.65rem',
  letterSpacing: '0.15em',
  color: '#737373',
  fontWeight: 400,
} as const

export default function SortableProjectList({ projects: initialProjects }: { projects: ProjectRow[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [saving, setSaving] = useState(false)
  const dragId = useRef<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  function handleDragStart(id: string) {
    dragId.current = id
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
    setDragOverId(null)
  }

  return (
    <div>
      {saving && (
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}
        >
          LAGRER REKKEFØLGE…
        </div>
      )}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
              <th style={{ ...headStyle, width: '32px' }} />
              {['TITTEL', 'SLUG', 'ÅR', 'STED', 'STATUS', 'BILDER', ''].map((h) => (
                <th key={h} style={headStyle}>
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
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  opacity: dragId.current === project.id ? 0.4 : 1,
                  backgroundColor: dragOverId === project.id ? '#f7f4f0' : 'transparent',
                  transition: 'background-color 0.1s',
                }}
              >
                <td
                  style={{
                    padding: '12px 8px 12px 16px',
                    color: '#aaa',
                    cursor: 'grab',
                    userSelect: 'none',
                    fontSize: '1rem',
                    lineHeight: 1,
                  }}
                  aria-label="Dra for å endre rekkefølge"
                  title="Dra for å sortere"
                >
                  ⠿
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#000', fontWeight: 400 }}>
                  {project.title}
                </td>
                <td style={{ ...cellStyle, fontFamily: 'monospace' }}>{project.slug}</td>
                <td style={cellStyle}>{project.year || '—'}</td>
                <td style={cellStyle}>{project.location || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <form action={togglePublished}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="published" value="false" />
                    <button
                      type="submit"
                      style={{
                        padding: '3px 10px',
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                        border: '1px solid #22c55e',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        cursor: 'pointer',
                      }}
                    >
                      PUBLISERT
                    </button>
                  </form>
                </td>
                <td style={cellStyle}>{project.imageCount}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      style={{ color: '#000', fontSize: '0.75rem', letterSpacing: '0.1em', textDecoration: 'none' }}
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
