'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AirBearLogo from '@/components/AirBearLogo'
import { supabase } from "@/lib/supabase"
import { updateRide } from "@/lib/airbear-data"
import MapComponent from '@/components/MapComponent'
import { Phone, Receipt, X, User, Star, Clock, MapPin } from 'lucide-react'

export default function InRoutePage() {
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [driverInfo] = useState({
    name: 'Alex Rodriguez',
    rating: 4.8,
    trips: 342,
    chariot: 'SolarBear #7',
    phone: '+1 (555) 123-4567',
    eta: '3 minutes',
    image: '/api/placeholder/driver'
  })

  useEffect(() => {
    const bookingData = localStorage.getItem('current_booking')
    if (bookingData) {
      setBooking(JSON.parse(bookingData))
    } else {
      router.push('/book')
    }
  }, [router])

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this ride?")) {
      if (supabase && booking?.rideId) {
        try { await updateRide(Number(booking.rideId), { status: "cancelled" }) }
        catch { return }
      }
      localStorage.removeItem("current_booking")
      router.push("/book")
    }
  }

  const handleMeetDriver = () => {
    router.push('/arrival')
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Status Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AirBearLogo size="lg" clickable={false} />
            <div>
              <h1 className="text-2xl font-bold text-green-600">Driver In Route! 🚗💨</h1>
              <p className="text-gray-600">Your eco-friendly ride is on the way</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map & Route Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Live Route Tracking</h3>
              </div>
              <div className="h-80">
                <MapComponent 
                  startLocation={booking.startSpot}
                  endLocation={booking.arrivalSpot}
                  height="100%"
                  showRoute={true}
                />
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Trip Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">From</span>
                  </div>
                  <span className="font-medium">{booking.startSpot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">To</span>
                  </div>
                  <span className="font-medium">{booking.arrivalSpot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Distance</span>
                  </div>
                  <span className="font-medium">{booking.estimatedDistance}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      ${booking.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Info & Actions */}
          <div className="space-y-4">
            {/* Driver Profile */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Your Driver</h3>
              
              <div className="flex items-start space-x-4">
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

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">ETA to pickup</span>
                  <span className="text-lg font-bold text-green-600">{driverInfo.eta}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.open(`tel:${driverInfo.phone}`, '_self')}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call Driver</span>
              </button>

              <button
                onClick={() => alert('Receipt will be available after trip completion')}
                className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Receipt className="w-5 h-5" />
                <span>View Receipt</span>
              </button>

              <button
                onClick={handleCancel}
                className="w-full flex items-center justify-center space-x-2 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Cancel Ride</span>
              </button>
            </div>

            {/* Meet Driver Button */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-1">
              <button
                onClick={handleMeetDriver}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                🚗 Driver Has Arrived - Meet Driver
              </button>
            </div>
          </div>
        </div>

        {/* Status Updates */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-blue-800">Live Updates</p>
              <p className="text-sm text-blue-700">
                Driver is navigating to your pickup location. You&apos;ll receive a notification when they arrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}