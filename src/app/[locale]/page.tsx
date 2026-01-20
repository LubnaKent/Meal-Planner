import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function Home() {
  const t = useTranslations()

  const features = [
    {
      icon: '📊',
      titleKey: 'features.calorieTracking',
      descKey: 'features.calorieTrackingDesc',
    },
    {
      icon: '🎯',
      titleKey: 'features.personalizedGoals',
      descKey: 'features.personalizedGoalsDesc',
    },
    {
      icon: '⏰',
      titleKey: 'features.smartReminders',
      descKey: 'features.smartRemindersDesc',
    },
    {
      icon: '🌍',
      titleKey: 'features.globalCuisine',
      descKey: 'features.globalCuisineDesc',
    },
    {
      icon: '📈',
      titleKey: 'features.progressTracking',
      descKey: 'features.progressTrackingDesc',
    },
    {
      icon: '🎁',
      titleKey: 'features.rewardsSystem',
      descKey: 'features.rewardsSystemDesc',
    },
    {
      icon: '🍫',
      titleKey: 'features.favoriteSnacks',
      descKey: 'features.favoriteSnacksDesc',
    },
    {
      icon: '⚖️',
      titleKey: 'features.weightManagement',
      descKey: 'features.weightManagementDesc',
    },
    {
      icon: '🔔',
      titleKey: 'features.redFlagAlerts',
      descKey: 'features.redFlagAlertsDesc',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥗</span>
          <span className="text-xl font-bold text-green-700">{t('common.appName')}</span>
        </div>
        <div className="flex gap-4 items-center">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="px-4 py-2 text-green-700 hover:text-green-800 font-medium"
          >
            {t('landing.login')}
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {t('landing.register')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
          <span>🎁</span>
          {t('trial.startTrial')}
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {t('landing.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
          {t('landing.subtitle')}
        </p>
        <p className="text-green-600 font-medium mb-8">
          {t('trial.trialBenefits')}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg"
          >
            {t('trial.startTrial')}
          </Link>
          <Link
            href="#features"
            className="px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium text-lg"
          >
            {t('landing.learnMore')}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t('landing.features')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(feature.titleKey)}</h3>
              <p className="text-gray-600">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-green-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            {t('landing.ctaSubtitle')}
          </p>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium text-lg inline-block"
          >
            {t('landing.ctaButton')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥗</span>
            <span className="font-semibold text-gray-700">{t('common.appName')}</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 {t('common.appName')}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
