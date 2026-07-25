import { supabase } from '@/lib/supabase'

export type AirBearLocation = {
  id: number
  name: string
  latitude: number | null
  longitude: number | null
  is_delivery_only?: boolean
}

export type AirBearInventoryItem = {
  id: number
  name: string
  category: string
  price: number
  stock_quantity?: number
  is_available?: boolean
}

export type CartItem = {
  item: AirBearInventoryItem
  quantity: number
}
const fallbackLocations: AirBearLocation[] = [
  [1, "Court Street Downtown", 42.099118, -75.917538], [2, "Riverwalk BU Center", 42.098765, -75.916543], [3, "Confluence Park", 42.090123, -75.912345],
  [4, "Southside Walking Bridge", 42.091409, -75.914568], [5, "General Hospital", 42.086741, -75.915711], [6, "McArthur Park", 42.086165, -75.926153],
  [7, "Greenway Path", 42.086678, -75.932483], [8, "Vestal Center", 42.091851, -75.951729], [9, "Innovation Park", 42.093877, -75.958331],
  [10, "BU East Gym", 42.091695, -75.963590], [11, "BU Fine Arts Building", 42.089282, -75.967441], [12, "Whitney Hall", 42.088456, -75.965432],
  [13, "Student Union", 42.086903, -75.966704], [14, "Appalachian Dining", 42.084523, -75.971264], [15, "Hinman Dining Hall", 42.086314, -75.973292],
  [16, "BU Science Building", 42.090227, -75.972315], [17, "Just Items Delivery", null, null],
].map(([id, name, latitude, longitude]) => ({ id: Number(id), name: String(name), latitude: latitude === null ? null : Number(latitude), longitude: longitude === null ? null : Number(longitude), is_delivery_only: id === 17 }))

const fallbackInventory: AirBearInventoryItem[] = [
  [1, "Energy Bars", "snacks", 3.5], [2, "Trail Mix", "snacks", 4], [3, "Fruit Chips", "snacks", 2.75], [4, "Granola Bites", "snacks", 3.25],
  [5, "Solar Tea", "drinks", 2.5], [6, "Coconut Water", "drinks", 3], [7, "Green Smoothie", "drinks", 4.5], [8, "Cold Press Juice", "drinks", 5],
  [9, "Phone Charger", "misc", 15], [10, "Eco Bags", "misc", 8], [11, "Hand Sanitizer", "misc", 4.5], [12, "Sunscreen", "misc", 12],
].map(([id, name, category, price]) => ({ id: Number(id), name: String(name), category: String(category), price: Number(price), stock_quantity: 999, is_available: true }))
export async function fetchLocations(): Promise<AirBearLocation[]> {
  if (!supabase) return fallbackLocations

  const { data, error } = await supabase
    .from('locations')
    .select('id, name, latitude, longitude, is_delivery_only')
    .order('name')

  if (error) throw new Error(error.message)
  return data as AirBearLocation[]
}

export async function fetchInventory(): Promise<AirBearInventoryItem[]> {
  if (!supabase) return fallbackInventory

  const { data, error } = await supabase
    .from('inventory')
    .select('id, name, category, price, stock_quantity, is_available')
    .eq('is_available', true)
    .gt('stock_quantity', 0)
    .order('category')
    .order('name')

  if (error) throw new Error(error.message)
  return data.map(item => ({ ...item, price: Number(item.price) })) as AirBearInventoryItem[]
}

export async function createRide(input: {
  startSpot: string
  arrivalSpot: string
  riders: number
  items: CartItem[]
  totalCost: number
  estimatedTime: string
  estimatedDistance: string
  specialNotes: string
}): Promise<number | null> {
  if (!supabase) return null

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) throw new Error('Please sign in before booking a ride.')

  const locations = await fetchLocations()
  const start = locations.find(location => location.name === input.startSpot)
  const end = locations.find(location => location.name === input.arrivalSpot)
  if (!start || !end) throw new Error('Please choose valid pickup and destination locations.')

  const itemsTotal = input.items.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0)
  const baseFare = Math.max(0, input.totalCost - itemsTotal)
  const { data: ride, error: rideError } = await supabase
    .from('rides')
    .insert({
      user_id: authData.user.id,
      start_location_id: start.id,
      end_location_id: end.id,
      num_riders: input.riders,
      distance_miles: Number.parseFloat(input.estimatedDistance),
      estimated_time_minutes: Number.parseInt(input.estimatedTime, 10),
      base_fare: baseFare,
      items_total: itemsTotal,
      total_amount: input.totalCost,
      status: 'pending',
      special_notes: input.specialNotes || null,
    })
    .select('id')
    .single()

  if (rideError || !ride) throw new Error(rideError?.message || 'Unable to create the ride.')

  if (input.items.length) {
    const { error: itemsError } = await supabase.from('ride_items').insert(
      input.items.map(entry => ({
        ride_id: ride.id,
        inventory_id: entry.item.id,
        quantity: entry.quantity,
        unit_price: entry.item.price,
        total_price: entry.item.price * entry.quantity,
      }))
    )
    if (itemsError) throw new Error(itemsError.message)
  }

  return ride.id
}

export async function updateRide(rideId: number, values: Record<string, unknown>) {
  if (!supabase) return
  const { error } = await supabase.from('rides').update(values).eq('id', rideId)
  if (error) throw new Error(error.message)
}

export async function fetchUserRides() {
  if (!supabase) return null
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return []
  const { data, error } = await supabase
    .from('rides')
    .select('id, status, total_amount, created_at, rating, start_location:locations!rides_start_location_id_fkey(name), end_location:locations!rides_end_location_id_fkey(name)')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}
