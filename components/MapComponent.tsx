'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'

interface MapComponentProps {
  startLocation?: string
  endLocation?: string
  height?: string
  showRoute?: boolean
}

export default function MapComponent({ 
  startLocation, 
  endLocation, 
  height = '400px',
  showRoute = true 
}: MapComponentProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Mock map component since we can't load external scripts easily
  return (
    <div 
      className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden"
      style={{ height }}
    >
      {!mapLoaded ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : (
        <div className="relative h-full">
          {/* Mock map background */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#34D399" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Location markers */}
          {startLocation && (
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-green-500 rounded-full p-2 shadow-lg animate-pulse">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                {startLocation}
              </div>
            </div>
          )}

          {endLocation && endLocation !== 'Just Items Delivery' && (
            <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
              <div className="bg-red-500 rounded-full p-2 shadow-lg animate-bounce">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                {endLocation}
              </div>
            </div>
          )}

          {/* Route line */}
          {showRoute && startLocation && endLocation && endLocation !== 'Just Items Delivery' && (
            <svg className="absolute inset-0 pointer-events-none">
              <line 
                x1="25%" 
                y1="25%" 
                x2="75%" 
                y2="75%" 
                stroke="#60A5FA" 
                strokeWidth="3" 
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          )}

          {/* Eco badge */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            🌱 Eco Route
          </div>

          {/* Distance/Time info */}
          {startLocation && endLocation && (
            <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg">
              <div className="text-xs text-gray-600">Estimated</div>
              <div className="text-sm font-semibold text-gray-900">15 min • 5.2 mi</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}