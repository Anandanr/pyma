import { NextResponse } from 'next/server'
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
    const { email, company, plan } = body

    if (!email || !company) {
      return Response.json(
        { error: { message: 'Email and company are required' } },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Only monthly plan now (with 7-day trial)
    if (plan !== 'monthly') {
      return Response.json(
        { error: { message: 'Invalid plan' } },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Check if email already exists in database
    const { data: existingOrg } = await supabase
      .from('pyma_organizations')
      .select('id, email')
      .eq('email', email)
      .maybeSingle()

    if (existingOrg) {
      return Response.json(
        { error: { message: 'Email already in use. Please use a different email or log in to your existing account.' } },
        { 
          status: 409,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Check if Stripe customer already exists with this email
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    let customer
    if (existingCustomers.data.length > 0) {
      // Use existing customer
      customer = existingCustomers.data[0]
      
      // Check if customer already has active subscription (trials only apply to new subscriptions)
      const existingSubscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1,
      })

      if (existingSubscriptions.data.length > 0) {
        return Response.json(
          { error: { message: 'This email already has an active subscription.' } },
          { 
            status: 409,
            headers: {
              'Access-Control-Allow-Origin': '*',
            }
          }
        )
      }

      // Update metadata if needed
      await stripe.customers.update(customer.id, {
        metadata: { company },
      })
    } else {
      // Create new Stripe customer
      customer = await stripe.customers.create({
        email,
        metadata: { company },
      })
    }

    // Create Stripe Checkout session
    // Calculate trial end date (7 full days from now)
    // Using 8 days of seconds to account for Stripe's day counting
    const trialEndDate = Math.floor(Date.now() / 1000) + (8 * 24 * 60 * 60)
    
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
        trial_end: trialEndDate,
        description: `${company} - PyMA subscription`,
      },
      // Skip payment collection during trial
      payment_method_collection: 'if_required',
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
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('Enroll error:', error)
    return Response.json(
      { error: { message: error instanceof Error ? error.message : 'Internal server error' } },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}
