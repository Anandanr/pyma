'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

function EnrollContent() {
  const handleContinue = () => {
    window.location.href = `/checkout?plan=monthly`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">pA</span>
            </div>
            <span className="font-bold">pymA</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-600">
              Start free for 7 days. Then $29/month. Cancel anytime.
            </p>
          </div>

          {/* Plan Card */}
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white border-2 border-blue-600 rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  ✓ BEST VALUE
                </div>
                <h2 className="text-3xl font-bold mb-2">$29/month</h2>
                <p className="text-gray-600">
                  Full platform access with <strong>7-day free trial</strong>
                </p>
              </div>

              <div className="space-y-3 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">7 days free • Then $29/month</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Cancel anytime (free within 7 days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Unlimited messages</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Full platform access</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">99% uptime SLA</span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start 7-Day Free Trial →
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6 text-center text-gray-600">
            <p className="mb-2">
              💡 <strong>7-day free trial.</strong> Then $29/month. No credit card needed.
            </p>
            <p className="text-sm">
              Full access for 7 days. Cancel anytime within those 7 days—no charge. After day 7, we'll charge $29/month unless you cancel.
            </p>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Find your API key
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function EnrollPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">pA</span>
            </div>
            <p className="text-gray-600">Loading plans...</p>
          </div>
        </div>
      }
    >
      <EnrollContent />
    </Suspense>
  )
}
