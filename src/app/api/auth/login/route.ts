import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { loginSchema } from '@/lib/validations/auth'
import { rateLimit, getClientIp, rateLimitPresets } from '@/lib/rate-limit'
import { ZodError } from 'zod'

export async function POST(request: Request) {
  try {
    // Rate limiting - stricter for login to prevent brute force
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`login:${clientIp}`, rateLimitPresets.auth)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitResult.resetIn
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.resetIn.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validatedData = loginSchema.parse(body)
    const { email, password } = validatedData

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Use constant-time comparison approach - always check password even if user not found
    // This prevents timing attacks that could reveal if an email exists
    const dummyHash = '$2a$12$dummy.hash.for.timing.attack.prevention'
    const passwordToCheck = user?.password || dummyHash
    const passwordMatch = await bcrypt.compare(password, passwordToCheck)

    if (!user || !user.password || !passwordMatch) {
      // Generic error message to prevent email enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return success with user data (actual session creation happens via NextAuth signIn)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        }
      }
    )
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
      return NextResponse.json(
        { error: 'Validation failed', details: fieldErrors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
