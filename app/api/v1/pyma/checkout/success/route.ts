import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    throw new Error('Stripe secret key is not configured')
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-08-16',
  })
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    const stripe = getStripe()
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return Response.json(
        { error: { message: 'Session ID is required' } },
        { status: 400 }
      )
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session.customer) {
      throw new Error('No customer associated with this session')
    }

    // Get customer details
    const customer = await stripe.customers.retrieve(session.customer as string)

    // Type guard: ensure customer is not deleted
    if ('deleted' in customer && customer.deleted) {
      throw new Error('Customer has been deleted')
    }

    const email = customer.email
    const company = (customer.metadata?.company as string) || 'Unknown'

    if (!email) {
      throw new Error('No email found for customer')
    }

    // Check if organization already exists
    const { data: existingOrg, error: checkError } = await supabase
      .from('pyma_organizations')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingOrg) {
      return Response.json(
        { success: true, message: 'Organization already exists for this email', organization: existingOrg },
        { status: 200 }
      )
    }

    // Generate API key
    const apiKey = `pyma_${crypto.randomUUID().replace(/-/g, '')}`

    // Get subscription details
    const subscriptions = await stripe.subscriptions.list({
      customer: session.customer as string,
      limit: 1,
    })

    const subscription = subscriptions.data[0]

    if (!subscription) {
      throw new Error('No subscription found')
    }

    // Calculate trial end date
    const trialEndDate = subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Create or update organization in database (upsert)
    const { data, error } = await supabase
      .from('pyma_organizations')
      .upsert({
        email,
        company_name: company,
        api_key: apiKey,
        stripe_customer_id: session.customer,
        stripe_subscription_id: subscription.id,
        plan: 'monthly',
        trial_start_date: new Date(),
        trial_end_date: trialEndDate,
        billing_date: new Date(subscription.current_period_end * 1000),
        status: 'active',
      }, {
        onConflict: 'email'
      })
      .select()

    if (error) {
      // If it's a duplicate key error, that's okay - just retrieve the existing organization
      if (error.code === '23505') {
        const { data: existingData } = await supabase
          .from('pyma_organizations')
          .select('*')
          .eq('email', email)
          .single()

        return Response.json({
          success: true,
          organization: existingData,
          apiKey: existingData?.api_key,
          message: 'Organization already exists. Welcome back!',
        })
      }
      console.error('Database error:', error)
      throw error
    }

    return Response.json({
      success: true,
      organization: data[0],
      apiKey,
      message: 'Subscription confirmed! Your 7-day trial has started.',
    })
  } catch (error) {
    console.error('Checkout success error:', error)
    return Response.json(
      { error: { message: error instanceof Error ? error.message : 'Internal server error' } },
      { status: 500 }
    )
  }
}
