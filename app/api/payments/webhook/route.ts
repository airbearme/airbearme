import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Payment webhook is not configured.' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 })

  try {
    const stripe = new Stripe(secret)
    const event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.user_id
      if (userId && session.amount_total) {
        const admin = createClient(supabaseUrl, serviceRoleKey)
        await admin.from('payments').insert({
          user_id: userId,
          amount: session.amount_total / 100,
          payment_method: 'stripe_checkout',
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          status: 'completed',
        })
        if (session.metadata?.purchase_type === "tshirt") {
          await admin.from("tshirt_purchases").insert({ user_id: userId, amount: session.amount_total / 100, stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null, is_unlimited_rides_active: true, rides_used_today: 0 })
        }
      }
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid webhook.' }, { status: 400 })
  }
}
