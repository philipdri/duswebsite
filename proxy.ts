import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE = 'admin_session'

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const secretKey = getSecretKey()
  if (!secretKey) return false

  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return false

  try {
    await jwtVerify(token, secretKey)
    return true
  } catch {
    return false
  }
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Protect all /admin routes except /admin/login
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const authenticated = await isAuthenticated(req)
    if (!authenticated) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
    }
  }

  // Redirect authenticated users away from login page
  if (path === '/admin/login') {
    const authenticated = await isAuthenticated(req)
    if (authenticated) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
