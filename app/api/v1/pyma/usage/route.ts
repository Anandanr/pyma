import { createClient } from '@supabase/supabase-js'
import { corsResponse } from '@/lib/cors'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

export async function OPTIONS() {
  return corsResponse({}, 200)
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const url = new URL(request.url)
    const api_key = url.searchParams.get('api_key')

    if (!api_key) {
      return corsResponse(
        { error: { message: 'API key is required' } },
        400
      )
    }

    // Verify API key and get organization
    const { data: org, error: orgError } = await supabase
      .from('pyma_organizations')
      .select('*')
      .eq('api_key', api_key)
      .single()

    if (orgError || !org) {
      return corsResponse(
        { error: { message: 'Invalid API key' } },
        401
      )
    }

    // Get usage for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: usage, error: usageError } = await supabase
      .from('pyma_usage')
      .select('*')
      .eq('organization_id', org.id)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (usageError) throw usageError

    // Get today's usage
    const today = new Date().toISOString().split('T')[0]
    const todayUsage = usage?.find((u) => u.date === today)

    // Get subscription status
    const { data: subscription } = await supabase
      .from('pyma_subscriptions')
      .select('*')
      .eq('organization_id', org.id)
      .single()

    return corsResponse({
      success: true,
      organization: {
        id: org.id,
        email: org.email,
        company: org.company_name,
        plan: org.plan,
        api_key: org.api_key,
        stripe_customer_id: org.stripe_customer_id,
        trial_start: org.trial_start_date,
        trial_end: org.trial_end_date,
        status: org.status,
      },
      subscription: {
        plan: subscription?.plan || org.plan,
        status: subscription?.status || org.status,
      },
      usage: {
        today: todayUsage?.messages_count || 0,
        last_30_days: usage?.reduce((sum, u) => sum + u.messages_count, 0) || 0,
        total_cost: usage?.reduce((sum, u) => sum + u.cost, 0) || 0,
        daily_breakdown: usage,
      },
    })
  } catch (error) {
    console.error('Usage error:', error)
    return corsResponse(
      { error: { message: error instanceof Error ? error.message : 'Internal server error' } },
      500
    )
  }
}
