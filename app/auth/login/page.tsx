'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setApiKey('')

    try {
      const res = await fetch('/api/v1/pyma/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error?.message || 'Email not found')
        return
      }

      setApiKey(data.apiKey)
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">pA</span>
            </div>
            <span className="font-bold">pymA</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Account</h1>
          <p className="text-gray-600 mb-8">Enter your email to access your dashboard and API key</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading || !!apiKey}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                ✕ {error}
              </div>
            )}

            {apiKey && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-3">✓ Account Found!</p>
                <div className="bg-white p-3 rounded border border-green-300 mb-4">
                  <p className="text-xs text-gray-600 mb-2">Your API Key:</p>
                  <p className="font-mono text-sm font-bold text-gray-800 break-all">{apiKey}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyApiKey}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2 mb-2 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy API Key
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard?api_key=${apiKey}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                >
                  Go to Dashboard →
                </button>
              </div>
            )}

            {!apiKey && (
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
              >
                {loading ? 'Searching...' : 'Find Account'}
              </button>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/enroll" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
