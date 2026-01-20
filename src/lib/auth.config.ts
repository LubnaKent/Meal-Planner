import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAuthPage = nextUrl.pathname === '/login' || nextUrl.pathname === '/register'

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isOnAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }
      return true
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig
