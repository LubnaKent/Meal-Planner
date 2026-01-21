'use client'

import { useSession, signOut } from 'next-auth/react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { TrialBanner } from '@/components/trial-banner'
import { useEffect, useState, useCallback } from 'react'
import { MealEntry, MealsLoggedData } from '@/lib/validations/meals'

interface SubscriptionData {
  trialEndDate: string | null
  subscriptionStatus: string
}

interface DailyLogData {
  id?: string
  date: string
  mealsLogged: MealsLoggedData
  caloriesConsumed: number
  caloriesTarget: number
  waterIntake: number
  weight: number | null
  mood: string | null
  notes: string | null
  isOffDay: boolean
}

export default function DashboardPage() {
  const t = useTranslations()
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [dailyLog, setDailyLog] = useState<DailyLogData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [waterUpdating, setWaterUpdating] = useState(false)

  const fetchDailyLog = useCallback(async () => {
    try {
      const res = await fetch('/api/daily-log')
      if (res.ok) {
        const data = await res.json()
        setDailyLog(data)
      }
    } catch (error) {
      console.error('Failed to fetch daily log:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
    fetchDailyLog()
  }, [fetchDailyLog])

  // Calculate stats from daily log
  const todayStats = {
    caloriesConsumed: dailyLog?.caloriesConsumed || 0,
    caloriesTarget: dailyLog?.caloriesTarget || 2000,
    mealsCompleted: dailyLog?.mealsLogged?.meals?.filter(m => m.completed).length || 0,
    mealsTotal: dailyLog?.mealsLogged?.meals?.length || 0,
    waterIntake: dailyLog?.waterIntake || 0,
    waterTarget: 8,
    currentStreak: 7, // TODO: Calculate from historical data
  }

  // Group meals by type for display
  const getMealsByType = () => {
    const meals = dailyLog?.mealsLogged?.meals || []
    const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'] as const

    return mealTypes.map(type => {
      const meal = meals.find(m => m.mealType === type)
      return {
        type: t(`meals.${type}`),
        mealType: type,
        time: meal?.time || getDefaultTime(type),
        name: meal?.name || null,
        calories: meal ? Math.round(meal.calories * (meal.servingSize || 1)) : 0,
        completed: meal?.completed || false,
        id: meal?.id || null,
      }
    })
  }

  const getDefaultTime = (type: string) => {
    switch (type) {
      case 'breakfast': return '8:00'
      case 'lunch': return '12:30'
      case 'snack': return '15:30'
      case 'dinner': return '19:00'
      default: return '12:00'
    }
  }

  const handleToggleMealComplete = async (mealId: string, completed: boolean) => {
    try {
      const res = await fetch('/api/daily-log/meals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId, completed }),
      })
      if (res.ok) {
        fetchDailyLog()
      }
    } catch (error) {
      console.error('Failed to toggle meal:', error)
    }
  }

  const handleUpdateWater = async (increment: number) => {
    const newIntake = Math.max(0, Math.min(20, todayStats.waterIntake + increment))
    setWaterUpdating(true)
    try {
      const res = await fetch('/api/daily-log', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waterIntake: newIntake }),
      })
      if (res.ok) {
        setDailyLog(prev => prev ? { ...prev, waterIntake: newIntake } : null)
      }
    } catch (error) {
      console.error('Failed to update water:', error)
    } finally {
      setWaterUpdating(false)
    }
  }

  const caloriePercentage = Math.round((todayStats.caloriesConsumed / todayStats.caloriesTarget) * 100)
  const todaysMeals = getMealsByType()

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
            <Link href="/dashboard/food-menu" className="text-gray-600 hover:text-green-600">{t('nav.meals')}</Link>
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

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
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
                    className={`h-2 rounded-full transition-all ${
                      caloriePercentage > 100 ? 'bg-red-500' : 'bg-green-500'
                    }`}
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
                      {todayStats.mealsCompleted} <span className="text-sm font-normal text-gray-500">/ {todayStats.mealsTotal || 4}</span>
                    </p>
                  </div>
                  <span className="text-2xl">🍽️</span>
                </div>
                <p className="text-sm text-green-600">
                  {todayStats.mealsTotal === 0
                    ? t('dashboard.addMeal')
                    : `${(todayStats.mealsTotal || 4) - todayStats.mealsCompleted} ${t('dashboard.mealsRemaining')}`
                  }
                </p>
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
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateWater(-1)}
                    disabled={waterUpdating || todayStats.waterIntake <= 0}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
                  >
                    -
                  </button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((todayStats.waterIntake / todayStats.waterTarget) * 100, 100)}%` }}
                    />
                  </div>
                  <button
                    onClick={() => handleUpdateWater(1)}
                    disabled={waterUpdating}
                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
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
                <Link href="/dashboard/meals/add" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  + {t('dashboard.addMeal')}
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
                        <p className="font-medium text-gray-900">
                          {meal.name || <span className="text-gray-400 italic">Not logged yet</span>}
                        </p>
                        <p className="text-sm text-gray-500">{meal.type} • {meal.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {meal.name ? (
                        <>
                          <p className="font-medium text-gray-900">{meal.calories} {t('dashboard.cal')}</p>
                          {meal.id && !meal.completed && (
                            <button
                              onClick={() => handleToggleMealComplete(meal.id!, true)}
                              className="text-sm text-green-600 hover:text-green-700"
                            >
                              {t('dashboard.markComplete')}
                            </button>
                          )}
                        </>
                      ) : (
                        <Link
                          href="/dashboard/meals/add"
                          className="text-sm text-green-600 hover:text-green-700"
                        >
                          + {t('common.add')}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4">
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
                href="/dashboard/food-menu"
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors group"
              >
                <span className="text-3xl mb-3 block">🍽️</span>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600">{t('foodMenu.title')}</h3>
                <p className="text-sm text-gray-500">{t('foodMenu.description')}</p>
              </Link>
              <Link
                href="/dashboard/reports/doctor"
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors group"
              >
                <span className="text-3xl mb-3 block">🩺</span>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{t('doctorReport.title')}</h3>
                <p className="text-sm text-gray-500">{t('doctorReport.shareWithDoctor')}</p>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
