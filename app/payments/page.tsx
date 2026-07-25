'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AirBearLogo from '@/components/AirBearLogo'
import { CreditCard, Smartphone, DollarSign, CheckCircle } from 'lucide-react'

export default function PaymentsPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [paymentError, setPaymentError] = useState("")
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError("")
    if (paymentMethod === "cash" || paymentMethod === "card_on_cart") {
      localStorage.setItem("payment_method", JSON.stringify({ method: paymentMethod, timestamp: new Date().toISOString() }))
      setSaved(true)
      setTimeout(() => router.back(), 1500)
      return
    }
    const amount = Number(new URLSearchParams(window.location.search).get("amount"))
    if (!Number.isInteger(amount) || amount < 50) {
      setPaymentError("Return to booking and choose a ride amount before opening secure checkout.")
      return
    }
    const { data: sessionData } = supabase ? await supabase.auth.getSession() : { data: { session: null } }
    if (!sessionData.session) { setPaymentError("Sign in before starting card checkout."); return }
    const response = await fetch("/api/payments/checkout", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionData.session.access_token}` }, body: JSON.stringify({ amount, description: "AirBear ride" }) })
    const result = await response.json()
    if (!response.ok || !result.url) { setPaymentError(result.error || "Unable to start secure checkout."); return }
    window.location.assign(result.url)
  }

  if (saved) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Payment Method Saved!</h2>
              <p className="text-gray-300">Redirecting you back to booking...</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AirBearLogo size="lg" clickable={false} />
            <div>
              <h1 className="text-2xl font-bold text-white">Payment Method</h1>
              <p className="text-gray-300">Choose how you&apos;d like to pay</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Payment Options
            </label>
            
            <div className="space-y-2">
              {[
                { id: 'card', label: 'Card Pay in App', icon: CreditCard, desc: 'Secure payment with credit/debit card' },
                { id: 'cash', label: 'Cash', icon: DollarSign, desc: 'Pay cash to driver' },
                { id: 'card_on_cart', label: 'Card Pay on Cart', icon: Smartphone, desc: 'Pay using card reader on rickshaw' }
              ].map(method => (
                <div
                  key={method.id}
                  className={`
                    border-2 rounded-lg p-4 cursor-pointer transition-all
                    ${paymentMethod === method.id 
                      ? 'border-green-500 bg-green-900/30' 
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800'
                    }
                  `}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-1"
                    />
                    <method.icon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-white">{method.label}</h3>
                      <p className="text-sm text-gray-400">{method.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {paymentError && <p className="text-sm text-red-400" role="alert">{paymentError}</p>}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Save Payment Method
            </button>
          </div>
        </form>
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
          <p className="text-sm text-blue-300">Card payments open Stripe Checkout, which securely supports cards and eligible Apple Pay, Google Pay, and Cash App Pay wallets. AirBear never receives or stores card numbers.</p>
        </div>
      </div>
    </Layout>
  )
}