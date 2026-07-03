import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return Response.json(
        { error: { message: 'Email is required' } },
        { status: 400 }
      )
    }

    // Find organization by email
    const { data, error } = await supabase
      .from('pyma_organizations')
      .select('id, email, api_key, company_name, plan, status')
      .eq('email', email)
      .single()

    if (error || !data) {
      return Response.json(
        { error: { message: 'No account found with this email' } },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      apiKey: data.api_key,
      company: data.company_name,
      plan: data.plan,
      status: data.status,
    })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
