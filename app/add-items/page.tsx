'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AirBearLogo from '@/components/AirBearLogo'
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react'
import { fetchInventory, type AirBearInventoryItem } from '@/lib/airbear-data'

export default function AddItemsPage() {
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<string[]>(['snacks'])
  const [cart, setCart] = useState<Record<number, number>>({})
  const [riders, setRiders] = useState(1)
  const [inventory, setInventory] = useState<AirBearInventoryItem[]>([])

  useEffect(() => {
    fetchInventory().then(setInventory)
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateQuantity = (itemId: number, change: number) => {
    setCart(prev => {
      const currentQty = prev[itemId] || 0
      const newQty = Math.max(0, currentQty + change)
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [itemId]: newQty }
    })
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = inventory
        .find(item => item.id === parseInt(itemId))
      return total + (item ? item.price * quantity : 0)
    }, 0)
  }

  const getCartItems = () => {
    return Object.entries(cart).map(([itemId, quantity]) => {
      const item = inventory
        .find(item => item.id === parseInt(itemId))
      return { item, quantity }
    }).filter(({ item }) => item)
  }

  const handleSubmit = () => {
    const cartData = {
      items: getCartItems(),
      total: getCartTotal(),
      riders
    }
    localStorage.setItem('cart_items', JSON.stringify(cartData))
    router.back()
  }

  const renderSection = (title: string, key: string, items: any[]) => {
    const isExpanded = expandedSections.includes(key)
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={() => toggleSection(key)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {key === 'snacks' ? '🍿' : key === 'drinks' ? '🥤' : '🛒'}
            </span>
            <h3 className="font-semibold text-gray-900 capitalize">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    disabled={(cart[item.id] || 0) === 0}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <span className="w-8 text-center font-semibold">
                    {cart[item.id] || 0}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AirBearLogo size="lg" clickable={false} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Onboard Bodega</h1>
              <p className="text-green-600 font-medium">Fresh snacks & essentials for your journey</p>
            </div>
          </div>
        </div>

        {/* Add Riders Toggle */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Number of Riders</h3>
              <p className="text-sm text-gray-600">How many people will be riding?</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setRiders(Math.max(1, riders - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-semibold w-8 text-center">{riders}</span>
              <button
                onClick={() => setRiders(Math.min(6, riders + 1))}
                className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-green-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Items Sections */}
        <div className="space-y-4 mb-6">
          {renderSection('Snacks', 'snacks', inventory.filter(item => item.category === 'snacks'))}
          {renderSection('Drinks', 'drinks', inventory.filter(item => item.category === 'drinks'))}
          {renderSection('Misc Items', 'misc', inventory.filter(item => item.category === 'misc'))}
        </div>

        {/* Cart Summary */}
        {Object.keys(cart).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Cart Summary</h3>
            <div className="space-y-2">
              {getCartItems().map(({ item, quantity }) => (
                <div key={item!.id} className="flex justify-between text-sm">
                  <span>{item!.name} × {quantity}</span>
                  <span className="font-medium">${(item!.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-green-300 pt-2 flex justify-between font-semibold">
                <span>Total Items:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Booking
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold"
          >
            Add to Ride
          </button>
        </div>
      </div>
    </Layout>
  )
}