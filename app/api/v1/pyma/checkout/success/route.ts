import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function POST(request: Request) {
  try {
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
    const email = customer.email
    const company = (customer.metadata?.company as string) || 'Unknown'

    if (!email) {
      throw new Error('No email found for customer')
    }

    // Check if organization already exists
    const { data: existingOrg } = await supabase
      .from('pyma_organizations')
      .select('id')
      .eq('email', email)
      .single()

    if (existingOrg) {
      return Response.json(
        { error: { message: 'Organization already exists for this email' } },
        { status: 409 }
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

    // Create organization in database
    const { data, error } = await supabase
      .from('pyma_organizations')
      .insert({
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
      })
      .select()

    if (error) {
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
