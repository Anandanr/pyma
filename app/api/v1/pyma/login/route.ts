import { createClient } from '@supabase/supabase-js'
import { corsResponse } from '@/lib/cors'

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

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { email } = body

    if (!email) {
      return corsResponse(
        { error: { message: 'Email is required' } },
        400
      )
    }

    // Find organization by email
    const { data, error } = await supabase
      .from('pyma_organizations')
      .select('id, email, api_key, company_name, plan, status')
      .eq('email', email)
      .single()

    if (error || !data) {
      return corsResponse(
        { error: { message: 'No account found with this email' } },
        404
      )
    }

    return corsResponse({
      success: true,
      apiKey: data.api_key,
      company: data.company_name,
      plan: data.plan,
      status: data.status,
    })
  } catch (error) {
    console.error('Login error:', error)
    return corsResponse(
      { error: { message: 'Internal server error' } },
      500
    )
  }
}
