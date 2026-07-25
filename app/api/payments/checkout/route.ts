import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"


const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


export async function POST(request: Request) {
  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe payments are not configured." }, { status: 503 })
  }
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 })
  }

  try {
    const authorization = request.headers.get("authorization")
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Sign in before starting checkout." }, { status: 401 })
    }
    const authClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: authData, error: authError } = await authClient.auth.getUser(authorization.slice(7))
    if (authError || !authData.user) {
      return NextResponse.json({ error: "Your session is no longer valid." }, { status: 401 })
    }
    const body = await request.json()
    const amount = Number(body.amount)
    const description = typeof body.description === "string" ? body.description : "AirBear ride"
    if (!Number.isInteger(amount) || amount < 50) {
      return NextResponse.json({ error: "Payment amount must be at least 50 cents." }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecretKey)
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://airbear-sigma.vercel.app"
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: { user_id: authData.user.id, purchase_type: body.purchaseType === "tshirt" ? "tshirt" : "ride" },
      payment_method_types: ["card", "cashapp"],
      line_items: [{ price_data: { currency: "usd", product_data: { name: description }, unit_amount: amount }, quantity: 1 }],
      success_url: `${origin}/book?payment=success`,
      cancel_url: `${origin}/payments?payment=cancelled`,
    })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start payment." }, { status: 500 })
  }
}
