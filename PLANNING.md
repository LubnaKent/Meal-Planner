# Meal Planner Application - Project Planning

## Project Overview
A comprehensive meal planning application that helps users plan, track, and achieve their health goals through intelligent meal suggestions, reminders, and progress tracking.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand or React Context
- **UI Components**: shadcn/ui (built on Radix UI)
- **Charts/Analytics**: Recharts or Chart.js
- **Notifications**: React Hot Toast / Sonner

### Backend
- **API Routes**: Next.js API Routes
- **Authentication**: NextAuth.js (Auth.js)
- **Database ORM**: Prisma

### Database
- **Provider**: Neon (Serverless PostgreSQL)
- **ORM**: Prisma
- **Features**: Auto-scaling, branching, generous free tier

### Deployment
- **Platform**: Vercel
- **Environment**: Edge Functions where applicable

### Additional Services (Future)
- **Push Notifications**: Web Push API / OneSignal
- **Email Reminders**: Resend / SendGrid
- **AI Meal Suggestions**: OpenAI API (optional)

---

## Feature Breakdown

### 1. User Profile & Goals System
- User registration and authentication
- Health profile setup (weight, height, age, activity level)
- Goal setting (weight loss, maintenance, muscle gain)
- Target weight and timeline configuration
- Dietary preferences and restrictions
- Allergies management

### 2. Meal Planning & Suggestions
- Daily meal planning interface (breakfast, lunch, dinner, snacks)
- Detailed meal information with:
  - Calorie count
  - Macronutrients (protein, carbs, fats)
  - Micronutrients (vitamins, minerals)
  - Health benefits
- Global cuisine diversity (meals from around the world)
- Personalized meal suggestions based on:
  - User goals
  - Dietary preferences
  - Caloric needs
  - Previous meal history

### 3. Reminder System
- Meal time reminders (push notifications)
- Customizable reminder schedules
- Missed meal detection and follow-up reminders
- Make-up meal suggestions for skipped meals
- Red flag alerts when deviating from goals

### 4. Tracking & Logging
- **Daily Log**:
  - Meals consumed
  - Calorie intake
  - Water intake
  - Weight entry
- **Weekly Summary**:
  - Progress charts
  - Goal adherence percentage
  - Achievements
- **Monthly Report**:
  - Trends analysis
  - Goal progress
  - Recommendations
- **Annual Overview**:
  - Year-in-review statistics
  - Long-term progress visualization

### 5. Weight Management
- Daily weight tracking
- Progress visualization (charts/graphs)
- BMI calculation
- Weight trend analysis
- Healthy weight suggestions
- Milestone celebrations

### 6. Rewards & Motivation System
- Daily treats/rewards for consistency
- Favorite snack integration
- Flexible "off days" system
- Achievement badges
- Streak tracking
- Adjustable reward schedules
- Positive reinforcement notifications

### 7. Flexibility Features
- Easy meal swapping
- Goal adjustment without penalty
- Cheat day/off day scheduling
- Gradual goal setting
- Plan modifications
- Emergency meal alternatives

### 8. Favorite Snacks (No Judgment Zone)
- Personal snack library
- Guilt-free treat scheduling
- Integration with reward system
- Calorie tracking (optional for off days)

### 9. Exercise & Workout System (NEW)
- **Home Workouts**: Bodyweight exercises, yoga, stretching
- **Gym Workouts**: Equipment-based routines
- **Workout Tokens**: Earn tokens for completed workouts
- **Exercise Log**: Track workouts with duration and intensity
- **Goal Alignment**: Workouts matched to health goals (weight loss, muscle gain, etc.)
- **Calorie Burn Tracking**: Estimate calories burned per workout

### 10. Medical & Health Conditions (NEW)
- **Health Conditions Input**: Diabetes, hypertension, allergies, etc.
- **Medical Reports Upload**: Store and reference medical documents
- **Condition-Aware Meals**: Meal suggestions that consider health conditions
- **Condition-Aware Workouts**: Exercise recommendations safe for conditions
- **Doctor Reports**: Generate summarized health reports for appointments
- **Hospital Integration**: Shareable reports for healthcare providers

