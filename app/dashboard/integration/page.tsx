'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy, Check } from 'lucide-react'

export default function IntegrationPage() {
  const searchParams = useSearchParams()
  const apiKey = searchParams.get('api_key') || ''
  const [copied, setCopied] = useState(false)

  const embedCode = `<script src="https://widget.pym.ink/chatbot.js" data-api-key="${apiKey}"></script>`

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Install PyMA Chatbot</h1>
          <p className="text-gray-600 mt-2">Add the chatbot to your website in one line of code</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Copy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Copy & Paste Code</h2>
          <p className="text-gray-600 mb-4">Add this to your website (before &lt;/body&gt;):</p>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
            <code>{embedCode}</code>
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
        </div>

        {/* Customization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Customize</h2>
          <p className="text-gray-600 mb-6">Add these options to customize the widget:</p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-mono text-sm bg-gray-50 p-3 rounded mb-3">
                data-position="bottom-right"
              </p>
              <p className="text-sm text-gray-600">
                Position: <code className="bg-gray-100 px-2 py-1 rounded">bottom-right</code>,{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">bottom-left</code>,{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">top-right</code>,{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">top-left</code>
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-mono text-sm bg-gray-50 p-3 rounded mb-3">
                data-theme="light"
              </p>
              <p className="text-sm text-gray-600">
                Theme: <code className="bg-gray-100 px-2 py-1 rounded">light</code>,{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">dark</code>,{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">brand</code>
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-mono text-sm bg-gray-50 p-3 rounded mb-3">
                data-title="Help Center"
              </p>
              <p className="text-sm text-gray-600">Widget title/header text</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-mono text-sm bg-gray-50 p-3 rounded mb-3">
                data-placeholder="Ask anything..."
              </p>
              <p className="text-sm text-gray-600">Input field placeholder text</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Example:</strong>
              <br />
              <code className="bg-white px-2 py-1 rounded text-xs">
                &lt;script src="..." data-position="bottom-left"
                <br />
                &nbsp;&nbsp;data-theme="dark" data-title="Support"&gt;&lt;/script&gt;
              </code>
            </p>
          </div>
        </div>

        {/* Platform-Specific */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Where to Add Code</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* WordPress */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">WordPress</h3>
              <ol className="text-sm space-y-2 text-gray-600">
                <li>1. Go to <strong>Appearance → Theme File Editor</strong></li>
                <li>2. Edit <code className="bg-gray-100 px-1">footer.php</code></li>
                <li>3. Paste before <code className="bg-gray-100 px-1">&lt;/body&gt;</code></li>
              </ol>
            </div>

            {/* Shopify */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Shopify</h3>
              <ol className="text-sm space-y-2 text-gray-600">
                <li>1. Go to <strong>Online Store → Themes</strong></li>
                <li>2. Click <strong>Edit code</strong></li>
                <li>3. Edit <code className="bg-gray-100 px-1">theme.liquid</code></li>
              </ol>
            </div>

            {/* Wix */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Wix</h3>
              <ol className="text-sm space-y-2 text-gray-600">
                <li>1. Go to <strong>Settings</strong></li>
                <li>2. Click <strong>Custom Code</strong></li>
                <li>3. Add to footer</li>
              </ol>
            </div>

            {/* HTML */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">HTML Website</h3>
              <ol className="text-sm space-y-2 text-gray-600">
                <li>1. Open your HTML file</li>
                <li>2. Paste before <code className="bg-gray-100 px-1">&lt;/body&gt;</code></li>
                <li>3. Save and refresh</li>
              </ol>
            </div>

            {/* Next.js */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Next.js</h3>
              <p className="text-sm text-gray-600 mb-2">Add to <code className="bg-gray-100 px-1">app/layout.tsx</code>:</p>
              <code className="text-xs bg-gray-100 block p-2 rounded overflow-x-auto">
                &lt;script dangerouslySetInnerHTML={"{__html: `...`}"}/&gt;
              </code>
            </div>

            {/* React */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">React</h3>
              <p className="text-sm text-gray-600">Use the embed script in your component:</p>
              <code className="text-xs bg-gray-100 block p-2 rounded mt-2 overflow-x-auto">
                &lt;script src="https://widget.pym.ink/chatbot.js" ... /&gt;
              </code>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-red-600 mb-2">❌ Chatbot doesn't appear</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>☐ Check API key is correct (copy from dashboard again)</li>
                <li>☐ Check browser console for errors (F12 → Console)</li>
                <li>☐ Make sure you're on live site, not localhost</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-red-600 mb-2">❌ Messages don't work</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>☐ Upload your FAQ first (Dashboard → Upload FAQ)</li>
                <li>☐ Verify your subscription is active</li>
                <li>☐ Try a new message after uploading FAQ</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-600 mb-2">✅ Need help?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>📧 Email: hello@pym.ink</li>
                <li>📖 Docs: https://docs.pym.ink/pyma</li>
                <li>💬 Chat: Use support chatbot in dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

