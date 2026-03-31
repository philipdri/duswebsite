'use server'
import { timingSafeEqual } from 'crypto'
import { redirect } from 'next/navigation'
import { createAdminSession, deleteAdminSession } from '@/lib/session'

export async function login(
  _prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const password = formData.get('password') as string

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return { error: 'Server misconfiguration: ADMIN_PASSWORD not set.' }
  }

  if (!process.env.ADMIN_SESSION_SECRET) {
    return { error: 'Server misconfiguration: ADMIN_SESSION_SECRET not set.' }
  }

  if (!password) {
    return { error: 'Feil passord.' }
  }

  let passwordsMatch = false
  try {
    passwordsMatch = timingSafeEqual(
      Buffer.from(password),
      Buffer.from(adminPassword),
    )
  } catch {
    // Buffers of different lengths throw — treat as mismatch
    passwordsMatch = false
  }

  if (!passwordsMatch) {
    return { error: 'Feil passord.' }
  }

  await createAdminSession()
  redirect('/admin')
}

export async function logout() {
  await deleteAdminSession()
  redirect('/admin/login')
}
