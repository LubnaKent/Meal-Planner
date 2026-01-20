import createMiddleware from 'next-intl/middleware'
import NextAuth from 'next-auth'
import { authConfig } from './lib/auth.config'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const { auth } = NextAuth(authConfig)

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register']

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path is for a static file or API route
  const isStaticOrApi =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'

  if (isStaticOrApi) {
    return NextResponse.next()
  }

  // Extract locale from pathname
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Get the path without locale prefix for checking protected routes
  let pathWithoutLocale = pathname
  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1]
    pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
  }

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale)

  // Apply i18n middleware first
  const intlResponse = intlMiddleware(request)

  // If it's a public route, just return the intl response
  if (isPublicRoute) {
    return intlResponse
  }

  // For protected routes, check authentication
  const session = await auth()

  if (!session?.user) {
    // Redirect to login with locale preserved
    const locale = pathnameHasLocale ? pathname.split('/')[1] : routing.defaultLocale
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
}
