'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'

function CheckoutContent() {
  const plan = 'monthly' // Only monthly plan now with 7-day free trial

  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call the enroll API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pyma/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          email,
          company,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create subscription')
      }

      // Redirect to Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const planInfo = {
    'monthly': { name: '$29/month with 7-day free trial', price: '$29/mo' },
  }

  const currentPlan = planInfo['monthly']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/enroll" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">pA</span>
            </div>
            <span className="font-bold text-sm">pymA</span>
          </div>
          <div className="w-12" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Plan Summary */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">You're selecting:</p>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-bold">{currentPlan.name}</h2>
              <span className="text-2xl font-bold text-primary">{currentPlan.price}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                placeholder="Your Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Start 7-Day Free Trial'
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>
              {' '} and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
            <p>✓ Secure payment via Stripe. 7-day free trial, cancel anytime.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">pA</span>
            </div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
