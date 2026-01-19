export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  userId: string
  currentWeight?: number
  targetWeight?: number
  height?: number
  age?: number
  gender?: 'male' | 'female' | 'other'
  activityLevel?: string
  goalType?: 'weight_loss' | 'maintenance' | 'muscle_gain'
  dailyCalories?: number
  dietaryPrefs: string[]
  allergies: string[]
}

export interface Meal {
  id: string
  name: string
  description?: string
  calories: number
  protein?: number
  carbs?: number
  fats?: number
  fiber?: number
  benefits: string[]
  cuisine?: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  imageUrl?: string
  recipe?: string
  ingredients: string[]
  prepTime?: number
  isGlobal: boolean
}

export interface DailyLog {
  id: string
  userId: string
  date: Date
  weight?: number
  caloriesConsumed?: number
  caloriesTarget?: number
  waterIntake?: number
  mealsLogged: MealLogEntry[]
  notes?: string
  mood?: 'great' | 'good' | 'okay' | 'bad'
  isOffDay: boolean
}

export interface MealLogEntry {
  mealId: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string
  completed: boolean
  skipped: boolean
  madeUp: boolean
}

export interface Reminder {
  id: string
  userId: string
  type: 'meal' | 'weight' | 'water' | 'goal_check'
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string
  days: string[]
  isActive: boolean
  message?: string
}

export interface Reward {
  id: string
  userId: string
  type: 'streak' | 'milestone' | 'daily_treat' | 'off_day'
  name: string
  description?: string
  earnedAt: Date
  snackReward?: string
  offDayReward: boolean
}

export interface FavoriteSnack {
  id: string
  userId: string
  name: string
  calories?: number
  notes?: string
  imageUrl?: string
}

export interface WeeklyStats {
  weekStart: Date
  weekEnd: Date
  averageCalories: number
  totalMealsPlanned: number
  totalMealsCompleted: number
  weightChange?: number
  streakDays: number
  offDaysTaken: number
}

export interface MonthlyReport {
  month: number
  year: number
  startWeight?: number
  endWeight?: number
  averageDailyCalories: number
  goalAdherence: number
  topCuisines: string[]
  achievements: string[]
}
