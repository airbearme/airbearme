'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AirBearLogo from '@/components/AirBearLogo'
import { ArrowRight, MapPin, ShoppingBag, Leaf, Zap, Users, Star } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('airbear_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  const features = [
    {
      icon: Leaf,
      title: 'Solar-Powered',
      description: '100% renewable energy rickshaws',
      color: 'text-green-500'
    },
    {
      icon: ShoppingBag,
      title: 'Onboard Bodega',
      description: 'Fresh snacks & essentials during your ride',
      color: 'text-blue-500'
    },
    {
      icon: MapPin,
      title: '16 Locations',
      description: 'Convenient pickup and drop-off spots',
      color: 'text-purple-500'
    },
    {
      icon: Zap,
      title: 'Real-time Tracking',
      description: 'Live updates on your ride status',
      color: 'text-yellow-500'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing eco-friendly service! Love the onboard snacks.',
      avatar: 'SJ'
    },
    {
      name: 'Mike Chen',
      rating: 5,
      comment: 'Solar-powered rides are the future. So smooth and quiet!',
      avatar: 'MC'
    },
    {
      name: 'Emily Davis',
      rating: 4,
      comment: 'Great app, friendly drivers, and guilt-free transportation.',
      avatar: 'ED'
    }
  ]

  return (
    <Layout showHeader={false}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <AirBearLogo size="xl" clickable={false} className="animate-pulse" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-500 via-blue-600 to-yellow-500 bg-clip-text text-transparent">
                AirBear
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl font-bold text-white mb-4">
              🌱 Ride Green, Snack Smart – AirBear the Eco Way!
            </p>
            
            <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the future of sustainable transportation with our solar-powered rickshaw 
              ride-sharing service featuring onboard bodegas for all your journey needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <button
                  onClick={() => router.push('/book')}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Book Your Ride</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="border-2 border-green-500 text-green-400 hover:bg-green-900/30 hover:text-green-300 font-semibold py-4 px-8 rounded-lg transition-all duration-200"
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg hover:shadow-xl hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1">
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* T-shirt Promo Banner */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-1 mb-16 shadow-2xl">
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-6xl mb-6 animate-bounce">👕⭐</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Exclusive CEO T-Shirt - $100
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Get unlimited rides for 1 year + hand-signed CEO t-shirt!<br/>
                <span className="text-base text-yellow-400 font-semibold">(Worth $1,300 - Limited to 500 units)</span>
              </p>
              <button
                onClick={() => router.push('/tshirt-promo')}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                Get Exclusive T-Shirt 🔥
              </button>
            </div>
          </div>

          {/* Testimonials */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">What Our Riders Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 shadow-lg hover:shadow-xl hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.avatar}
                    </div>
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-base mb-4 italic leading-relaxed">&quot;{testimonial.comment}&quot;</p>
                  <p className="font-semibold text-white text-lg">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-10 shadow-2xl text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Go Green?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of eco-conscious riders who have made the switch to sustainable transportation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => router.push(user ? '/book' : '/register')}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                {user ? 'Book Now' : 'Start Riding Today'}
              </button>
              <button
                onClick={() => router.push('/travel-log')}
                className="border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg"
              >
                View Travel History
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}