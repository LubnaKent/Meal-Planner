import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { updateDailyLogSchema, MealsLoggedData, MealEntry } from '@/lib/validations/meals'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

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

// Helper to get today's date in YYYY-MM-DD format
function getDateString(dateParam?: string): string {
  if (dateParam) return dateParam
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// GET - Fetch daily log for a specific date
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const dateString = getDateString(dateParam || undefined)

    // Get or create daily log for the date
    let dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(dateString),
        },
      },
    })

    // If no log exists for today, return default structure
    if (!dailyLog) {
      // Get user's profile for calorie target
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { dailyCalories: true },
      })

      return NextResponse.json({
        date: dateString,
        mealsLogged: { meals: [] },
        caloriesConsumed: 0,
        caloriesTarget: profile?.dailyCalories || 2000,
        waterIntake: 0,
        weight: null,
        mood: null,
        notes: null,
        isOffDay: false,
      })
    }

    // Calculate totals from logged meals
    const mealsData = parseMealsLogged(dailyLog.mealsLogged)
    const caloriesConsumed = mealsData.meals.reduce((sum, meal) => {
      return sum + (meal.completed ? meal.calories * (meal.servingSize || 1) : 0)
    }, 0)

    return NextResponse.json({
      id: dailyLog.id,
      date: dateString,
      mealsLogged: mealsData,
      caloriesConsumed,
      caloriesTarget: dailyLog.caloriesTarget || 2000,
      waterIntake: dailyLog.waterIntake || 0,
      weight: dailyLog.weight,
      mood: dailyLog.mood,
      notes: dailyLog.notes,
      isOffDay: dailyLog.isOffDay,
    })
  } catch (error) {
    console.error('Failed to fetch daily log:', error)
    return NextResponse.json({ error: 'Failed to fetch daily log' }, { status: 500 })
  }
}

// PATCH - Update daily log (weight, water, mood, notes)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateDailyLogSchema.parse(body)
    const dateString = getDateString(validatedData.date)

    // Upsert daily log
    const dailyLog = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(dateString),
        },
      },
      update: {
        ...(validatedData.weight !== undefined && { weight: validatedData.weight }),
        ...(validatedData.waterIntake !== undefined && { waterIntake: validatedData.waterIntake }),
        ...(validatedData.mood !== undefined && { mood: validatedData.mood }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
        ...(validatedData.isOffDay !== undefined && { isOffDay: validatedData.isOffDay }),
      },
      create: {
        userId: session.user.id,
        date: new Date(dateString),
        weight: validatedData.weight,
        waterIntake: validatedData.waterIntake,
        mood: validatedData.mood,
        notes: validatedData.notes,
        isOffDay: validatedData.isOffDay ?? false,
        mealsLogged: JSON.parse(JSON.stringify({ meals: [] })) as Prisma.InputJsonValue,
      },
    })

    return NextResponse.json({
      success: true,
      dailyLog: {
        id: dailyLog.id,
        date: dateString,
        weight: dailyLog.weight,
        waterIntake: dailyLog.waterIntake,
        mood: dailyLog.mood,
        notes: dailyLog.notes,
        isOffDay: dailyLog.isOffDay,
      },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Failed to update daily log:', error)
    return NextResponse.json({ error: 'Failed to update daily log' }, { status: 500 })
  }
}
