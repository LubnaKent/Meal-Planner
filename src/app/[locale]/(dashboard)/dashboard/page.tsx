'use client'

import { useSession, signOut } from 'next-auth/react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { TrialBanner } from '@/components/trial-banner'
import { useEffect, useState } from 'react'

interface SubscriptionData {
  trialEndDate: string | null
  subscriptionStatus: string
}

export default function DashboardPage() {
  const t = useTranslations()
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch('/api/user/subscription')
        if (res.ok) {
          const data = await res.json()
          setSubscription(data)
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
      }
    }
    fetchSubscription()
  }, [])

  // Mock data - will be replaced with real data from database
  const todayStats = {
    caloriesConsumed: 1250,
    caloriesTarget: 2000,
    mealsCompleted: 2,
    mealsTotal: 4,
    waterIntake: 5,
    waterTarget: 8,
    currentStreak: 7,
  }

  const todaysMeals = [
    { type: t('meals.breakfast'), time: '8:00 AM', name: 'Oatmeal with Berries', calories: 350, completed: true },
    { type: t('meals.lunch'), time: '12:30 PM', name: 'Grilled Chicken Salad', calories: 450, completed: true },
    { type: t('meals.snack'), time: '3:30 PM', name: 'Greek Yogurt', calories: 150, completed: false },
    { type: t('meals.dinner'), time: '7:00 PM', name: 'Salmon with Vegetables', calories: 550, completed: false },
  ]

  const caloriePercentage = Math.round((todayStats.caloriesConsumed / todayStats.caloriesTarget) * 100)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('dashboard.greeting.morning')
    if (hour < 18) return t('dashboard.greeting.afternoon')
    return t('dashboard.greeting.evening')
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Trial Banner */}
      {subscription && (
        <TrialBanner
          trialEndDate={subscription.trialEndDate}
          subscriptionStatus={subscription.subscriptionStatus}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <span className="text-xl font-bold text-green-700">{t('common.appName')}</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-green-600 font-medium">{t('nav.dashboard')}</Link>
            <Link href="/dashboard/meals" className="text-gray-600 hover:text-green-600">{t('nav.meals')}</Link>
            <Link href="/dashboard/progress" className="text-gray-600 hover:text-green-600">{t('nav.progress')}</Link>
            <Link href="/dashboard/reminders" className="text-gray-600 hover:text-green-600">{t('nav.reminders')}</Link>
            <Link href="/dashboard/rewards" className="text-gray-600 hover:text-green-600">{t('nav.rewards')}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="p-2 text-gray-600 hover:text-green-600">
              <span className="text-xl">🔔</span>
            </button>
            <Link href="/dashboard/settings" className="p-2 text-gray-600 hover:text-green-600">
              <span className="text-xl">⚙️</span>
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                  {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-sm text-gray-700">
                  {session?.user?.name || 'User'}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
                <Link href="/dashboard/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  {t('nav.settings')}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  {t('nav.signOut')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-gray-600">{t('dashboard.mealPlanToday')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Calories Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">{t('dashboard.calories')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.caloriesConsumed} <span className="text-sm font-normal text-gray-500">/ {todayStats.caloriesTarget}</span>
                </p>
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{caloriePercentage}% {t('dashboard.ofDailyGoal')}</p>
          </div>

          {/* Meals Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-500">{t('dashboard.meals')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.mealsCompleted} <span className="text-sm font-normal text-gray-500">/ {todayStats.mealsTotal}</span>
                </p>
              </div>
              <span className="text-2xl">🍽️</span>
            </div>
            <p className="text-sm text-green-600">{todayStats.mealsTotal - todayStats.mealsCompleted} {t('dashboard.mealsRemaining')}</p>
          </div>

          {/* Water Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-500">{t('dashboard.water')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.waterIntake} <span className="text-sm font-normal text-gray-500">/ {todayStats.waterTarget} {t('dashboard.glasses')}</span>
                </p>
              </div>
              <span className="text-2xl">💧</span>
            </div>
            <p className="text-sm text-blue-600">{todayStats.waterTarget - todayStats.waterIntake} {t('dashboard.moreToGo')}</p>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm text-white">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-green-100">{t('dashboard.currentStreak')}</p>
                <p className="text-2xl font-bold">{todayStats.currentStreak} {t('dashboard.days')}</p>
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-sm text-green-100">{t('dashboard.keepItUp')}</p>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.todaysMeals')}</h2>
            <Link href="/dashboard/meals" className="text-green-600 hover:text-green-700 text-sm font-medium">
              {t('dashboard.viewAll')} →
            </Link>
          </div>
          <div className="space-y-4">
            {todaysMeals.map((meal, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  meal.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    meal.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {meal.completed ? '✓' : index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{meal.name}</p>
                    <p className="text-sm text-gray-500">{meal.type} • {meal.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{meal.calories} {t('dashboard.cal')}</p>
                  {!meal.completed && (
                    <button className="text-sm text-green-600 hover:text-green-700">{t('dashboard.markComplete')}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/meals/add"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors group"
          >
            <span className="text-3xl mb-3 block">➕</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">{t('dashboard.addMeal')}</h3>
            <p className="text-sm text-gray-500">{t('dashboard.logMealEaten')}</p>
          </Link>
          <Link
            href="/dashboard/progress"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors group"
          >
            <span className="text-3xl mb-3 block">⚖️</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">{t('dashboard.logWeight')}</h3>
            <p className="text-sm text-gray-500">{t('dashboard.trackProgress')}</p>
          </Link>
          <Link
            href="/dashboard/snacks"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors group"
          >
            <span className="text-3xl mb-3 block">🍫</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">{t('dashboard.favoriteSnacks')}</h3>
            <p className="text-sm text-gray-500">{t('dashboard.guiltFreeTreats')}</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
