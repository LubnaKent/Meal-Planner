'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session } = useSession()

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
    { type: 'Breakfast', time: '8:00 AM', name: 'Oatmeal with Berries', calories: 350, completed: true },
    { type: 'Lunch', time: '12:30 PM', name: 'Grilled Chicken Salad', calories: 450, completed: true },
    { type: 'Snack', time: '3:30 PM', name: 'Greek Yogurt', calories: 150, completed: false },
    { type: 'Dinner', time: '7:00 PM', name: 'Salmon with Vegetables', calories: 550, completed: false },
  ]

  const caloriePercentage = Math.round((todayStats.caloriesConsumed / todayStats.caloriesTarget) * 100)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <span className="text-xl font-bold text-green-700">MealPlanner</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-green-600 font-medium">Dashboard</Link>
            <Link href="/dashboard/meals" className="text-gray-600 hover:text-green-600">Meals</Link>
            <Link href="/dashboard/progress" className="text-gray-600 hover:text-green-600">Progress</Link>
            <Link href="/dashboard/reminders" className="text-gray-600 hover:text-green-600">Reminders</Link>
            <Link href="/dashboard/rewards" className="text-gray-600 hover:text-green-600">Rewards</Link>
          </nav>
          <div className="flex items-center gap-4">
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
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Sign out
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
          <p className="text-gray-600">Here&apos;s your meal plan for today. You&apos;re doing great!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Calories Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Calories</p>
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
            <p className="text-xs text-gray-500 mt-2">{caloriePercentage}% of daily goal</p>
          </div>

          {/* Meals Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-500">Meals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.mealsCompleted} <span className="text-sm font-normal text-gray-500">/ {todayStats.mealsTotal}</span>
                </p>
              </div>
              <span className="text-2xl">🍽️</span>
            </div>
            <p className="text-sm text-green-600">{todayStats.mealsTotal - todayStats.mealsCompleted} meals remaining</p>
          </div>

          {/* Water Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-500">Water</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayStats.waterIntake} <span className="text-sm font-normal text-gray-500">/ {todayStats.waterTarget} glasses</span>
                </p>
              </div>
              <span className="text-2xl">💧</span>
            </div>
            <p className="text-sm text-blue-600">{todayStats.waterTarget - todayStats.waterIntake} more to go</p>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm text-white">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-green-100">Current Streak</p>
                <p className="text-2xl font-bold">{todayStats.currentStreak} days</p>
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-sm text-green-100">Keep it up! You&apos;re on fire!</p>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Meals</h2>
            <Link href="/dashboard/meals" className="text-green-600 hover:text-green-700 text-sm font-medium">
              View all →
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
                  <p className="font-medium text-gray-900">{meal.calories} cal</p>
                  {!meal.completed && (
                    <button className="text-sm text-green-600 hover:text-green-700">Mark complete</button>
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
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Add Meal</h3>
            <p className="text-sm text-gray-500">Log a meal you&apos;ve eaten</p>
          </Link>
          <Link
            href="/dashboard/progress"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors group"
          >
            <span className="text-3xl mb-3 block">⚖️</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Log Weight</h3>
            <p className="text-sm text-gray-500">Track your progress</p>
          </Link>
          <Link
            href="/dashboard/snacks"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors group"
          >
            <span className="text-3xl mb-3 block">🍫</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Favorite Snacks</h3>
            <p className="text-sm text-gray-500">Your guilt-free treats</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
