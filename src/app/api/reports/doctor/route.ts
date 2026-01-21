import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { MealEntry } from '@/lib/validations/meals'
import { Prisma } from '@prisma/client'

// Helper to parse mealsLogged JSON
function parseMealsLogged(data: Prisma.JsonValue | null): { meals: MealEntry[] } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { meals: [] }
  }
  const obj = data as Record<string, unknown>
  if (Array.isArray(obj.meals)) {
    return { meals: obj.meals as MealEntry[] }
  }
  return { meals: [] }
}

// GET - Generate doctor report data
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const daysParam = searchParams.get('days') || '30'
    const days = Math.min(Math.max(parseInt(daysParam), 7), 90) // Between 7 and 90 days

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        currentWeight: true,
        targetWeight: true,
        height: true,
        age: true,
        gender: true,
        activityLevel: true,
        goalType: true,
        dailyCalories: true,
        dietaryPrefs: true,
        allergies: true,
        medicalConditions: true,
        medications: true,
      },
    })

    // Fetch daily logs for the period
    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    })

    // Process logs for report
    const processedLogs = dailyLogs.map((log) => {
      const mealsData = parseMealsLogged(log.mealsLogged)
      const completedMeals = mealsData.meals.filter((m) => m.completed)

      // Calculate nutrition totals
      const totals = completedMeals.reduce(
        (acc, meal) => {
          const servingSize = meal.servingSize || 1
          return {
            calories: acc.calories + meal.calories * servingSize,
            protein: acc.protein + (meal.protein || 0) * servingSize,
            carbs: acc.carbs + (meal.carbs || 0) * servingSize,
            fats: acc.fats + (meal.fats || 0) * servingSize,
            fiber: acc.fiber + (meal.fiber || 0) * servingSize,
          }
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
      )

      return {
        date: log.date.toISOString().split('T')[0],
        weight: log.weight,
        waterIntake: log.waterIntake,
        mood: log.mood,
        isOffDay: log.isOffDay,
        mealsCount: completedMeals.length,
        nutrition: {
          calories: Math.round(totals.calories),
          protein: Math.round(totals.protein),
          carbs: Math.round(totals.carbs),
          fats: Math.round(totals.fats),
          fiber: Math.round(totals.fiber),
        },
        meals: completedMeals.map((m) => ({
          name: m.name,
          mealType: m.mealType,
          calories: Math.round(m.calories * (m.servingSize || 1)),
          time: m.time,
        })),
      }
    })

    // Calculate averages
    const logsWithData = processedLogs.filter((l) => l.mealsCount > 0)
    const averages = logsWithData.length > 0
      ? {
          dailyCalories: Math.round(
            logsWithData.reduce((sum, l) => sum + l.nutrition.calories, 0) / logsWithData.length
          ),
          dailyProtein: Math.round(
            logsWithData.reduce((sum, l) => sum + l.nutrition.protein, 0) / logsWithData.length
          ),
          dailyCarbs: Math.round(
            logsWithData.reduce((sum, l) => sum + l.nutrition.carbs, 0) / logsWithData.length
          ),
          dailyFats: Math.round(
            logsWithData.reduce((sum, l) => sum + l.nutrition.fats, 0) / logsWithData.length
          ),
          dailyFiber: Math.round(
            logsWithData.reduce((sum, l) => sum + l.nutrition.fiber, 0) / logsWithData.length
          ),
          dailyWater: Math.round(
            logsWithData.reduce((sum, l) => sum + (l.waterIntake || 0), 0) / logsWithData.length * 10
          ) / 10,
          mealsPerDay: Math.round(
            logsWithData.reduce((sum, l) => sum + l.mealsCount, 0) / logsWithData.length * 10
          ) / 10,
        }
      : null

    // Weight tracking
    const logsWithWeight = processedLogs.filter((l) => l.weight !== null)
    const weightTrend = logsWithWeight.length >= 2
      ? {
          startWeight: logsWithWeight[logsWithWeight.length - 1].weight,
          endWeight: logsWithWeight[0].weight,
          change: Math.round(
            ((logsWithWeight[0].weight || 0) - (logsWithWeight[logsWithWeight.length - 1].weight || 0)) * 10
          ) / 10,
        }
      : null

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      reportPeriod: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days,
      },
      patient: {
        name: session.user.name,
        email: session.user.email,
      },
      profile: profile
        ? {
            currentWeight: profile.currentWeight,
            targetWeight: profile.targetWeight,
            height: profile.height,
            age: profile.age,
            gender: profile.gender,
            activityLevel: profile.activityLevel,
            goalType: profile.goalType,
            dailyCalorieTarget: profile.dailyCalories,
            dietaryPreferences: profile.dietaryPrefs,
            allergies: profile.allergies,
            medicalConditions: profile.medicalConditions,
            medications: profile.medications,
          }
        : null,
      summary: {
        totalDaysLogged: logsWithData.length,
        averages,
        weightTrend,
      },
      dailyLogs: processedLogs,
    })
  } catch (error) {
    console.error('Failed to generate doctor report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
