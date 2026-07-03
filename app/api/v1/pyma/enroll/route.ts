import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, company, plan } = body

    if (!email || !company) {
      return Response.json(
        { error: { message: 'Email and company are required' } },
        { status: 400 }
      )
    }

    // Only monthly plan now (with 7-day trial)
    if (plan !== 'monthly') {
      return Response.json(
        { error: { message: 'Invalid plan' } },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingOrg } = await supabase
      .from('pyma_organizations')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingOrg) {
      return Response.json(
        { error: { message: 'Email already in use. Please use a different email or log in to your existing account.' } },
        { status: 409 }
      )
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: { company },
    })

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: process.env.STRIPE_MONTHLY_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
      subscription_data: {
        trial_period_days: 7,
        description: `${company} - PyMA subscription`,
      },
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/enroll`,
    })

    // Store temp customer mapping for webhook
    // (In production, you'd store this in a temp table)
    
    return Response.json({
      success: true,
      checkout_url: checkoutSession.url,
      sessionId: checkoutSession.id,
      message: 'Redirecting to payment...',
    })
  } catch (error) {
    console.error('Enroll error:', error)
    return Response.json(
      { error: { message: error instanceof Error ? error.message : 'Internal server error' } },
      { status: 500 }
    )
  }
}
