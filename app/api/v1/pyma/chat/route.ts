import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Handle OPTIONS requests
export async function OPTIONS(request: Request) {
  return Response.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { api_key, message } = body

    if (!api_key || !message) {
      return Response.json(
        { error: { message: 'API key and message are required' } },
        { status: 400, headers: corsHeaders }
      )
    }

    // Verify API key and get organization
    const { data: org, error: orgError } = await supabase
      .from('pyma_organizations')
      .select('*')
      .eq('api_key', api_key)
      .single()

    if (orgError || !org) {
      return Response.json(
        { error: { message: 'Invalid API key' } },
        { status: 401, headers: corsHeaders }
      )
    }

    // Check if trial expired (only for free-trial plan)
    if (org.plan === 'free-trial') {
      const trialEnd = new Date(org.trial_end_date)
      if (new Date() > trialEnd) {
        return Response.json(
          { error: { message: 'Free trial has expired. Please upgrade to continue.' } },
          { status: 403, headers: corsHeaders }
        )
      }
    }

    // Fetch FAQs for context
    const { data: faqs } = await supabase
      .from('pyma_faqs')
      .select('title, content')
      .eq('organization_id', org.id)
      .limit(10)

    // Build context from FAQs
    const faqContext = faqs && faqs.length > 0
      ? `Here are relevant FAQs:\n\n${faqs.map((f: any) => `Q: ${f.title}\nA: ${f.content}`).join('\n\n')}`
      : 'No FAQs uploaded yet.'

    // Call Groq AI
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer support assistant. Answer the customer's question based on the provided FAQs. Be concise and helpful.\n\n${faqContext}`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    let botResponse: string
    if (groqResponse.ok) {
      const groqData = await groqResponse.json()
      botResponse = groqData.choices[0]?.message?.content || 'No response from AI'
    } else {
      botResponse = `I encountered an issue processing your request. ${faqs && faqs.length > 0 ? 'Based on our FAQs: ' + faqs.map((f: any) => f.content).join(' ') : 'Please try again.'}`
    }

    // Track usage
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('pyma_usage')
      .select('*')
      .eq('organization_id', org.id)
      .eq('date', today)
      .single()

    if (usage) {
      // Update existing usage
      await supabase
        .from('pyma_usage')
        .update({
          messages_count: usage.messages_count + 1,
          updated_at: new Date(),
        })
        .eq('id', usage.id)
    } else {
      // Create new usage entry
      await supabase.from('pyma_usage').insert({
        organization_id: org.id,
        date: today,
        messages_count: 1,
        tokens_used: 0,
        cost: 0,
      })
    }

    // Store message
    await supabase.from('pyma_messages').insert({
      organization_id: org.id,
      user_message: message,
      bot_response: botResponse,
      tokens_used: 0,
      cost: 0,
    })

    return Response.json({
      success: true,
      response: botResponse,
      usage: {
        messages_today: (usage?.messages_count || 0) + 1,
      },
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json(
      { error: { message: error instanceof Error ? error.message : 'Internal server error' } },
      { status: 500, headers: corsHeaders }
    )
  }
}
