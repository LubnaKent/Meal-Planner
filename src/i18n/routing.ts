import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'sw', 'lg', 'luo'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Locale prefix strategy - 'as-needed' means default locale doesn't have prefix
  localePrefix: 'as-needed',
})

// Lightweight wrappers around Next.js navigation APIs
export type Locale = (typeof routing.locales)[number]
