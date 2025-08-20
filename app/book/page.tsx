'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AirBearLogo from '@/components/AirBearLogo'
import MapComponent from '@/components/MapComponent'
import { mockLocations } from '@/lib/supabase'
import { MapPin, Clock, Users, ShoppingBag, CreditCard, FileText } from 'lucide-react'

export default function BookPage() {
  const router = useRouter()
  const [startSpot, setStartSpot] = useState('')
  const [arrivalSpot, setArrivalSpot] = useState('')
  const [riders, setRiders] = useState(1)
  const [items, setItems] = useState([])
  const [specialNotes, setSpecialNotes] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [estimatedDistance, setEstimatedDistance] = useState('5.2 miles')
  const [estimatedTime, setEstimatedTime] = useState('15 minutes')
  const [totalCost, setTotalCost] = useState(12.50)

  useEffect(() => {
    // Check if user is logged in (mock check)
    const user = localStorage.getItem('airbear_user')
    if (!user) {
      router.push('/login')
    }
  }, [router])

  const handleCheckOut = () => {
    if (!startSpot || !arrivalSpot) {
      alert('Please select both start and arrival locations')
      return
    }
    setShowConfirmation(true)
  }

  const confirmBooking = () => {
    // Store booking data
    const booking = {
      startSpot,
      arrivalSpot,
      riders,
      items,
      specialNotes,
      totalCost,
      estimatedTime,
      estimatedDistance,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('current_booking', JSON.stringify(booking))
    router.push('/in-route')
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AirBearLogo size="lg" clickable={false} />
            <div>
              <h1 className="text-2xl font-bold text-white">Book a Ride</h1>
              <p className="text-gray-300">Choose your eco-friendly journey</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Booking Form */}
          <div className="space-y-6">
            {/* Location Selection */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-white">Select Locations</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Spot
                  </label>
                  <select
                    value={startSpot}
                    onChange={(e) => setStartSpot(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="">Select starting location</option>
                    {mockLocations.filter(loc => !loc.name.includes('Delivery')).map(location => (
                      <option key={location.id} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Spot
                  </label>
                  <select
                    value={arrivalSpot}
                    onChange={(e) => setArrivalSpot(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="">Select destination</option>
                    {mockLocations.map(location => (
                      <option key={location.id} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {startSpot && arrivalSpot && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>{estimatedTime}</span>
                    </span>
                    <span className="font-medium text-green-700">{estimatedDistance}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Riders & Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-white">Ride Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Riders
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setRiders(Math.max(1, riders - 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{riders}</span>
                    <button
                      onClick={() => setRiders(Math.min(4, riders + 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/add-items')}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Items from Bodega</span>
                </button>
              </div>
            </div>

            {/* Payment & Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-white">Payment & Notes</h3>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => router.push('/payments')}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Set Payment Method</span>
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Special Notes (Optional)
                  </label>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    rows={3}
                    placeholder="Any special instructions for your driver..."
                  />
                </div>
              </div>
            </div>

            {/* Check Out Button */}
            <button
              onClick={handleCheckOut}
              disabled={!startSpot || !arrivalSpot}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Check Out - ${totalCost.toFixed(2)}
            </button>
          </div>

          {/* Map */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-white">Route Preview</h3>
              </div>
              <div className="h-96">
                <MapComponent 
                  startLocation={startSpot} 
                  endLocation={arrivalSpot}
                  height="100%"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
              <div className="text-center mb-6">
                <AirBearLogo size="lg" clickable={false} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Confirm Your Ride</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{startSpot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{arrivalSpot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Riders:</span>
                  <span className="font-medium">{riders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="font-medium">{estimatedTime}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                >
                  Confirm Ride
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}