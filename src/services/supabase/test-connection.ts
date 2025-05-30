import { supabase } from './client';

export async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth status:', user ? 'Authenticated' : 'Not authenticated');
    if (authError) {
      console.log('Auth error:', authError.message);
    }

    // Test notifications table
    console.log('\n📧 Testing notifications table...');
    const { data: notifData, error: notifError } = await supabase
      .from('notifications')
      .select('id')
      .limit(1);
    
    if (notifError) {
      console.error('❌ Notifications table error:', notifError.message);
      console.log('🔧 Please run the database setup SQL script in your Supabase dashboard.');
    } else {
      console.log('✅ Notifications table is accessible');
    }

    // Test claims table
    console.log('\n📋 Testing claims table...');
    const { data: claimsData, error: claimsError } = await supabase
      .from('claims')
      .select('id')
      .limit(1);
    
    if (claimsError) {
      console.error('❌ Claims table error:', claimsError.message);
      console.log('🔧 Please ensure the claims table exists in your Supabase dashboard.');
    } else {
      console.log('✅ Claims table is accessible');
    }

    // Simple table structure info
    console.log('\n📊 Expected table structure:');
    console.log('Claims table: id, user_id, policy_id, claim_number, incident_date, incident_description, claimed_amount, claim_status');
    console.log('Notifications table: id, user_id, title, message, notification_type, claim_id, is_sent, created_at');

    return {
      connectionOk: true,
      userAuthenticated: !!user,
      notificationsTableOk: !notifError,
      claimsTableOk: !claimsError,
    };

  } catch (error) {
    console.error('🚨 Database connection test failed:', error);
    return {
      connectionOk: false,
      userAuthenticated: false,
      notificationsTableOk: false,
      claimsTableOk: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Export a simple function to run this test
export async function runDatabaseTest() {
  const result = await testDatabaseConnection();
  
  if (result.connectionOk && result.notificationsTableOk && result.claimsTableOk) {
    console.log('\n🎉 Database is ready for claim submissions!');
  } else {
    console.log('\n⚠️ Database setup needs attention:');
    if (!result.notificationsTableOk) {
      console.log('- Run the database setup SQL script to create the notifications table');
    }
    if (!result.claimsTableOk) {
      console.log('- Ensure the claims table exists and has the correct structure');
    }
    if (!result.userAuthenticated) {
      console.log('- Please make sure you are logged in');
    }
  }
  
  return result;
} 