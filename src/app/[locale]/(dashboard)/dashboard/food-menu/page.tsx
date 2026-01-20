'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ugandanFoodMenu, foodCategories, type UgandanDish } from '@/data/ugandan-food-menu'

type CategoryType = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'traditional'

export default function FoodMenuPage() {
  const t = useTranslations()
  const locale = useLocale() as 'en' | 'sw' | 'lg' | 'luo' | 'ach'
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDishes = ugandanFoodMenu.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory
    const matchesSearch = dish.name[locale]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.name.en.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getDishName = (dish: UgandanDish) => dish.name[locale] || dish.name.en
  const getDishDescription = (dish: UgandanDish) => dish.description[locale] || dish.description.en

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <span className="text-xl font-bold text-green-700">{t('common.appName')}</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-green-600">{t('nav.dashboard')}</Link>
            <Link href="/dashboard/food-menu" className="text-green-600 font-medium">{t('nav.meals')}</Link>
            <Link href="/dashboard/progress" className="text-gray-600 hover:text-green-600">{t('nav.progress')}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('foodMenu.title')}</h1>
          <p className="text-gray-600">{t('foodMenu.description')}</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('common.search') || 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-96 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {foodCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as CategoryType)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t(category.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Dish Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <span className="text-6xl">
                  {dish.category === 'breakfast' ? '🍳' :
                    dish.category === 'lunch' ? '🍲' :
                    dish.category === 'dinner' ? '🍽️' :
                    dish.category === 'snack' ? '🥜' :
                    '🥘'}
                </span>
              </div>

              <div className="p-4">
                {/* Name and Tags */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{getDishName(dish)}</h3>
                  <div className="flex gap-1">
                    {dish.isVegetarian && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        🥬 {t('foodMenu.vegetarian')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{getDishDescription(dish)}</p>

                {/* Nutrition Info */}
                <div className="grid grid-cols-4 gap-2 mb-3 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">{t('foodMenu.calories')}</p>
                    <p className="font-semibold text-gray-900">{dish.calories}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">{t('foodMenu.protein')}</p>
                    <p className="font-semibold text-gray-900">{dish.protein}g</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">{t('foodMenu.carbs')}</p>
                    <p className="font-semibold text-gray-900">{dish.carbs}g</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">{t('foodMenu.fats')}</p>
                    <p className="font-semibold text-gray-900">{dish.fats}g</p>
                  </div>
                </div>

                {/* Prep Time and Region */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>⏱️ {dish.prepTime} {t('foodMenu.minutes')}</span>
                  {dish.region && <span>📍 {dish.region}</span>}
                </div>

                {/* Health Benefits */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {dish.benefits.slice(0, 3).map((benefit, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                    >
                      ✓ {benefit}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
                  {t('dashboard.addMeal')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🍽️</span>
            <p className="text-gray-500">No dishes found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
