import { z } from 'zod'

// Schema for a single logged meal entry
export const mealEntrySchema = z.object({
  id: z.string().optional(), // Generated if not provided
  foodId: z.string().optional(), // Reference to ugandan food menu item
  name: z.string().min(1, 'Meal name is required').max(200),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(500).optional(),
  carbs: z.number().min(0).max(1000).optional(),
  fats: z.number().min(0).max(500).optional(),
  fiber: z.number().min(0).max(100).optional(),
  servingSize: z.number().min(0.1).max(10).default(1),
  time: z.string().optional(), // HH:MM format
  notes: z.string().max(500).optional(),
  completed: z.boolean().default(true),
})

// Schema for logging a new meal
export const logMealSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  meal: mealEntrySchema,
})

// Schema for updating water intake
export const updateWaterSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  waterIntake: z.number().min(0).max(50),
})

// Schema for updating daily log
export const updateDailyLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  weight: z.number().min(20).max(500).optional(),
  waterIntake: z.number().min(0).max(50).optional(),
  notes: z.string().max(1000).optional(),
  mood: z.enum(['great', 'good', 'okay', 'bad']).optional(),
  isOffDay: z.boolean().optional(),
})

// Schema for marking a meal as complete/incomplete
export const toggleMealCompleteSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  mealId: z.string().min(1, 'Meal ID is required'),
  completed: z.boolean(),
})

// Schema for deleting a meal
export const deleteMealSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  mealId: z.string().min(1, 'Meal ID is required'),
})

// Types
export type MealEntry = z.infer<typeof mealEntrySchema>
export type LogMealInput = z.infer<typeof logMealSchema>
export type UpdateWaterInput = z.infer<typeof updateWaterSchema>
export type UpdateDailyLogInput = z.infer<typeof updateDailyLogSchema>
export type ToggleMealCompleteInput = z.infer<typeof toggleMealCompleteSchema>
export type DeleteMealInput = z.infer<typeof deleteMealSchema>

// Interface for the mealsLogged JSON field in DailyLog
export interface MealsLoggedData {
  meals: MealEntry[]
}
