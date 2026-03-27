import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function createAdminSession() {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey())

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  try {
    await jwtVerify(token, getSecretKey())
    return true
  } catch {
    return false
  }
}

export async function getAdminSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value
}
