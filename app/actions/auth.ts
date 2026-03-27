'use server'
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

  if (!password || password !== adminPassword) {
    return { error: 'Feil passord.' }
  }

  await createAdminSession()
  redirect('/admin')
}

export async function logout() {
  await deleteAdminSession()
  redirect('/admin/login')
}
