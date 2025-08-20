'use client'

import { ReactNode } from 'react'
import AirBearLogo from './AirBearLogo'
import SolarBatteryIndicator from './SolarBatteryIndicator'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export default function Layout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {showHeader && (
        <header className="bg-gray-800 shadow-lg border-b border-gray-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AirBearLogo size="md" />
              <div>
                <h1 className="text-xl font-bold text-white">AirBear</h1>
                <p className="text-xs text-green-400 font-medium">Ride Green, Snack Smart</p>
              </div>
            </div>
            <SolarBatteryIndicator percentage={78} />
          </div>
        </header>
      )}

      <main className="flex-1 bg-gray-900">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-gray-800 border-t border-gray-700 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AirBearLogo size="sm" />
              <div className="text-center">
                <p className="text-sm font-semibold text-white">AirBear</p>
                <p className="text-xs text-green-400">Eco-Friendly Rides</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                © 2024 AirBear. All rights reserved.
              </p>
              <p className="text-xs text-green-400 font-medium">
                🌱 Ride Green, Snack Smart – AirBear the Eco Way!
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}