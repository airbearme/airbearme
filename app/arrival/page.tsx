'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AirBearLogo from '@/components/AirBearLogo'
import { Star, Phone, Receipt, User, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { updateRide } from '@/lib/airbear-data'

export default function ArrivalPage() {
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [showThankYou, setShowThankYou] = useState(false)
  const [completionError, setCompletionError] = useState("")

  const driverInfo = {
    name: 'Alex Rodriguez',
    rating: 4.8,
    trips: 342,
    chariot: 'SolarBear #7',
    phone: '+1 (555) 123-4567'
  }

  useEffect(() => {
    const bookingData = localStorage.getItem('current_booking')
    if (bookingData) {
      setBooking(JSON.parse(bookingData))
    } else {
      router.push('/book')
    }

    // Auto show thank you after 2 seconds
    const timer = setTimeout(() => {
      setShowThankYou(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  const handleRating = (stars: number) => {
    setRating(stars)
  }

  const handleComplete = async () => {
    setCompletionError("")
    if (supabase && booking?.rideId) {
      try {
        await updateRide(Number(booking.rideId), { status: 'completed', rating: rating || null })
      } catch (error) {
        setCompletionError(error instanceof Error ? error.message : 'Unable to complete the ride.')
        return
      }
    }
    const trip = { ...booking, driverInfo, rating, completedAt: new Date().toISOString(), status: 'completed' }
    const existingTrips = JSON.parse(localStorage.getItem('trip_history') || '[]')
    localStorage.setItem('trip_history', JSON.stringify([trip, ...existingTrips]))
    localStorage.removeItem('current_booking')
    router.push('/travel-log')
  }

  if (!booking) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Thank You Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <AirBearLogo size="xl" clickable={false} />
          </div>
          
          {showThankYou && (
            <div className="animate-bounce mb-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            {showThankYou ? '🎉 Thank You!' : 'Trip in Progress...'}
          </h1>
          <p className="text-gray-600">
            {showThankYou ? 'Your eco-friendly journey is complete!' : 'Arriving at destination...'}
          </p>
        </div>

        {showThankYou && (
          <>
            {/* Trip Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Trip Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{booking.startSpot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{booking.arrivalSpot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{booking.estimatedDistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{booking.estimatedTime}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${booking.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Rating */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Rate Your Driver</h3>
              
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {driverInfo.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{driverInfo.name}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{driverInfo.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{driverInfo.trips} trips</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{driverInfo.chariot}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-3">How was your ride?</p>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {rating === 5 ? '🌟 Excellent!' : 
                     rating === 4 ? '😊 Great!' : 
                     rating === 3 ? '👍 Good!' : 
                     rating === 2 ? '😐 Okay' : '😞 Poor'}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => window.open(`tel:${driverInfo.phone}`, '_self')}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Driver</span>
                </button>

                <button
                  onClick={() => alert('Receipt sent to your email!')}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Receipt className="w-5 h-5" />
                  <span>Get Receipt</span>
                </button>
              </div>
            </div>

            {/* Complete Trip */}
            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Trip Completed ✨
            </button>

            {/* Eco Impact */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-center">
                <h4 className="font-semibold text-green-800 mb-2">🌱 Eco Impact</h4>
                <p className="text-sm text-green-700">
                  This solar-powered ride saved approximately <strong>2.3 lbs of CO₂</strong> compared to traditional vehicles!
                </p>
              </div>
            </div>
          </>
        )}

        {!showThankYou && (
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
            </div>
            <p className="text-gray-600">Finalizing your journey...</p>
          </div>
        )}
      </div>
    </Layout>
  )
}