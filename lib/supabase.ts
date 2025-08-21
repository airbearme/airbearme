import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials (not placeholder values)
const hasValidSupabase = supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your_anon_key_here' &&
  supabaseUrl.includes('supabase.co')

export const supabase = hasValidSupabase 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null // Use null to indicate mock mode

// GPS locations from spots.csv
export const mockLocations = [
  { id: 1, name: 'Court Street Downtown', latitude: 42.099118, longitude: -75.917538 },
  { id: 2, name: 'Riverwalk BU Center', latitude: 42.098765, longitude: -75.916543 },
  { id: 3, name: 'Confluence Park', latitude: 42.090123, longitude: -75.912345 },
  { id: 4, name: 'Southside Walking Bridge', latitude: 42.091409, longitude: -75.914568 },
  { id: 5, name: 'General Hospital', latitude: 42.086741, longitude: -75.915711 },
  { id: 6, name: 'McArthur Park', latitude: 42.086165, longitude: -75.926153 },
  { id: 7, name: 'Greenway Path', latitude: 42.086678, longitude: -75.932483 },
  { id: 8, name: 'Vestal Center', latitude: 42.091851, longitude: -75.951729 },
  { id: 9, name: 'Innovation Park', latitude: 42.093877, longitude: -75.958331 },
  { id: 10, name: 'BU East Gym', latitude: 42.091695, longitude: -75.963590 },
  { id: 11, name: 'BU Fine Arts Building', latitude: 42.089282, longitude: -75.967441 },
  { id: 12, name: 'Whitney Hall', latitude: 42.088456, longitude: -75.965432 },
  { id: 13, name: 'Student Union', latitude: 42.086903, longitude: -75.966704 },
  { id: 14, name: 'Appalachian Dining', latitude: 42.084523, longitude: -75.971264 },
  { id: 15, name: 'Hinman Dining Hall', latitude: 42.086314, longitude: -75.973292 },
  { id: 16, name: 'BU Science Building', latitude: 42.090227, longitude: -75.972315 },
  { id: 17, name: 'Just Items Delivery', latitude: null, longitude: null }
]

export const mockInventoryItems = {
  snacks: [
    { id: 1, name: 'Energy Bars', price: 3.50 },
    { id: 2, name: 'Trail Mix', price: 4.00 },
    { id: 3, name: 'Fruit Chips', price: 2.75 },
    { id: 4, name: 'Granola Bites', price: 3.25 }
  ],
  drinks: [
    { id: 5, name: 'Solar Tea', price: 2.50 },
    { id: 6, name: 'Coconut Water', price: 3.00 },
    { id: 7, name: 'Green Smoothie', price: 4.50 },
    { id: 8, name: 'Cold Press Juice', price: 5.00 }
  ],
  misc: [
    { id: 9, name: 'Phone Charger', price: 15.00 },
    { id: 10, name: 'Eco Bags', price: 8.00 },
    { id: 11, name: 'Hand Sanitizer', price: 4.50 },
    { id: 12, name: 'Sunscreen', price: 12.00 }
  ]
}