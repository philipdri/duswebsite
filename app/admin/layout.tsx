import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export const metadata = { title: 'DUS Admin' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f7f4f0' }}>
        <nav
          style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '52px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link
              href="/admin"
              style={{ color: '#fff', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.2em' }}
            >
              DUS ADMIN
            </Link>
            <Link
              href="/admin/projects"
              style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.1em' }}
            >
              PROSJEKTER
            </Link>
            <Link
              href="/admin/projects/new"
              style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.1em' }}
            >
              + NYTT PROSJEKT
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/"
              target="_blank"
              style={{ color: '#999', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              SE NETTSIDE ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                style={{
                  background: 'none',
                  border: '1px solid #444',
                  color: '#ccc',
                  padding: '4px 12px',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                LOGG UT
              </button>
            </form>
          </div>
        </nav>
        <main style={{ minHeight: 'calc(100vh - 52px)' }}>{children}</main>
      </body>
    </html>
  )
}
