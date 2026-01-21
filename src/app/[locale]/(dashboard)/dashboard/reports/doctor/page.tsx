'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface DailyLogEntry {
  date: string
  weight: number | null
  waterIntake: number | null
  mood: string | null
  isOffDay: boolean
  mealsCount: number
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fats: number
    fiber: number
  }
  meals: {
    name: string
    mealType: string
    calories: number
    time: string
  }[]
}

interface ReportData {
  generatedAt: string
  reportPeriod: {
    startDate: string
    endDate: string
    days: number
  }
  patient: {
    name: string
    email: string
  }
  profile: {
    currentWeight: number | null
    targetWeight: number | null
    height: number | null
    age: number | null
    gender: string | null
    activityLevel: string | null
    goalType: string | null
    dailyCalorieTarget: number | null
    dietaryPreferences: string[]
    allergies: string[]
    medicalConditions: string[]
    medications: string[]
  } | null
  summary: {
    totalDaysLogged: number
    averages: {
      dailyCalories: number
      dailyProtein: number
      dailyCarbs: number
      dailyFats: number
      dailyFiber: number
      dailyWater: number
      mealsPerDay: number
    } | null
    weightTrend: {
      startWeight: number | null
      endWeight: number | null
      change: number
    } | null
  }
  dailyLogs: DailyLogEntry[]
}

