'use client'

import { Battery, Sun, Zap } from 'lucide-react'

interface SolarBatteryIndicatorProps {
  percentage: number
  isCharging?: boolean
}

export default function SolarBatteryIndicator({ 
  percentage, 
  isCharging = true 
}: SolarBatteryIndicatorProps) {
  const getBatteryColor = () => {
    if (percentage > 50) return 'text-green-500'
    if (percentage > 20) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getBatteryBg = () => {
    if (percentage > 50) return 'bg-green-500'
    if (percentage > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-center space-x-2">
      {isCharging && (
        <Sun className="w-4 h-4 text-yellow-500 animate-pulse" />
      )}
      <div className="flex items-center space-x-1">
        <Battery className={`w-5 h-5 ${getBatteryColor()}`} />
        <div className="w-12 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getBatteryBg()} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-semibold ${getBatteryColor()}`}>
          {percentage}%
        </span>
      </div>
      {percentage < 20 && (
        <Zap className="w-4 h-4 text-red-500 animate-bounce" />
      )}
    </div>
  )
}