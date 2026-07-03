import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { api_key, message, faq_id } = body

    if (!api_key || !message) {
      return Response.json(
        { error: { message: 'API key and message are required' } },
        { status: 400 }
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
        { status: 401 }
      )
    }

    // Check if trial expired (only for free-trial plan)
    if (org.plan === 'free-trial') {
      const trialEnd = new Date(org.trial_end_date)
      if (new Date() > trialEnd) {
        return Response.json(
          { error: { message: 'Free trial has expired. Please upgrade to continue.' } },
          { status: 403 }
        )
      }
    }

    // TODO: Call Claude/OpenAI API with FAQ knowledge base
    // For now, return a mock response
    const botResponse = `This is a test response to: "${message}". In production, this would call Claude with your FAQ knowledge base.`

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
    })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json(
      { error: { message: error instanceof Error ? error.message : 'Internal server error' } },
      { status: 500 }
    )
  }
}
