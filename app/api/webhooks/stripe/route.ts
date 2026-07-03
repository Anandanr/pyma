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
  const supabase = getSupabase()
  const stripe = getStripe()
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated':
        {
          const subscription = event.data.object as Stripe.Subscription
          const customerId = subscription.customer as string

          // Find organization by Stripe customer ID
          const { data: org } = await supabase
            .from('pyma_organizations')
            .select('*')
            .eq('stripe_customer_id', customerId)
            .single()

          if (org) {
            // Update subscription status
            await supabase
              .from('pyma_subscriptions')
              .update({
                plan: 'monthly',
                status: subscription.status === 'active' ? 'active' : 'canceled',
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
              })
              .eq('organization_id', org.id)

            // Update organization billing date
            await supabase
              .from('pyma_organizations')
              .update({
                plan: 'monthly',
                billing_date: new Date(subscription.current_period_end * 1000),
                status: subscription.status === 'active' ? 'active' : 'canceled',
              })
              .eq('id', org.id)
          }
        }
        break

      case 'invoice.payment_succeeded':
        {
          const invoice = event.data.object as Stripe.Invoice
          const customerId = invoice.customer as string

          // Find organization and update next billing date
          const { data: org } = await supabase
            .from('pyma_organizations')
            .select('*')
            .eq('stripe_customer_id', customerId)
            .single()

          if (org) {
            await supabase
              .from('pyma_organizations')
              .update({
                billing_date: new Date((invoice.lines.data[0]?.period?.end || 0) * 1000),
              })
              .eq('id', org.id)
          }
        }
        break

      case 'invoice.payment_failed':
        {
          const invoice = event.data.object as Stripe.Invoice
          const customerId = invoice.customer as string

          // Mark as payment failed
          const { data: org } = await supabase
            .from('pyma_organizations')
            .select('*')
            .eq('stripe_customer_id', customerId)
            .single()

          if (org) {
            await supabase
              .from('pyma_organizations')
              .update({ status: 'payment_failed' })
              .eq('id', org.id)

            // TODO: Send email notification
          }
        }
        break

      case 'customer.subscription.deleted':
        {
          const subscription = event.data.object as Stripe.Subscription
          const customerId = subscription.customer as string

          // Mark as canceled
          const { data: org } = await supabase
            .from('pyma_organizations')
            .select('*')
            .eq('stripe_customer_id', customerId)
            .single()

          if (org) {
            await supabase
              .from('pyma_organizations')
              .update({ status: 'canceled' })
              .eq('id', org.id)

            await supabase
              .from('pyma_subscriptions')
              .update({ status: 'canceled' })
              .eq('organization_id', org.id)
          }
        }
        break
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
