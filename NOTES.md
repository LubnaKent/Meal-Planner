# Meal Planner - Development Notes

## Quick Links
- **Local Dev:** http://localhost:3000
- **Production:** https://meal-planner-umber-nu.vercel.app
- **GitHub:** https://github.com/LubnaKent/Meal-Planner
- **Vercel Dashboard:** https://vercel.com/lubnakents-projects/meal-planner

---

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Git
git add .
git commit -m "message"
git push origin main
```

---

## Project Status

### Completed
- [x] Project initialization with Next.js 16
- [x] Tailwind CSS setup
- [x] shadcn/ui configuration
- [x] Landing page
- [x] Login page
- [x] Registration page
- [x] Dashboard page (mock data)
- [x] TypeScript types defined
- [x] Utility functions (BMR, TDEE, BMI)
- [x] Deployed to Vercel

### In Progress
- [ ] Database setup (Prisma)
- [ ] Authentication (NextAuth.js)

### Next Up
- [ ] User profile creation flow
- [ ] Meal database with nutritional info
- [ ] Daily meal planning interface
- [ ] Reminder system
- [ ] Progress tracking charts

---

## Architecture Decisions

### Why Next.js 16?
- App Router for better layouts and loading states
- Server Components for performance
- Built-in API routes
- Easy Vercel deployment

### Why Tailwind + shadcn/ui?
- Rapid UI development
- Consistent design system
- Fully customizable components
- Great accessibility out of the box

### Database Strategy
- **Database:** Neon (Serverless PostgreSQL)
- **ORM:** Prisma
- **Why Neon?** Serverless, scales to zero, generous free tier, great Vercel integration

---

## Key Features to Remember

1. **No Judgment Zone** - Favorite snacks feature should never shame users
2. **Flexibility First** - Allow easy goal adjustments
3. **Rewards System** - Positive reinforcement over punishment
4. **Off Days** - Built-in cheat days are part of the system
5. **Global Cuisine** - Diversity in meal suggestions

---

## Environment Variables Needed

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Optional
OPENAI_API_KEY=      # For AI meal suggestions
RESEND_API_KEY=      # For email reminders
```

---

## Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Vercel Docs](https://vercel.com/docs)

---

## Ideas & Future Features

- Voice commands for logging meals
- Barcode scanner for packaged foods
- Social features (share achievements)
- Family meal planning mode
- Grocery list generation
- Integration with fitness trackers
- Recipe scaling based on servings
- Meal prep planning mode

---

## Notes

_Nxt to do om meal-planner project: 
- set up authentication

