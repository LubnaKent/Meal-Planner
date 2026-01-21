/**
 * Simple in-memory rate limiter for API routes.
 * For production at scale, consider using Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number
  /** Time window in seconds */
  windowSeconds: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (e.g., IP address)
 * @param config - Rate limit configuration
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const key = identifier

  const existing = rateLimitStore.get(key)

  // If no existing entry or window has expired, create new entry
  if (!existing || existing.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowSeconds,
    }
  }

  // Check if limit exceeded
  if (existing.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((existing.resetTime - now) / 1000),
    }
  }

  // Increment count
  existing.count++
  rateLimitStore.set(key, existing)

  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetIn: Math.ceil((existing.resetTime - now) / 1000),
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback for local development
  return 'unknown'
}

// Preset configurations for common use cases
export const rateLimitPresets = {
  /** Strict limit for auth endpoints: 5 requests per minute */
  auth: { maxRequests: 5, windowSeconds: 60 },
  /** Standard API limit: 30 requests per minute */
  api: { maxRequests: 30, windowSeconds: 60 },
  /** Relaxed limit: 100 requests per minute */
  relaxed: { maxRequests: 100, windowSeconds: 60 },
}
