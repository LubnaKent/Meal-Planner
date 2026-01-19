export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const
export type MealType = typeof MEAL_TYPES[number]

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Light (exercise 1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
  { value: 'active', label: 'Active (exercise 6-7 days/week)' },
  { value: 'very_active', label: 'Very Active (hard exercise daily)' },
] as const

export const GOAL_TYPES = [
  { value: 'weight_loss', label: 'Weight Loss', icon: '📉' },
  { value: 'maintenance', label: 'Maintain Weight', icon: '⚖️' },
  { value: 'muscle_gain', label: 'Build Muscle', icon: '💪' },
] as const

export const DIETARY_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Gluten-Free',
  'Dairy-Free',
  'Halal',
  'Kosher',
  'Low-Carb',
  'Low-Fat',
  'Mediterranean',
] as const

export const CUISINES = [
  'American',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Greek',
  'French',
  'Spanish',
  'Korean',
  'Vietnamese',
  'Middle Eastern',
  'African',
  'Caribbean',
  'Brazilian',
  'German',
  'British',
  'Australian',
  'Mediterranean',
] as const

export const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
] as const

export const REWARD_TYPES = {
  STREAK: 'streak',
  MILESTONE: 'milestone',
  DAILY_TREAT: 'daily_treat',
  WEEKLY_BONUS: 'weekly_bonus',
  OFF_DAY: 'off_day',
} as const

export const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 90, 180, 365] as const