### 11. Internationalization (i18n) (NEW)
- **Supported Languages**:
  - English (default)
  - Swahili (Kiswahili)
  - Luganda
  - French
  - More languages planned
- **Localized Meals**: Dishes in local languages
- **East African Cuisine**:
  - Ugandan dishes (Matooke, Rolex, Luwombo, Posho)
  - Kenyan dishes (Ugali, Nyama Choma, Sukuma Wiki)
  - Tanzanian dishes (Pilau, Mishkaki, Chipsi Mayai)
  - Rwandan dishes (Isombe, Brochettes, Ubugali)
  - Burundian dishes (Beans & Plantains, Mukeke)

### 12. App Integrations & Sync (NEW)
- **Fitness App Sync**: Apple Health, Google Fit, Fitbit
- **Calendar Sync**: Google Calendar, Outlook
- **Wearables**: Smartwatch compatibility
- **Export Data**: CSV, PDF exports

### 13. Quick Access & Widgets (NEW)
- **Dashboard Shortcuts**: One-tap access to key features
- **Real-time Reminders**: Priority notification display
- **Today's Summary Widget**: Quick overview card
- **PWA Home Screen Widget**: Mobile quick access

### 14. Meal Simplicity & Diversity (NEW)
- **Easy Prep Meals**: Under 15-minute recipes
- **Raw Options**: Salads, fresh fruits, smoothies
- **No-Cook Meals**: Assembly-only meals
- **Ingredient Substitutes**: Flexible ingredient options
- **Budget-Friendly**: Affordable meal alternatives

### 15. Engagement & Gamification (NEW)
- **Daily Challenges**: Small achievable goals
- **Achievement System**: Badges and milestones
- **Streak Bonuses**: Extra rewards for consistency
- **Motivational Messages**: Personalized encouragement
- **Progress Celebrations**: Milestone animations
- **Community Features**: Optional social sharing

---

## Database Schema (Preliminary)

```prisma
// User Management
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  password        String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  profile         Profile?
  meals           Meal[]
  logs            DailyLog[]
  reminders       Reminder[]
  rewards         Reward[]
  favoriteSnacks  FavoriteSnack[]
}

model Profile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  currentWeight   Float?
  targetWeight    Float?
  height          Float?
  age             Int?
  gender          String?
  activityLevel   String?
  goalType        String?  // weight_loss, maintenance, muscle_gain
  dailyCalories   Int?
  dietaryPrefs    String[] // vegetarian, vegan, keto, etc.
  allergies       String[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Meal System
model Meal {
  id              String   @id @default(cuid())
  name            String
  description     String?
  calories        Int
  protein         Float?
  carbs           Float?
  fats            Float?
  benefits        String[]
  cuisine         String?  // Italian, Indian, Mexican, etc.
  mealType        String   // breakfast, lunch, dinner, snack
  imageUrl        String?
  recipe          String?
  ingredients     String[]
  prepTime        Int?     // minutes
  isGlobal        Boolean  @default(false)
  createdBy       String?
  user            User?    @relation(fields: [createdBy], references: [id])
}

// Daily Logging
model DailyLog {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  date            DateTime
  weight          Float?
  caloriesConsumed Int?
  caloriesTarget  Int?
  waterIntake     Float?
  mealsLogged     Json     // Array of meal entries
  notes           String?
  mood            String?
  isOffDay        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Reminder System
model Reminder {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  type            String   // meal, weight, water, goal_check
  mealType        String?  // breakfast, lunch, dinner, snack
  time            String   // HH:MM format
  days            String[] // ["Mon", "Tue", ...]
  isActive        Boolean  @default(true)
  message         String?
  createdAt       DateTime @default(now())
}

// Rewards System
model Reward {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  type            String   // streak, milestone, daily_treat
  name            String
  description     String?
  earnedAt        DateTime @default(now())
  snackReward     String?
  offDayReward    Boolean  @default(false)
}

// Favorite Snacks
model FavoriteSnack {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  name            String
  calories        Int?
  notes           String?  // Why it makes them happy
  imageUrl        String?
}
```

