import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  logMealSchema,
  toggleMealCompleteSchema,
  deleteMealSchema,
  MealsLoggedData,
  MealEntry
} from '@/lib/validations/meals'
import { ZodError } from 'zod'
import { randomUUID } from 'crypto'
import { Prisma } from '@prisma/client'

// Helper to get today's date in YYYY-MM-DD format
function getDateString(dateParam?: string): string {
  if (dateParam) return dateParam
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// Helper to parse mealsLogged JSON
function parseMealsLogged(data: Prisma.JsonValue | null): MealsLoggedData {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { meals: [] }
  }
  const obj = data as Record<string, unknown>
  if (Array.isArray(obj.meals)) {
    return { meals: obj.meals as MealEntry[] }
  }
  return { meals: [] }
}

// POST - Add a new meal to the daily log
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = logMealSchema.parse(body)
    const dateString = getDateString(validatedData.date)

    // Get or create daily log
    let dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(dateString),
        },
      },
    })

    // Get user's profile for calorie target
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { dailyCalories: true },
    })

    const mealsData: MealsLoggedData = parseMealsLogged(dailyLog?.mealsLogged ?? null)

    // Create new meal entry with generated ID
    const newMeal: MealEntry = {
      ...validatedData.meal,
      id: validatedData.meal.id || randomUUID(),
      time: validatedData.meal.time || new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
    }

    mealsData.meals.push(newMeal)

    // Calculate new calorie total
    const caloriesConsumed = mealsData.meals.reduce((sum, meal) => {
      return sum + (meal.completed ? meal.calories * (meal.servingSize || 1) : 0)
    }, 0)

    // Convert to Prisma JSON format
    const mealsJson = JSON.parse(JSON.stringify(mealsData)) as Prisma.InputJsonValue

    // Upsert daily log with new meal
    dailyLog = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(dateString),
        },
      },
      update: {
        mealsLogged: mealsJson,
        caloriesConsumed,
      },
      create: {
        userId: session.user.id,
        date: new Date(dateString),
        mealsLogged: mealsJson,
        caloriesConsumed,
        caloriesTarget: profile?.dailyCalories || 2000,
      },
    })

    return NextResponse.json({
      success: true,
      meal: newMeal,
      dailyLog: {
        id: dailyLog.id,
        date: dateString,
        caloriesConsumed,
        mealsCount: mealsData.meals.length,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Failed to log meal:', error)
    return NextResponse.json({ error: 'Failed to log meal' }, { status: 500 })
  }
}

// PATCH - Toggle meal completion status
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = toggleMealCompleteSchema.parse(body)
    const dateString = getDateString(validatedData.date)

    // Get daily log
    const dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(dateString),
        },
      },
    })

    if (!dailyLog) {
      return NextResponse.json({ error: 'Daily log not found' }, { status: 404 })
    }

    const mealsData = parseMealsLogged(dailyLog.mealsLogged)
    const mealIndex = mealsData.meals.findIndex(m => m.id === validatedData.mealId)

    if (mealIndex === -1) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    // Update meal completion status
    mealsData.meals[mealIndex].completed = validatedData.completed

    // Recalculate calories
    const caloriesConsumed = mealsData.meals.reduce((sum, meal) => {
      return sum + (meal.completed ? meal.calories * (meal.servingSize || 1) : 0)
    }, 0)

    // Convert to Prisma JSON format
    const mealsJson = JSON.parse(JSON.stringify(mealsData)) as Prisma.InputJsonValue

    // Update daily log
    await prisma.dailyLog.update({
      where: { id: dailyLog.id },
      data: {
        mealsLogged: mealsJson,
        caloriesConsumed,
      },
    })

    return NextResponse.json({
      success: true,
      meal: mealsData.meals[mealIndex],
      caloriesConsumed,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Failed to update meal:', error)
    return NextResponse.json({ error: 'Failed to update meal' }, { status: 500 })
  }
}

// DELETE - Remove a meal from the daily log
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = deleteMealSchema.parse(body)
    const dateString = getDateString(validatedData.date)

    // Get daily log
    const dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(dateString),
        },
      },
    })

    if (!dailyLog) {
      return NextResponse.json({ error: 'Daily log not found' }, { status: 404 })
    }

    const mealsData = parseMealsLogged(dailyLog.mealsLogged)
    const mealIndex = mealsData.meals.findIndex(m => m.id === validatedData.mealId)

    if (mealIndex === -1) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    // Remove meal
    mealsData.meals.splice(mealIndex, 1)

    // Recalculate calories
    const caloriesConsumed = mealsData.meals.reduce((sum, meal) => {
      return sum + (meal.completed ? meal.calories * (meal.servingSize || 1) : 0)
    }, 0)

    // Convert to Prisma JSON format
    const mealsJson = JSON.parse(JSON.stringify(mealsData)) as Prisma.InputJsonValue

    // Update daily log
    await prisma.dailyLog.update({
      where: { id: dailyLog.id },
      data: {
        mealsLogged: mealsJson,
        caloriesConsumed,
      },
    })

    return NextResponse.json({
      success: true,
      caloriesConsumed,
      mealsCount: mealsData.meals.length,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Failed to delete meal:', error)
    return NextResponse.json({ error: 'Failed to delete meal' }, { status: 500 })
  }
}
