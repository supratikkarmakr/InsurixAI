# Supabase Setup Guide for InsurixAI

This guide will help you set up Supabase integration for the InsurixAI mobile app.

## Prerequisites

- Node.js installed on your system
- A Supabase account (free tier is sufficient)

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `insurixai` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. You'll find two important values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: A long JWT token starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Configure Environment Variables

### Option A: Automated Setup (Recommended)

Run the interactive setup script:

```bash
npm run setup:supabase
```

This will guide you through the process and create the `.env` file automatically.

### Option B: Manual Setup

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   APP_ENV=development
   ```

## Step 4: Set Up Database Schema

The app expects specific database tables. You can set them up using the SQL Editor in Supabase:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL to create the required tables:

```sql
-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT NOT NULL,
  aadhaar_number TEXT,
  pan_number TEXT,
  date_of_birth DATE,
  address JSONB,
  profile_picture_url TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  profile_completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  PRIMARY KEY (id)
);

-- Create insurance_policies table
CREATE TABLE public.insurance_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  policy_number TEXT UNIQUE NOT NULL,
  policy_type TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  policy_holder_name TEXT NOT NULL,
  premium_amount DECIMAL(10,2) NOT NULL,
  coverage_amount DECIMAL(12,2) NOT NULL,
  policy_start_date DATE NOT NULL,
  policy_end_date DATE NOT NULL,
  premium_due_date DATE,
  asset_details JSONB,
  policy_status TEXT DEFAULT 'active' CHECK (policy_status IN ('active', 'expired', 'cancelled', 'suspended')),
  policy_document_url TEXT,
  auto_renewal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create claims table
CREATE TABLE public.claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES public.insurance_policies(id) ON DELETE CASCADE,
  claim_number TEXT UNIQUE NOT NULL,
  incident_date DATE NOT NULL,
  incident_description TEXT NOT NULL,
  incident_location JSONB,
  claimed_amount DECIMAL(10,2) NOT NULL,
  estimated_amount DECIMAL(10,2),
  approved_amount DECIMAL(10,2),
  claim_status TEXT DEFAULT 'submitted' CHECK (claim_status IN ('submitted', 'under_review', 'approved', 'rejected', 'settled')),
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
  ml_damage_score DECIMAL(3,2),
  ml_confidence DECIMAL(3,2),
  damage_types JSONB,
  reviewer_id UUID,
  review_notes TEXT,
  settlement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('documents', 'documents', false),
  ('claims', 'claims', false),
  ('policies', 'policies', false);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples - customize as needed)
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own policies" ON public.insurance_policies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own claims" ON public.claims FOR SELECT USING (auth.uid() = user_id);
```

## Step 5: Test the Connection

1. Start your development server:
   ```bash
   npm start
   ```

2. If everything is configured correctly, you should see the app start without any Supabase connection errors.

3. Test the authentication flow by trying to sign up or sign in.

## Step 6: Storage Setup (Optional)

For file uploads (profile pictures, documents), you may want to configure storage policies:

1. Go to **Storage** in your Supabase dashboard
2. The buckets should already be created from Step 4
3. Configure access policies as needed for your security requirements

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for admin operations) | No |
| `APP_ENV` | Application environment | No |

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env` file exists and has the correct variable names
   - Verify the values are not empty
   - Restart the development server after changing `.env`

2. **"Invalid API key" error**
   - Double-check your anon key from the Supabase dashboard
   - Make sure you copied the entire key (it's very long)

3. **Database connection errors**
   - Ensure your Supabase project is active and not paused
   - Check if the database schema is set up correctly

4. **RLS (Row Level Security) errors**
   - Make sure RLS policies are configured correctly
   - Check if users are properly authenticated before accessing data

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the app logs for specific error messages
- Ensure your Supabase project is on the correct pricing plan for your usage

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific keys for different deployment stages
- Regularly rotate your service role keys
- Set up proper RLS policies for production use
- Monitor your Supabase usage and billing 