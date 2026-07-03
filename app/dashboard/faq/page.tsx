'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'

export default function FAQUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/v1/pyma/faq/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed')
      }

      setMessage('✅ FAQ uploaded successfully! Your knowledge base is ready.')
      setFile(null)
    } catch (err) {
      setMessage(
        `❌ ${err instanceof Error ? err.message : 'Upload failed'}. Please try again.`
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-2">Upload Your FAQ</h1>
          <p className="text-gray-600 mb-8">
            Upload your knowledge base in any format. We'll train PyMA to answer customer questions based on your FAQ.
          </p>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition">
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-medium text-gray-900 mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-600">
                  Supported formats: PDF, CSV, TXT, DOCX (max 10MB)
                </p>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.txt,.docx"
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes('✅')
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload FAQ'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-12 pt-8 border-t border-gray-200 space-y-4">
            <h3 className="font-semibold">How it works</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>
                <strong>1. Upload:</strong> Submit your FAQ in any format (PDF, CSV, TXT, DOCX)
              </li>
              <li>
                <strong>2. Parse:</strong> We automatically extract and organize your Q&As
              </li>
              <li>
                <strong>3. Train:</strong> PyMA learns your FAQ to answer accurately
              </li>
              <li>
                <strong>4. Deploy:</strong> Start answering customer questions with your API key
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
