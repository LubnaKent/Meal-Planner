import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meal Planner - Your Personal Health Companion',
  description: 'Plan your meals, track your health goals, and achieve your ideal weight with personalized meal suggestions and reminders.',
  keywords: ['meal planner', 'health', 'nutrition', 'calorie tracker', 'weight loss', 'diet'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
