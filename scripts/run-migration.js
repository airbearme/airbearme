const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('🚀 Running database migration...');
    
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250818233627_autumn_art.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('/*') && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
        
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log(`⚠️  Statement ${i + 1} result:`, error.message);
        } else {
          console.log(`✅ Statement ${i + 1} completed successfully`);
        }
      }
    }
    
    // Test the setup by checking locations
    const { data: locations, error: locError } = await supabase
      .from('locations')
      .select('*')
      .limit(5);
    
    if (locError) {
      console.error('❌ Error checking locations:', locError);
    } else {
      console.log(`✅ Database setup complete! Found ${locations?.length || 0} locations`);
      if (locations && locations.length > 0) {
        console.log('📍 Sample locations:', locations.map(l => l.name).join(', '));
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

runMigration();
