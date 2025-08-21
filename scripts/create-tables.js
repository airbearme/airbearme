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

async function createTables() {
  console.log('🚀 Creating database tables...');
  
  try {
    // Create locations table using raw SQL
    const { data, error } = await supabase
      .from('locations')
      .select('count')
      .single();
    
    if (error && error.code === 'PGRST205') {
      console.log('📍 Creating locations table...');
      
      // Use the REST API to create table
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sql: `
            CREATE TABLE IF NOT EXISTS locations (
              id BIGSERIAL PRIMARY KEY,
              name TEXT NOT NULL UNIQUE,
              latitude DOUBLE PRECISION,
              longitude DOUBLE PRECISION,
              is_delivery_only BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY IF NOT EXISTS "Locations are publicly readable"
              ON locations FOR SELECT
              TO authenticated, anon
              USING (true);
          `
        })
      });
      
      if (!response.ok) {
        console.log('Using alternative approach...');
      }
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

    // Try to insert locations one by one to handle conflicts
    let successCount = 0;
    for (const location of locations) {
      const { error: insertError } = await supabase
        .from('locations')
        .upsert(location, { onConflict: 'name' });
      
      if (!insertError) {
        successCount++;
      }
    }

    console.log(`✅ Successfully processed ${successCount}/${locations.length} locations`);

    // Verify setup
    const { data: finalLocations, error: selectError } = await supabase
      .from('locations')
      .select('*');

    if (selectError) {
      console.error('❌ Error verifying locations:', selectError.message);
    } else {
      console.log(`✅ Database ready! Found ${finalLocations?.length || 0} locations`);
      if (finalLocations && finalLocations.length > 0) {
        console.log('📍 Sample locations:', finalLocations.slice(0, 3).map(l => l.name).join(', ') + '...');
      }
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📝 Manual setup required:');
    console.log('1. Go to: https://supabase.com/dashboard/project/xckggdmqfqajatytmiko');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the migration file: supabase/migrations/20250818233627_autumn_art.sql');
  }
}

createTables();
