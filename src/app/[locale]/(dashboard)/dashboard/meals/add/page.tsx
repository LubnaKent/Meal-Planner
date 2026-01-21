'use client'

import { useState, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ugandanFoodMenu, UgandanDish } from '@/data/ugandan-food-menu'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface CustomMeal {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
}

export default function AddMealPage() {
  const t = useTranslations()
  const locale = useLocale() as 'en' | 'sw' | 'lg' | 'luo' | 'ach'
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast')
  const [selectedDish, setSelectedDish] = useState<UgandanDish | null>(null)
  const [servingSize, setServingSize] = useState(1)
  const [isCustomMeal, setIsCustomMeal] = useState(false)
  const [customMeal, setCustomMeal] = useState<CustomMeal>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Filter dishes based on search and meal type
  const filteredDishes = useMemo(() => {
    return ugandanFoodMenu.filter((dish) => {
      const matchesSearch =
        searchQuery === '' ||
        dish.name[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.name.en.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType =
        dish.category === selectedMealType ||
        dish.category === 'traditional' ||
        (selectedMealType === 'snack' && dish.category === 'snack')

      return matchesSearch && matchesType
    })
  }, [searchQuery, selectedMealType, locale])

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)

    try {
      const mealData = isCustomMeal
        ? {
            name: customMeal.name,
            calories: customMeal.calories,
            protein: customMeal.protein,
            carbs: customMeal.carbs,
            fats: customMeal.fats,
            fiber: customMeal.fiber,
          }
        : selectedDish
        ? {
            foodId: selectedDish.id,
            name: selectedDish.name[locale],
            calories: selectedDish.calories,
            protein: selectedDish.protein,
            carbs: selectedDish.carbs,
            fats: selectedDish.fats,
            fiber: selectedDish.fiber,
          }
        : null

      if (!mealData || (!isCustomMeal && !selectedDish) || (isCustomMeal && !customMeal.name)) {
        setError(t('mealLogging.selectMeal'))
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/daily-log/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal: {
            ...mealData,
            mealType: selectedMealType,
            servingSize,
            completed: true,
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to log meal')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateNutrition = () => {
    if (isCustomMeal) {
      return {
        calories: Math.round(customMeal.calories * servingSize),
        protein: Math.round(customMeal.protein * servingSize),
        carbs: Math.round(customMeal.carbs * servingSize),
        fats: Math.round(customMeal.fats * servingSize),
        fiber: Math.round(customMeal.fiber * servingSize),
      }
    }
    if (selectedDish) {
      return {
        calories: Math.round(selectedDish.calories * servingSize),
        protein: Math.round(selectedDish.protein * servingSize),
        carbs: Math.round(selectedDish.carbs * servingSize),
        fats: Math.round(selectedDish.fats * servingSize),
        fiber: Math.round(selectedDish.fiber * servingSize),
      }
    }
    return { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
  }

  const nutrition = calculateNutrition()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← {t('common.back')}
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{t('mealLogging.title')}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Meal Type Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('mealLogging.mealType')}</h2>
          <div className="grid grid-cols-4 gap-2">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMealType(type)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedMealType === type
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl block mb-1">
                  {type === 'breakfast' && '🌅'}
                  {type === 'lunch' && '☀️'}
                  {type === 'dinner' && '🌙'}
                  {type === 'snack' && '🍎'}
                </span>
                <span className="text-sm">{t(`meals.${type}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Custom/Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsCustomMeal(false)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                !isCustomMeal
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('mealLogging.fromMenu')}
            </button>
            <button
              onClick={() => setIsCustomMeal(true)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                isCustomMeal
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('mealLogging.customMeal')}
            </button>
          </div>

          {!isCustomMeal ? (
            <>
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={t('mealLogging.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Food List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredDishes.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">{t('mealLogging.noResults')}</p>
                ) : (
                  filteredDishes.map((dish) => (
                    <button
                      key={dish.id}
                      onClick={() => setSelectedDish(dish)}
                      className={`w-full p-3 rounded-lg text-left transition-colors flex justify-between items-center ${
                        selectedDish?.id === dish.id
                          ? 'bg-green-50 border-2 border-green-500'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{dish.name[locale]}</p>
                        <p className="text-sm text-gray-500">
                          {dish.calories} {t('foodMenu.calories')} • {dish.protein}g {t('foodMenu.protein')}
                        </p>
                      </div>
                      {selectedDish?.id === dish.id && (
                        <span className="text-green-500 text-xl">✓</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Custom Meal Form */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('mealLogging.mealName')}
                </label>
                <input
                  type="text"
                  value={customMeal.name}
                  onChange={(e) => setCustomMeal({ ...customMeal, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder={t('mealLogging.enterMealName')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('foodMenu.calories')}
                  </label>
                  <input
                    type="number"
                    value={customMeal.calories || ''}
                    onChange={(e) => setCustomMeal({ ...customMeal, calories: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('foodMenu.protein')} (g)
                  </label>
                  <input
                    type="number"
                    value={customMeal.protein || ''}
                    onChange={(e) => setCustomMeal({ ...customMeal, protein: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('foodMenu.carbs')} (g)
                  </label>
                  <input
                    type="number"
                    value={customMeal.carbs || ''}
                    onChange={(e) => setCustomMeal({ ...customMeal, carbs: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('foodMenu.fats')} (g)
                  </label>
                  <input
                    type="number"
                    value={customMeal.fats || ''}
                    onChange={(e) => setCustomMeal({ ...customMeal, fats: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Serving Size */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('mealLogging.servingSize')}</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setServingSize(Math.max(0.5, servingSize - 0.5))}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-xl"
            >
              -
            </button>
            <span className="text-2xl font-bold text-gray-900 min-w-[80px] text-center">
              {servingSize}x
            </span>
            <button
              onClick={() => setServingSize(Math.min(5, servingSize + 0.5))}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Nutrition Summary */}
        {(selectedDish || (isCustomMeal && customMeal.calories > 0)) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('mealLogging.nutritionSummary')}</h2>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <p className="text-lg font-bold text-orange-600">{nutrition.calories}</p>
                <p className="text-xs text-gray-500">{t('foodMenu.calories')}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <p className="text-lg font-bold text-red-600">{nutrition.protein}g</p>
                <p className="text-xs text-gray-500">{t('foodMenu.protein')}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <p className="text-lg font-bold text-yellow-600">{nutrition.carbs}g</p>
                <p className="text-xs text-gray-500">{t('foodMenu.carbs')}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <p className="text-lg font-bold text-purple-600">{nutrition.fats}g</p>
                <p className="text-xs text-gray-500">{t('foodMenu.fats')}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-600">{nutrition.fiber}g</p>
                <p className="text-xs text-gray-500">{t('foodMenu.fiber')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || (!selectedDish && !isCustomMeal) || (isCustomMeal && !customMeal.name)}
          className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('common.loading') : t('mealLogging.logMeal')}
        </button>
      </main>
    </div>
  )
}
