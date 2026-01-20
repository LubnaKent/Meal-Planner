import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        trialStartDate: true,
        trialEndDate: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionEndDate: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Check if trial has expired and update status if needed
    if (profile.subscriptionStatus === 'trial' && profile.trialEndDate) {
      const now = new Date()
      if (now > new Date(profile.trialEndDate)) {
        await prisma.profile.update({
          where: { userId: session.user.id },
          data: { subscriptionStatus: 'expired' },
        })
        profile.subscriptionStatus = 'expired'
      }
    }

    return NextResponse.json({
      trialStartDate: profile.trialStartDate,
      trialEndDate: profile.trialEndDate,
      subscriptionStatus: profile.subscriptionStatus,
      subscriptionPlan: profile.subscriptionPlan,
      subscriptionEndDate: profile.subscriptionEndDate,
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
