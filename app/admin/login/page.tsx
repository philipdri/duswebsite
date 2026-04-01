'use client'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-dus-bg px-4">
      <div className="w-full max-w-[400px] border border-[#e5e5e5] bg-white p-8 sm:p-12">
        <h1 className="mb-8 font-classico text-xl font-light tracking-[0.2em] text-black">
          DUS ADMIN
        </h1>

        <form action={action}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block font-classico text-[0.7rem] font-normal tracking-[0.15em] text-dus-muted"
            >
              PASSORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border border-[#ccc] px-3 py-2.5 text-[0.9rem] text-black outline-none"
            />
          </div>

          {state?.error && (
            <p className="mb-4 font-classico text-[0.8rem] text-[#c0392b]">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className={`w-full bg-black px-3 py-3 font-classico text-[0.7rem] font-normal tracking-[0.2em] text-white ${
              pending ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
          >
            {pending ? 'LOGGER INN...' : 'LOGG INN'}
          </button>
        </form>
      </div>
    </div>
  )
}
