import Link from 'next/link'
import ProjectForm from '../components/ProjectForm'
import { createProject } from '../actions'

export default function NewProjectPage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link
          href="/admin/projects"
          style={{ color: '#737373', fontSize: '0.75rem', letterSpacing: '0.1em', textDecoration: 'none' }}
        >
          ← PROSJEKTER
        </Link>
        <h1 style={{ fontWeight: 300, fontSize: '1.5rem', letterSpacing: '0.1em', color: '#000', margin: 0 }}>
          Nytt prosjekt
        </h1>
      </div>
      <ProjectForm action={createProject} submitLabel="OPPRETT PROSJEKT" />
    </div>
  )
}
