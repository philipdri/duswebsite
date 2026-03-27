'use client'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f7f4f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '48px',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #e5e5e5',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-classico, serif)',
            fontWeight: 300,
            fontSize: '1.25rem',
            letterSpacing: '0.2em',
            color: '#000',
            marginBottom: '32px',
          }}
        >
          DUS ADMIN
        </h1>

        <form action={action}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: '#737373',
                marginBottom: '8px',
                fontFamily: 'var(--font-classico, serif)',
                fontWeight: 400,
              }}
            >
              PASSORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ccc',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {state?.error && (
            <p
              style={{
                color: '#c0392b',
                fontSize: '0.8rem',
                marginBottom: '16px',
                fontFamily: 'var(--font-classico, serif)',
              }}
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              cursor: pending ? 'not-allowed' : 'pointer',
              opacity: pending ? 0.6 : 1,
              fontFamily: 'var(--font-classico, serif)',
              fontWeight: 400,
            }}
          >
            {pending ? 'LOGGER INN…' : 'LOGG INN'}
          </button>
        </form>
      </div>
    </div>
  )
}
