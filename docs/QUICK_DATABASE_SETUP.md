# Quick Database Setup Guide

If you're getting database errors when trying to submit claims, follow these steps:

## Step 1: Run the Database Setup Script

1. **Go to your Supabase Dashboard**
   - Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Setup Script**
   - Copy the entire content from `src/services/supabase/database-setup.sql`
   - Paste it into the SQL editor
   - Click "Run" (or press Ctrl/Cmd + Enter)

4. **Check for Success**
   - You should see messages like "✅ Notifications table created successfully!"
   - If you see any errors, check the troubleshooting section below

## Step 2: Create Claims Table (If Missing)

If your claims table doesn't exist or has the wrong structure:

1. **Run the Claims Table Script**
   - Copy the entire content from `src/services/supabase/create-claims-table.sql`
   - Paste it into a new SQL query
   - Click "Run"

2. **Check for Success**
   - You should see "✅ Claims table created successfully!"
   - The script will show the table structure for verification

## Step 3: Verify Setup (Optional)

Run the verification script to make sure everything is working:

1. Copy the content from `src/services/supabase/verify-setup.sql`
2. Paste and run it in the SQL editor
3. Check the results - you should see green checkmarks ✅

## Step 4: Test in the App

1. Go to the instant claim screen in your app
2. The console should now show "✅ Database is ready for claim submissions!"
3. Try submitting a test claim

## Troubleshooting

### Error: "must be owner of table users"
- ✅ **Fixed!** This error occurred in older versions of the setup script
- Make sure you're using the latest `database-setup.sql` file

### Error: "relation does not exist"
- This means a table is missing
- Run both `database-setup.sql` AND `create-claims-table.sql`
- The app will now show exactly which table is missing

### Error: "failed to parse select parameter"
- ✅ **Fixed!** This was caused by incorrect query syntax in the connection test
- Update your app code to the latest version

### Error: Empty error object `{}`
- ✅ **Fixed!** This was caused by schema mismatch between app and database
- The app now provides detailed error messages to identify the issue
- Run the `create-claims-table.sql` script to ensure correct schema

### Claims table has wrong structure
- If you have an existing claims table with different columns, you may need to:
  1. Back up any existing data
  2. Drop the old table (be careful!)
  3. Run `create-claims-table.sql` to create the correct structure

## What the Setup Scripts Do

### `database-setup.sql`:
✅ Creates `notifications` table for email logging  
✅ Sets up Row Level Security (RLS) policies  
✅ Creates database indexes for performance  

### `create-claims-table.sql`:
✅ Creates `claims` table with the correct schema  
✅ Sets up RLS policies for claims  
✅ Creates indexes for performance  
✅ Adds automatic timestamp updates  

## Need Help?

If you're still having issues:

1. **Check the detailed console logs** - The app now shows exactly what went wrong
2. **Make sure you're logged in** before testing claims
3. **Verify your Supabase project URL and API key** are correct
4. **Run the verification script** to see exactly what's missing
5. **Check that both tables exist** - notifications AND claims

The app will now provide much better error messages to help you identify specific issues! 🎉

## Expected Console Output

When everything is working, you should see:
```
🔍 Testing database connection for claims...
✅ User authenticated: [user-id]
✅ Claims table is accessible
✅ Database is ready for claim submissions!
🚀 Starting claim submission process...
📋 Generated claim number: CLM[timestamp][random]
✅ Claim submitted successfully
``` 