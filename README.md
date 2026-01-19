# Meal Planner

A comprehensive meal planning application built with Next.js that helps users plan, track, and achieve their health goals through intelligent meal suggestions, reminders, and progress tracking.

## Features

- **Calorie Tracking** - Track daily calorie intake with detailed nutritional information
- **Personalized Goals** - Set and achieve health goals with customized meal plans
- **Smart Reminders** - Never miss a meal with intelligent reminders
- **Global Cuisine** - Explore diverse meals from around the world
- **Progress Tracking** - Monitor weight and health progress with daily, weekly, and monthly logs
- **Rewards System** - Earn treats and off-days for consistency
- **Favorite Snacks** - Add comfort foods without judgment
- **Weight Management** - Track weight journey with smart suggestions
- **Red Flag Alerts** - Get gentle nudges with helpful recovery options

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LubnaKent/Meal-Planner.git
cd Meal-Planner
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Dashboard pages
│   ├── api/             # API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx         # Landing page
├── components/          # Reusable components
├── lib/                 # Utilities and helpers
└── types/               # TypeScript types
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
