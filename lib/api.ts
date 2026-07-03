const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pym.ink'

interface FetchOptions extends RequestInit {
  headers?: HeadersInit & { Authorization?: string }
}

export async function apiCall(
  endpoint: string,
  options: FetchOptions = {}
) {
  const url = `${API_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed')
  }

  return data
}

// Enrollment
export async function enrollUser(plan: string, email: string, company: string) {
  return apiCall('/api/v1/pyma/enroll', {
    method: 'POST',
    body: JSON.stringify({ plan, email, company }),
  })
}

// Subscriptions
export async function getSubscription(apiKey: string) {
  return apiCall('/api/v1/pyma/subscriptions', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
}

// FAQ
export async function uploadFAQ(apiKey: string, faqData: any[], format: 'json' | 'csv' | 'text') {
  return apiCall('/api/v1/pyma/faq', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ faq_data: faqData, format }),
  })
}

export async function getFAQ(apiKey: string) {
  return apiCall('/api/v1/pyma/faq', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
}

// Chat
export async function sendMessage(apiKey: string, question: string, conversationId?: string) {
  return apiCall('/api/v1/pyma/chat', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ question, conversation_id: conversationId }),
  })
}