---

## Application Structure

```
meal-planner/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── meals/
│   │   │   ├── page.tsx          # Meal planning
│   │   │   ├── [id]/page.tsx     # Meal details
│   │   │   └── suggestions/
│   │   ├── reminders/
│   │   │   └── page.tsx
│   │   ├── logs/
│   │   │   ├── daily/
│   │   │   ├── monthly/
│   │   │   └── annual/
│   │   ├── progress/
│   │   │   └── page.tsx          # Weight & goals
│   │   ├── rewards/
│   │   │   └── page.tsx
│   │   ├── snacks/
│   │   │   └── page.tsx          # Favorite snacks
│   │   └── settings/
│   │       └── page.tsx          # Profile & preferences
│   ├── api/
│   │   ├── auth/
│   │   ├── meals/
│   │   ├── reminders/
│   │   ├── logs/
│   │   ├── rewards/
│   │   └── users/
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn components
│   ├── dashboard/
│   ├── meals/
│   ├── reminders/
│   ├── charts/
│   └── shared/
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # Auth configuration
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   ├── useMeals.ts
│   ├── useReminders.ts
│   └── useProgress.ts
├── store/                        # State management
├── types/
├── prisma/
│   └── schema.prisma
├── public/
└── styles/
```

---

## MVP Features (Phase 1)
1. User authentication
2. Profile setup with goals
3. Basic meal planning (daily view)
4. Manual meal logging
5. Simple reminder system
6. Daily calorie tracking
7. Basic weight logging

## Phase 2 Features
1. Meal suggestions with calorie info
2. Weekly/monthly logs and reports
3. Progress charts
4. Reward system basics
5. Favorite snacks feature
6. Off-day scheduling

## Phase 3 Features
1. Global meal diversity
2. Advanced analytics (annual reports)
3. Red flag warnings
4. AI-powered meal suggestions
5. Push notifications
6. Mobile PWA optimization

## Phase 4 Features (NEW)
1. Exercise & Workout tracking
2. Workout tokens system
3. Medical conditions support
4. Doctor report generation
5. Internationalization (Swahili, Luganda)
6. East African cuisine database
7. App integrations (fitness trackers)
8. Quick access widgets

## Phase 5 Features (Future)
1. Hospital integration API
2. Community features
3. Wearable device sync
4. Voice commands
5. AI personal trainer
6. Meal delivery partnerships

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional: AI Features
OPENAI_API_KEY="sk-..."

# Optional: Push Notifications
VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."

# Optional: Email
RESEND_API_KEY="..."
```

---

## Deployment Checklist (Vercel)
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Set up database (Vercel Postgres recommended)
- [ ] Configure domains
- [ ] Enable analytics
- [ ] Set up cron jobs for reminders (Vercel Cron)

---

## Design Principles
1. **User-Centric**: Focus on motivation and positive reinforcement
2. **Judgment-Free**: No shaming for off days or indulgences
3. **Flexible**: Allow easy adjustments without penalties
4. **Data-Driven**: Provide insights without overwhelming
5. **Accessible**: Mobile-first, PWA-ready
6. **Gradual**: Support incremental goal setting

---

## Color Scheme Suggestions
- **Primary**: Green (health, growth) - #22C55E
- **Secondary**: Orange (energy, warmth) - #F97316
- **Accent**: Purple (rewards, treats) - #A855F7
- **Neutral**: Slate grays for text and backgrounds
- **Success**: Emerald
- **Warning**: Amber
- **Error**: Rose

---

## Notes
- Start with local storage for MVP, migrate to database
- Use service workers for offline capability
- Implement PWA for mobile app-like experience
- Consider internationalization (i18n) for global meals
