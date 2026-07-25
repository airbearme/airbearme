'use client'

import { useState } from 'react'
import { supabase } from "@/lib/supabase"
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AirBearLogo from '@/components/AirBearLogo'
import { Star, Gift, Calendar, Shield, CreditCard } from 'lucide-react'

export default function TShirtPromoPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const handlePurchase = async () => {
    setLoading(true)
    const { data: sessionData } = supabase ? await supabase.auth.getSession() : { data: { session: null } }
    if (!sessionData.session) { setLoading(false); setShowModal(false); router.push("/login"); return }
    const response = await fetch("/api/payments/checkout", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionData.session.access_token}` }, body: JSON.stringify({ amount: 10000, description: "AirBear CEO T-Shirt and unlimited rides", purchaseType: "tshirt" }) })
    const result = await response.json()
    if (!response.ok || !result.url) { setLoading(false); return }
    window.location.assign(result.url)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <AirBearLogo size="xl" clickable={false} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent mb-4">
            Exclusive AirBear CEO T-Shirt
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            🌱 Ride Green, Snack Smart – AirBear the Eco Way!
          </p>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full inline-block font-bold animate-pulse">
            ⭐ CEO-SIGNED EXCLUSIVE ⭐
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image & Details */}
          <div className="space-y-6">
            {/* Mock T-shirt Display */}
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8 text-center">
              <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-sm">
                <div className="text-6xl mb-4">👕</div>
                <div className="space-y-2">
                  <AirBearLogo size="lg" clickable={false} className="mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">Premium Eco-Cotton</p>
                  <p className="text-xs text-green-600">CEO Signature Edition</p>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">What&apos;s Included</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Premium organic cotton T-shirt</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">Hand-signed by AirBear CEO</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Unlimited rides for 1 full year</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">Exclusive member benefits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Purchase */}
          <div className="space-y-6">
            {/* Value Proposition */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Incredible Value!</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Regular Value Breakdown:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Premium T-shirt:</span>
                      <span>$50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unlimited rides (365 days):</span>
                      <span>$1,250</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total Value:</span>
                      <span>$1,300</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">$100</div>
                <div className="text-sm text-gray-600 mb-4">One-time payment</div>
                
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800 font-medium">
                    🔥 Limited Edition: Only 500 units available!
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🎯 Buy Now - $100
                </button>
              </div>
            </div>

            {/* Terms & Benefits */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Terms & Benefits</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Unlimited rides for 365 days from purchase date</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Maximum 1 ride per day (standard pickup/dropoff)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Bodega items sold separately</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Priority booking during peak hours</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Exclusive member-only promotions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-orange-500 font-bold">⚠</span>
                  <span>Non-transferable, non-refundable after 30 days</span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <p className="text-sm text-blue-800 italic mb-2">
                    &quot;Best investment ever! I&apos;ve saved over $800 this year and the shirt is incredibly comfortable. Plus, knowing I&apos;m helping the environment feels amazing!&quot;
                  </p>
                  <p className="text-xs text-blue-600 font-medium">- Sarah M., Early Adopter</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="text-center mb-6">
                <AirBearLogo size="lg" clickable={false} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Purchase</h3>
                <p className="text-gray-600">AirBear CEO T-shirt + Unlimited Rides</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">CEO T-shirt (Signed)</span>
                    <span>$100.00</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    ✓ Unlimited rides for 1 year<br/>
                    ✓ Premium organic cotton<br/>
                    ✓ Hand-signed by CEO
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Secure payment via Stripe Checkout</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Purchase $100'}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Test mode: No actual charges will be made
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}