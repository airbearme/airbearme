'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import AirBearLogo from '@/components/AirBearLogo'
import { Calendar, MapPin, Clock, Star, Receipt, ChevronRight } from 'lucide-react'
import { fetchUserRides } from '@/lib/airbear-data'

export default function TravelLogPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalMiles: 0,
    totalSaved: 0,
    co2Saved: 0
  })

  useEffect(() => {
    const loadTrips = async () => {
      const remoteTrips = await fetchUserRides().catch(() => null)
      const tripHistory = remoteTrips !== null
        ? remoteTrips.map((trip: any) => {
            const start = Array.isArray(trip.start_location) ? trip.start_location[0] : trip.start_location
            const end = Array.isArray(trip.end_location) ? trip.end_location[0] : trip.end_location
            return { ...trip, startSpot: start?.name || "Unknown", arrivalSpot: end?.name || "Unknown", totalCost: Number(trip.total_amount || 0), estimatedDistance: String(Number(trip.distance_miles || 0)) + " miles", estimatedTime: String(trip.estimated_time_minutes || 0) + " minutes", completedAt: trip.created_at }
          })
        : JSON.parse(localStorage.getItem("trip_history") || "[]")
      setTrips(tripHistory)
      const totalTrips = tripHistory.length
      const totalMiles = tripHistory.reduce((sum: number, trip: any) => sum + Number.parseFloat(String(trip.estimatedDistance || "0")), 0)
      const totalSaved = tripHistory.reduce((sum: number, trip: any) => sum + Number(trip.totalCost || 0), 0)
      setStats({ totalTrips, totalMiles, totalSaved, co2Saved: totalMiles * 0.89 })
    }
    loadTrips()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AirBearLogo size="lg" clickable={false} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Travel Log</h1>
              <p className="text-green-600 font-medium">Your eco-friendly journey history</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.totalTrips}</div>
            <div className="text-sm text-gray-600">Total Rides</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.totalMiles.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Miles Traveled</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">${stats.totalSaved.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.co2Saved.toFixed(1)}</div>
            <div className="text-sm text-gray-600">lbs CO₂ Saved</div>
          </div>
        </div>

        {/* Trip List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Trips</h3>
          </div>

          {trips.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
              <p className="text-gray-600 mb-6">Start your first eco-friendly journey with AirBear!</p>
              <button
                onClick={() => window.location.href = '/book'}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Book Your First Ride
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {trips.map((trip, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status || 'completed')}`}>
                          {trip.status || 'completed'}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(trip.completedAt || trip.timestamp)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{trip.startSpot}</div>
                            <div className="text-gray-600">to {trip.arrivalSpot}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{trip.estimatedTime}</span>
                          </div>
                          {trip.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{trip.rating}/5</span>
                            </div>
                          )}
                        </div>

                        {trip.driverInfo && (
                          <div className="text-sm text-gray-600">
                            Driver: {trip.driverInfo.name} • {trip.driverInfo.chariot}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${trip.totalCost.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">{trip.estimatedDistance}</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alert('Receipt details:\n\n' + JSON.stringify(trip, null, 2))}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Receipt className="w-5 h-5" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Eco Impact Summary */}
        {trips.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="text-center">
              <h4 className="font-semibold text-green-800 mb-3">🌱 Your Eco Impact</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold text-green-700">{stats.co2Saved.toFixed(1)} lbs</div>
                  <div className="text-green-600">CO₂ Emissions Saved</div>
                </div>
                <div>
                  <div className="font-bold text-blue-700">{stats.totalMiles.toFixed(1)} miles</div>
                  <div className="text-blue-600">Solar-Powered Travel</div>
                </div>
              </div>
              <p className="text-xs text-green-700 mt-3">
                Thank you for choosing sustainable transportation! 🌍
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}