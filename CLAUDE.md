# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production (runs prisma generate first)
npm run lint             # Run ESLint
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed database
```

## Tech Stack

- **Framework:** Next.js 16 with App Router, TypeScript
- **Database:** PostgreSQL via Neon (Vercel Postgres) with Prisma ORM
- **Authentication:** NextAuth.js v5 (JWT strategy, credentials provider)
- **Styling:** Tailwind CSS with shadcn/ui components
- **i18n:** next-intl with 5 locales (en, sw, lg, luo, ach)

## Architecture

### Routing Structure
- `src/app/[locale]/` - All pages are locale-prefixed (en is default, no URL prefix)
- `src/app/[locale]/(auth)/` - Login and register pages
- `src/app/[locale]/(dashboard)/` - Protected dashboard pages
- `src/app/api/` - API routes (not locale-prefixed)

### Key Directories
- `src/lib/` - Auth config (`auth.ts`), Prisma client (`db.ts`), utilities
- `src/components/` - Reusable React components including providers
- `src/i18n/` - Internationalization routing and navigation config
- `src/types/` - TypeScript interfaces
- `src/data/` - Static meal/food data
- `messages/` - Translation JSON files per locale
- `prisma/schema.prisma` - Database schema

### Authentication Flow
- Public routes: `/`, `/login`, `/register`, `/dashboard/food-menu`
- Protected routes: All other `/dashboard/*` pages
- Middleware handles both i18n locale detection and auth redirects
- User registration creates both User and Profile with 30-day trial

### Database Models
Core models: User, Profile (extended user data with trial/subscription), Meal, GlobalMeal (system-wide meals with multi-language), DailyLog, Reminder, Workout, Reward

### Path Alias
Use `@/*` to import from `./src/*` (e.g., `import { db } from '@/lib/db'`)

## Environment Variables

Required:
- `POSTGRES_PRISMA_URL` - Pooled database connection
- `POSTGRES_URL_NON_POOLING` - For migrations
- `NEXTAUTH_SECRET` - JWT signing key
- `NEXTAUTH_URL` - Auth callback URL

## ToDo list
- always create a todo list for the work you start so that I can monitor the progress
    