import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const url = new URL(request.url)
    const api_key = url.searchParams.get('api_key')

    if (!api_key) {
      return Response.json(
        { error: { message: 'API key is required' } },
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

    return Response.json({
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
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Usage error:', error)
    return Response.json(
      { error: { message: error instanceof Error ? error.message : 'Internal server error' } },
      { status: 500, headers: corsHeaders }
    )
  }
}
