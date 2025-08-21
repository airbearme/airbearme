-- AirBear Database Schema - Fixed for Supabase
-- Run this in Supabase SQL Editor

-- Step 1: Create tables first (without foreign keys that reference other tables)

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_delivery_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  phone TEXT,
  profile_image_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory table (no dependencies)
CREATE TABLE IF NOT EXISTS inventory (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_trips INTEGER DEFAULT 0,
  current_location_lat DOUBLE PRECISION,
  current_location_lng DOUBLE PRECISION,
  chariot_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chariots table
CREATE TABLE IF NOT EXISTS chariots (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  battery_percentage INTEGER DEFAULT 100,
  solar_panel_status TEXT DEFAULT 'active',
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  is_available BOOLEAN DEFAULT TRUE,
  driver_id UUID REFERENCES drivers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rides table
CREATE TABLE IF NOT EXISTS rides (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  driver_id UUID REFERENCES drivers(id),
  chariot_id BIGINT REFERENCES chariots(id),
  start_location_id BIGINT REFERENCES locations(id),
  end_location_id BIGINT REFERENCES locations(id),
  num_riders INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  distance_miles DECIMAL(10,2),
  estimated_time_minutes INTEGER,
  base_fare DECIMAL(10,2),
  items_total DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2),
  payment_method TEXT,
  special_notes TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ride items table
CREATE TABLE IF NOT EXISTS ride_items (
  id BIGSERIAL PRIMARY KEY,
  ride_id BIGINT REFERENCES rides(id) ON DELETE CASCADE,
  inventory_id BIGINT REFERENCES inventory(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- T-shirt purchases table
CREATE TABLE IF NOT EXISTS tshirt_purchases (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  amount DECIMAL(10,2) DEFAULT 100.00,
  stripe_payment_intent_id TEXT,
  is_unlimited_rides_active BOOLEAN DEFAULT TRUE,
  rides_used_today INTEGER DEFAULT 0,
  last_ride_date DATE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  ride_id BIGINT REFERENCES rides(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  location_sharing BOOLEAN DEFAULT TRUE,
  preferred_payment_method TEXT DEFAULT 'card',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chariots ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tshirt_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies
-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Locations are publicly readable" ON locations;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Inventory is readable by authenticated users" ON inventory;
DROP POLICY IF EXISTS "Users can read own rides" ON rides;
DROP POLICY IF EXISTS "Users can create rides" ON rides;

-- Create new policies
CREATE POLICY "Locations are publicly readable"
  ON locations FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Inventory is readable by authenticated users"
  ON inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own rides"
  ON rides FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR driver_id = auth.uid());

CREATE POLICY "Users can create rides"
  ON rides FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Step 4: Insert sample data
-- Insert GPS locations
INSERT INTO locations (name, latitude, longitude, is_delivery_only) VALUES
('Court Street Downtown', 42.099118, -75.917538, false),
('Riverwalk BU Center', 42.098765, -75.916543, false),
('Confluence Park', 42.090123, -75.912345, false),
('Southside Walking Bridge', 42.091409, -75.914568, false),
('General Hospital', 42.086741, -75.915711, false),
('McArthur Park', 42.086165, -75.926153, false),
('Greenway Path', 42.086678, -75.932483, false),
('Vestal Center', 42.091851, -75.951729, false),
('Innovation Park', 42.093877, -75.958331, false),
('BU East Gym', 42.091695, -75.963590, false),
('BU Fine Arts Building', 42.089282, -75.967441, false),
('Whitney Hall', 42.088456, -75.965432, false),
('Student Union', 42.086903, -75.966704, false),
('Appalachian Dining', 42.084523, -75.971264, false),
('Hinman Dining Hall', 42.086314, -75.973292, false),
('BU Science Building', 42.090227, -75.972315, false)
ON CONFLICT (name) DO NOTHING;

-- Insert inventory items
INSERT INTO inventory (name, category, price, stock_quantity, is_available) VALUES
('Energy Bars', 'snacks', 3.50, 50, true),
('Trail Mix', 'snacks', 4.00, 30, true),
('Fruit Chips', 'snacks', 2.75, 40, true),
('Granola Bites', 'snacks', 3.25, 35, true),
('Solar Tea', 'drinks', 2.50, 25, true),
('Coconut Water', 'drinks', 3.00, 20, true),
('Green Smoothie', 'drinks', 4.50, 15, true),
('Cold Press Juice', 'drinks', 5.00, 12, true),
('Phone Charger', 'misc', 15.00, 10, true),
('Eco Bags', 'misc', 8.00, 25, true),
('Hand Sanitizer', 'misc', 4.50, 30, true),
('Sunscreen', 'misc', 12.00, 15, true)
ON CONFLICT DO NOTHING;