export default function DoctorReportPage() {
  const t = useTranslations()
  const [report, setReport] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [days, setDays] = useState(30)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchReport()
  }, [days])

  const fetchReport = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/reports/doctor?days=${days}`)
      if (!res.ok) throw new Error('Failed to fetch report')
      const data = await res.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {t('common.retry') || 'Retry'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden on print */}
      <header className="bg-white border-b border-gray-200 print:hidden">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← {t('common.back')}
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{t('doctorReport.title')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={7}>{t('doctorReport.last7Days')}</option>
              <option value={14}>{t('doctorReport.last14Days')}</option>
              <option value={30}>{t('doctorReport.last30Days')}</option>
              <option value={60}>{t('doctorReport.last60Days')}</option>
              <option value={90}>{t('doctorReport.last90Days')}</option>
            </select>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <span>🖨️</span>
              {t('doctorReport.print')}
            </button>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl" ref={printRef}>
        {report && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none">
            {/* Report Header */}
            <div className="text-center mb-8 pb-6 border-b border-gray-200">
              <div className="flex justify-center items-center gap-2 mb-2">
                <span className="text-3xl">🥗</span>
                <span className="text-2xl font-bold text-green-700">{t('common.appName')}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('doctorReport.nutritionReport')}</h1>
              <p className="text-gray-500">
                {t('doctorReport.periodLabel')}: {formatDate(report.reportPeriod.startDate)} - {formatDate(report.reportPeriod.endDate)}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {t('doctorReport.generatedOn')}: {formatDate(report.generatedAt)}
              </p>
            </div>

            {/* Patient Information */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>👤</span> {t('doctorReport.patientInfo')}
              </h2>
              <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">{t('doctorReport.name')}</p>
                  <p className="font-medium">{report.patient.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('doctorReport.email')}</p>
                  <p className="font-medium">{report.patient.email}</p>
                </div>
                {report.profile && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">{t('doctorReport.age')}</p>
                      <p className="font-medium">{report.profile.age || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('doctorReport.gender')}</p>
                      <p className="font-medium capitalize">{report.profile.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('doctorReport.height')}</p>
                      <p className="font-medium">{report.profile.height ? `${report.profile.height} cm` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('doctorReport.currentWeight')}</p>
                      <p className="font-medium">{report.profile.currentWeight ? `${report.profile.currentWeight} kg` : 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Medical Information */}
            {report.profile && (report.profile.medicalConditions.length > 0 || report.profile.medications.length > 0 || report.profile.allergies.length > 0) && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🏥</span> {t('doctorReport.medicalInfo')}
                </h2>
                <div className="bg-red-50 p-4 rounded-lg space-y-3">
                  {report.profile.medicalConditions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-800">{t('doctorReport.medicalConditions')}</p>
                      <p className="text-red-700">{report.profile.medicalConditions.join(', ')}</p>
                    </div>
                  )}
                  {report.profile.medications.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-800">{t('doctorReport.medications')}</p>
                      <p className="text-red-700">{report.profile.medications.join(', ')}</p>
                    </div>
                  )}
                  {report.profile.allergies.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-800">{t('doctorReport.allergies')}</p>
                      <p className="text-red-700">{report.profile.allergies.join(', ')}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Summary Statistics */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span> {t('doctorReport.nutritionSummary')}
              </h2>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-green-800">
                  {t('doctorReport.daysLogged')}: <strong>{report.summary.totalDaysLogged}</strong> {t('doctorReport.outOf')} {report.reportPeriod.days} {t('dashboard.days')}
                </p>
              </div>

              {report.summary.averages ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">{report.summary.averages.dailyCalories}</p>
                    <p className="text-sm text-gray-600">{t('doctorReport.avgCalories')}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">{report.summary.averages.dailyProtein}g</p>
                    <p className="text-sm text-gray-600">{t('doctorReport.avgProtein')}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">{report.summary.averages.dailyCarbs}g</p>
                    <p className="text-sm text-gray-600">{t('doctorReport.avgCarbs')}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">{report.summary.averages.dailyFats}g</p>
                    <p className="text-sm text-gray-600">{t('doctorReport.avgFats')}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{report.summary.averages.dailyFiber}g</p>
                    <p className="text-sm text-gray-600">{t('doctorReport.avgFiber')}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{report.summary.averages.dailyWater}</p>
                    <p className="text-sm text-gray-600">{t('doctorReport.avgWater')}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center col-span-2">
                    <p className="text-2xl font-bold text-gray-600">{report.summary.averages.mealsPerDay}</p>
                    <p className="text-sm text-gray-600">{t('doctorReport.avgMeals')}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">{t('doctorReport.noDataAvailable')}</p>
              )}
            </section>

            {/* Weight Trend */}
            {report.summary.weightTrend && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>⚖️</span> {t('doctorReport.weightTrend')}
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{t('doctorReport.startWeight')}</p>
                      <p className="text-xl font-bold">{report.summary.weightTrend.startWeight} kg</p>
                    </div>
                    <div className="text-center">
                      <span className={`text-2xl ${report.summary.weightTrend.change < 0 ? 'text-green-600' : report.summary.weightTrend.change > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {report.summary.weightTrend.change > 0 ? '↑' : report.summary.weightTrend.change < 0 ? '↓' : '→'}
                      </span>
                      <p className={`font-bold ${report.summary.weightTrend.change < 0 ? 'text-green-600' : report.summary.weightTrend.change > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {report.summary.weightTrend.change > 0 ? '+' : ''}{report.summary.weightTrend.change} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{t('doctorReport.endWeight')}</p>
                      <p className="text-xl font-bold">{report.summary.weightTrend.endWeight} kg</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Daily Log Details */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📅</span> {t('doctorReport.dailyDetails')}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-medium">{t('doctorReport.date')}</th>
                      <th className="text-center p-3 font-medium">{t('foodMenu.calories')}</th>
                      <th className="text-center p-3 font-medium">{t('foodMenu.protein')}</th>
                      <th className="text-center p-3 font-medium">{t('dashboard.water')}</th>
                      <th className="text-center p-3 font-medium">{t('doctorReport.weight')}</th>
                      <th className="text-center p-3 font-medium">{t('dashboard.meals')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.dailyLogs.slice(0, 14).map((log, index) => (
                      <tr key={log.date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3">{formatDate(log.date)}</td>
                        <td className="text-center p-3">{log.nutrition.calories || '-'}</td>
                        <td className="text-center p-3">{log.nutrition.protein ? `${log.nutrition.protein}g` : '-'}</td>
                        <td className="text-center p-3">{log.waterIntake || '-'}</td>
                        <td className="text-center p-3">{log.weight ? `${log.weight} kg` : '-'}</td>
                        <td className="text-center p-3">{log.mealsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {report.dailyLogs.length > 14 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {t('doctorReport.showingRecent', { count: 14, total: report.dailyLogs.length })}
                </p>
              )}
            </section>

            {/* Disclaimer */}
            <section className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                {t('doctorReport.disclaimer')}
              </p>
            </section>
          </div>
        )}
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #__next,
          #__next * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          main {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
