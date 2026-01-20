'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { useState } from 'react'

const languageNames: Record<Locale, string> = {
  en: 'English',
  sw: 'Kiswahili',
  lg: 'Luganda',
  luo: 'Dholuo',
}

const languageFlags: Record<Locale, string> = {
  en: '🇬🇧',
  sw: '🇹🇿',
  lg: '🇺🇬',
  luo: '🇰🇪',
}

export function LanguageSwitcher() {
  const t = useTranslations('language')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label={t('select')}
      >
        <span>{languageFlags[locale]}</span>
        <span className="text-sm font-medium text-gray-700">{languageNames[locale]}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-2">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLanguageChange(loc)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    locale === loc
                      ? 'bg-green-50 text-green-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{languageFlags[loc]}</span>
                  <span className="font-medium">{languageNames[loc]}</span>
                  {locale === loc && (
                    <svg
                      className="w-4 h-4 ml-auto text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
