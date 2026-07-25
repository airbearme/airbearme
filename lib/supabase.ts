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
