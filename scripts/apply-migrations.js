const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease create a .env.local file with these values.');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  try {
    console.log('Setting up AirBear database with GPS coordinates...');
    
    // First, insert the GPS locations directly
    const locations = [
      { name: 'Court Street Downtown', latitude: 42.099118, longitude: -75.917538, is_delivery_only: false },
      { name: 'Riverwalk BU Center', latitude: 42.098765, longitude: -75.916543, is_delivery_only: false },
      { name: 'Confluence Park', latitude: 42.090123, longitude: -75.912345, is_delivery_only: false },
      { name: 'Southside Walking Bridge', latitude: 42.091409, longitude: -75.914568, is_delivery_only: false },
      { name: 'General Hospital', latitude: 42.086741, longitude: -75.915711, is_delivery_only: false },
      { name: 'McArthur Park', latitude: 42.086165, longitude: -75.926153, is_delivery_only: false },
      { name: 'Greenway Path', latitude: 42.086678, longitude: -75.932483, is_delivery_only: false },
      { name: 'Vestal Center', latitude: 42.091851, longitude: -75.951729, is_delivery_only: false },
      { name: 'Innovation Park', latitude: 42.093877, longitude: -75.958331, is_delivery_only: false },
      { name: 'BU East Gym', latitude: 42.091695, longitude: -75.963590, is_delivery_only: false },
      { name: 'BU Fine Arts Building', latitude: 42.089282, longitude: -75.967441, is_delivery_only: false },
      { name: 'Whitney Hall', latitude: 42.088456, longitude: -75.965432, is_delivery_only: false },
      { name: 'Student Union', latitude: 42.086903, longitude: -75.966704, is_delivery_only: false },
      { name: 'Appalachian Dining', latitude: 42.084523, longitude: -75.971264, is_delivery_only: false },
      { name: 'Hinman Dining Hall', latitude: 42.086314, longitude: -75.973292, is_delivery_only: false },
      { name: 'BU Science Building', latitude: 42.090227, longitude: -75.972315, is_delivery_only: false },
      { name: 'Just Items Delivery', latitude: null, longitude: null, is_delivery_only: true }
    ];

    // Check if locations table exists and has data
    const { data: existingLocations, error: selectError } = await supabase
      .from('locations')
      .select('*')
      .limit(1);

    if (selectError) {
      console.log('Locations table may not exist yet. This is normal for a new database.');
    } else {
      console.log('✅ Connected to database successfully');
      
      // Clear existing locations and insert new ones
      const { error: deleteError } = await supabase
        .from('locations')
        .delete()
        .neq('id', 0); // Delete all records

      if (deleteError) {
        console.log('Note: Could not clear existing locations:', deleteError.message);
      }

      // Insert new locations
      const { data, error: insertError } = await supabase
        .from('locations')
        .insert(locations);

      if (insertError) {
        console.error('Error inserting locations:', insertError);
      } else {
        console.log('✅ Successfully inserted GPS coordinates from spots.csv');
        console.log(`📍 Added ${locations.length} locations to database`);
      }
    }

    // Test the connection by fetching locations
    const { data: finalLocations, error: finalError } = await supabase
      .from('locations')
      .select('*');

    if (finalError) {
      console.error('Error fetching locations:', finalError);
    } else {
      console.log(`✅ Database now contains ${finalLocations?.length || 0} locations`);
    }

  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

setupDatabase();
