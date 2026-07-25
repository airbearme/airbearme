import { mockInventoryItems, mockLocations, supabase } from '@/lib/supabase'

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

const fallbackInventory = Object.entries(mockInventoryItems).flatMap(([category, items]) =>
  items.map(item => ({ ...item, category, stock_quantity: 999, is_available: true }))
)

export async function fetchLocations(): Promise<AirBearLocation[]> {
  if (!supabase) return mockLocations

  const { data, error } = await supabase
    .from('locations')
    .select('id, name, latitude, longitude, is_delivery_only')
    .order('name')

  if (error || !data?.length) return mockLocations
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

  if (error || !data?.length) return fallbackInventory
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
