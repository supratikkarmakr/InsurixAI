import { supabase } from './client';

export async function simpleConnectionTest() {
  console.log('🔍 Simple database connection test...');
  
  try {
    // Test basic auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('Auth error:', authError.message);
      return { 
        success: false, 
        message: 'Authentication error',
        details: authError.message,
        userAuthenticated: false
      };
    }
    
    if (!user) {
      console.log('ℹ️ No authenticated user');
      return { 
        success: true, 
        message: 'Connection OK but user not authenticated',
        details: 'This is normal if user is not logged in',
        userAuthenticated: false
      };
    }
    
    console.log('✅ User authenticated:', user.id);
    
    // Test a simple query that doesn't depend on specific tables
    const { data, error } = await supabase
      .from('auth.users')
      .select('id')
      .limit(1);
      
    if (error) {
      console.log('Basic query failed:', error.message);
      return { 
        success: false, 
        message: 'Database connection failed',
        details: error.message,
        userAuthenticated: true
      };
    }
    
    console.log('✅ Database connection successful');
    return { 
      success: true, 
      message: 'Database connection successful',
      details: 'Ready to submit claims',
      userAuthenticated: true
    };
    
  } catch (error) {
    console.error('Connection test error:', error);
    return { 
      success: false, 
      message: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error',
      userAuthenticated: false
    };
  }
}

// Test specific table access
export async function testTableAccess(tableName: string) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
      
    if (error) {
      return {
        accessible: false,
        error: error.message,
        suggestion: tableName === 'notifications' 
          ? 'Run the database-setup.sql script in Supabase dashboard'
          : 'Ensure the table exists and has proper permissions'
      };
    }
    
    return {
      accessible: true,
      error: null,
      suggestion: null
    };
    
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Check table name and permissions'
    };
  }
} 