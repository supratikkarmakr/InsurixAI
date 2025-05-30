-- Create claims table with the schema expected by ClaimsService
-- Run this if the claims table doesn't exist or has wrong structure

-- Drop the table if it exists (be careful with this in production!)
-- DROP TABLE IF EXISTS claims CASCADE;

-- Create claims table with the correct structure
CREATE TABLE IF NOT EXISTS claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_id TEXT NOT NULL, -- Will be a real UUID when insurance_policies table exists
  claim_number TEXT UNIQUE NOT NULL,
  incident_date TEXT NOT NULL, -- Using TEXT to match the format we're sending
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies for claims
CREATE POLICY "Users can view their own claims" ON claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own claims" ON claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own claims" ON claims
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable RLS on claims table
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(claim_status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at);
CREATE INDEX IF NOT EXISTS idx_claims_number ON claims(claim_number);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_claims_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_claims_updated_at();

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'claims'
ORDER BY ordinal_position;

-- Test message
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'claims') THEN
        RAISE NOTICE '✅ Claims table created successfully!';
        RAISE NOTICE '📋 Claims functionality is now ready.';
    ELSE
        RAISE NOTICE '❌ Failed to create claims table.';
    END IF;
END $$; 