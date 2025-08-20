'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AirBearLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  clickable?: boolean
}

export default function AirBearLogo({ 
  size = 'md', 
  className = '', 
  clickable = true 
}: AirBearLogoProps) {
  const router = useRouter()
  const [isGlowing, setIsGlowing] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const handleClick = () => {
    if (clickable) {
      setIsGlowing(true)
      setTimeout(() => setIsGlowing(false), 600)
      router.push('/')
    }
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${clickable ? 'cursor-pointer' : ''} 
        ${isGlowing ? 'animate-pulse' : ''} 
        ${className}
        transition-all duration-300 hover:scale-110
      `}
      onClick={handleClick}
    >
      <div className={`
        w-full h-full rounded-full bg-gradient-to-br from-green-400 via-yellow-400 to-orange-500
        ${isGlowing ? 'shadow-lg shadow-green-400/50' : 'shadow-md'}
        flex items-center justify-center text-white font-bold
        ${size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'}
      `}>
        🐻
      </div>
    </div>
  )
}