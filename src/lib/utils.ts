import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateBMR(
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: 'male' | 'female'
): number {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2))
}

export function calculateBMI(weight: number, height: number): number {
  // weight in kg, height in cm
  const heightInMeters = height / 100
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function calculateCaloriesForGoal(
  tdee: number,
  goal: 'weight_loss' | 'maintenance' | 'muscle_gain'
): number {
  switch (goal) {
    case 'weight_loss':
      return tdee - 500 // 0.5 kg per week loss
    case 'muscle_gain':
      return tdee + 300 // Lean bulk
    default:
      return tdee
  }
}
