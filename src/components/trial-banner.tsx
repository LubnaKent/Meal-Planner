'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface TrialBannerProps {
  trialEndDate: Date | string | null
  subscriptionStatus: string
}

export function TrialBanner({ trialEndDate, subscriptionStatus }: TrialBannerProps) {
  const t = useTranslations('trial')

  if (subscriptionStatus === 'active') {
    return null
  }

  const calculateDaysRemaining = () => {
    if (!trialEndDate) return 0
    const end = new Date(trialEndDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const daysRemaining = calculateDaysRemaining()
  const isExpired = daysRemaining <= 0 || subscriptionStatus === 'expired'

  if (isExpired) {
    return (
      <div className="bg-red-600 text-white px-4 py-3">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="font-medium">{t('trialEnded')}</span>
          </div>
          <Link
            href="/dashboard/subscribe"
            className="px-4 py-1.5 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            {t('subscribeNow')}
          </Link>
        </div>
      </div>
    )
  }

  const urgencyColor = daysRemaining <= 7
    ? 'bg-orange-500'
    : daysRemaining <= 14
      ? 'bg-yellow-500'
      : 'bg-blue-500'

  return (
    <div className={`${urgencyColor} text-white px-4 py-2`}>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎁</span>
          <span>
            <span className="font-bold">{daysRemaining}</span> {t('daysRemaining')}
          </span>
        </div>
        <Link
          href="/dashboard/subscribe"
          className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
        >
          {t('upgradeNow')}
        </Link>
      </div>
    </div>
  )
}
