const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  try {
    console.log('🚀 Setting up AirBear database...');
    
    // Create locations table
    console.log('📍 Creating locations table...');
    const { error: createError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS locations (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          is_delivery_only BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (createError) {
      console.log('Table may already exist or using direct insert approach...');
    }

    // Insert GPS locations
    console.log('📍 Inserting GPS locations...');
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

    // Clear existing locations first
    const { error: deleteError } = await supabase
      .from('locations')
      .delete()
      .neq('id', 0);

    if (deleteError) {
      console.log('Note: Could not clear existing locations (table may not exist yet)');
    }

    // Insert new locations
    const { data, error: insertError } = await supabase
      .from('locations')
      .insert(locations);

    if (insertError) {
      console.error('❌ Error inserting locations:', insertError);
      return;
    }

    console.log('✅ Successfully inserted GPS locations');

    // Verify the setup
    const { data: finalLocations, error: selectError } = await supabase
      .from('locations')
      .select('*');

    if (selectError) {
      console.error('❌ Error verifying locations:', selectError);
    } else {
      console.log(`✅ Database setup complete! Found ${finalLocations?.length || 0} locations`);
      console.log('📍 Locations:', finalLocations?.map(l => l.name).slice(0, 5).join(', ') + '...');
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

setupDatabase();
