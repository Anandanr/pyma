'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Copy, Check, LogOut } from 'lucide-react'

function DashboardContent() {
  const searchParams = useSearchParams()
  const apiKey = searchParams.get('api_key')
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">pA</span>
            </div>
            <span className="font-bold text-lg">pymA Dashboard</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('apiKey')
              window.location.href = '/'
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* API Key Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">Your API Key</h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Use this key to integrate pymA with your application.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <code className="text-sm font-mono text-gray-700 truncate">
                  {mounted && apiKey ? apiKey : 'Loading...'}
                </code>
                <button
                  onClick={() => apiKey && copyToClipboard(apiKey)}
                  className="ml-2 p-2 hover:bg-gray-200 rounded transition"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>

              <Link
                href="https://docs.pym.ink/pyma"
                target="_blank"
                className="text-primary hover:underline text-sm font-medium"
              >
                View Integration Guide →
              </Link>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">Quick Start</h2>

            <ol className="space-y-4 text-sm">
              <li className="flex gap-4">
                <span className="text-primary font-bold shrink-0">1</span>
                <span className="text-gray-700">Upload your FAQ (text, CSV, or PDF)</span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold shrink-0">2</span>
                <span className="text-gray-700">Get your API key (above)</span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold shrink-0">3</span>
                <span className="text-gray-700">Integrate with your app or chat widget</span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold shrink-0">4</span>
                <span className="text-gray-700">Start answering customer questions automatically</span>
              </li>
            </ol>

            <Link
              href="/dashboard/faq"
              className="mt-6 inline-block bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition"
            >
              Upload FAQ →
            </Link>
          </div>

          {/* Integration Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">Install Chatbot</h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add the PyMA chatbot to your website in seconds.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <code className="text-gray-800">
                  &lt;script src="https://widget.pym.ink/chatbot.js"
                  <br />
                  &nbsp;&nbsp;data-api-key="{mounted && apiKey ? apiKey : 'pyma_...'}"&gt;
                  <br />
                  &lt;/script&gt;
                </code>
              </div>

              <Link
                href="/dashboard/integration"
                className="inline-block bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition"
              >
                View Setup Guide →
              </Link>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-4">Dashboard Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">📊 Analytics</h3>
              <p className="text-sm text-gray-600">Track messages, response times, and FAQ hit rates</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📁 FAQ Management</h3>
              <p className="text-sm text-gray-600">Upload, edit, and organize your FAQ entries</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔧 Settings</h3>
              <p className="text-sm text-gray-600">Manage billing, API access, and team members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
