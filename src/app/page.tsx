import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥗</span>
          <span className="text-xl font-bold text-green-700">MealPlanner</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-green-700 hover:text-green-800 font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Your Personal <span className="text-green-600">Meal Planning</span> Companion
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plan your meals, track your health goals, and achieve your ideal weight with
          personalized suggestions, smart reminders, and a judgment-free approach to healthy eating.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg"
          >
            Start Your Journey
          </Link>
          <Link
            href="#features"
            className="px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium text-lg"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-green-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Eating Habits?
          </h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Join thousands of users who have achieved their health goals with MealPlanner.
            No judgment, just progress.
          </p>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium text-lg inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥗</span>
            <span className="font-semibold text-gray-700">MealPlanner</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 MealPlanner. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}

const features = [
  {
    icon: '📊',
    title: 'Calorie Tracking',
    description: 'Track your daily calorie intake with detailed nutritional information for every meal.',
  },
  {
    icon: '🎯',
    title: 'Personalized Goals',
    description: 'Set and achieve your health goals with customized meal plans aligned to your needs.',
  },
  {
    icon: '⏰',
    title: 'Smart Reminders',
    description: 'Never miss a meal with intelligent reminders and make-up suggestions.',
  },
  {
    icon: '🌍',
    title: 'Global Cuisine',
    description: 'Explore diverse meals from around the world while staying on track.',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    description: 'Monitor your weight and health progress with daily, weekly, and monthly logs.',
  },
  {
    icon: '🎁',
    title: 'Rewards System',
    description: 'Earn treats and off-days for your consistency. You deserve it!',
  },
  {
    icon: '🍫',
    title: 'Favorite Snacks',
    description: 'Add your comfort foods without judgment. Balance is key to success.',
  },
  {
    icon: '⚖️',
    title: 'Weight Management',
    description: 'Track your weight journey with smart suggestions and milestone celebrations.',
  },
  {
    icon: '🔔',
    title: 'Red Flag Alerts',
    description: 'Get gentle nudges when you stray from your path, with helpful recovery options.',
  },
]
