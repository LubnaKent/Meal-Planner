import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
