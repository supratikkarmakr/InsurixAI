-- Verification script for InsurixAI database setup
-- Run this after running the main database-setup.sql script

-- Check if notifications table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') 
    THEN '✅ Notifications table exists' 
    ELSE '❌ Notifications table missing - run database-setup.sql' 
  END as notifications_status;

-- Check if claims table exists  
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'claims') 
    THEN '✅ Claims table exists' 
    ELSE '❌ Claims table missing - check SUPABASE_SETUP.md' 
  END as claims_status;

-- Check notifications table structure
SELECT 
  'Notifications table columns:' as info,
  string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_name = 'notifications';

-- Check claims table structure
SELECT 
  'Claims table columns:' as info,
  string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_name = 'claims';

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('notifications', 'claims')
ORDER BY tablename, policyname;

-- Test basic functionality (if user is authenticated)
DO $$
BEGIN
  -- Check if user can insert into notifications (will fail if RLS is working and user not authenticated)
  RAISE NOTICE 'Testing database setup...';
  
  IF auth.uid() IS NOT NULL THEN
    RAISE NOTICE '✅ User is authenticated: %', auth.uid();
    
    -- Test if we can insert/select from notifications
    BEGIN
      INSERT INTO notifications (user_id, title, message, notification_type, is_sent)
      VALUES (auth.uid(), 'Test Notification', 'This is a test message', 'test', true);
      
      RAISE NOTICE '✅ Successfully inserted test notification';
      
      -- Clean up test data
      DELETE FROM notifications WHERE notification_type = 'test' AND user_id = auth.uid();
      RAISE NOTICE '✅ Test notification cleaned up';
      
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '❌ Error testing notifications table: %', SQLERRM;
    END;
  ELSE
    RAISE NOTICE '⚠️ No authenticated user - RLS policies cannot be fully tested';
    RAISE NOTICE 'Log in to the app and run this script again for complete testing';
  END IF;
  
  RAISE NOTICE '🎉 Database verification complete!';
END $$; 