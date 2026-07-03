'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { getPricingBotResponse } from '@/lib/pricingBot'

interface Message {
    id: string
    type: 'user' | 'bot'
    content: string
    timestamp: Date
}

export default function HomeChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            content: "👋 Hey! I'm PyMA. I'm here to answer any questions about our pricing and plans. What would you like to know?",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: input,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setLoading(true)

        // Simulate API call delay
        setTimeout(() => {
            const botResponse = getPricingBotResponse(input)
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: botResponse,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMessage])
            setLoading(false)
        }, 500)
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">pA</span>
                        </div>
                        <span className="font-bold text-lg">pymA</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/auth/login"
                            className="text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/enroll"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                            Enroll
                        </Link>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto pt-20 pb-24">
                <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex gap-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                {message.type === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <MessageCircle className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`px-4 py-3 rounded-lg ${message.type === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-4 h-4 text-white" />
                                </div>
                                <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 rounded-bl-none">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Footer */}
            <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about plans, pricing, features..."
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    )
}
