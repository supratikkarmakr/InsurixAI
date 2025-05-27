import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { SUPABASE_CONFIG, validateEnvironment } from '@/config/constants';

// Validate environment variables on import
try {
  validateEnvironment();
} catch (error) {
  console.warn('Environment validation failed:', error);
  // Provide fallback values for development
}

// Get validated environment variables with fallbacks
const supabaseUrl = SUPABASE_CONFIG.url || 'https://placeholder.supabase.co';
const supabaseAnonKey = SUPABASE_CONFIG.anonKey || 'placeholder-anon-key';

// Create Supabase client with React Native specific configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'insurixai-mobile@1.0.0',
    },
  },
});

// Database type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone?: string;
          full_name: string;
          aadhaar_number?: string;
          pan_number?: string;
          date_of_birth?: string;
          address?: any;
          profile_picture_url?: string;
          kyc_status: 'pending' | 'verified' | 'rejected';
          profile_completion_percentage: number;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string;
          full_name: string;
          aadhaar_number?: string;
          pan_number?: string;
          date_of_birth?: string;
          address?: any;
          profile_picture_url?: string;
          kyc_status?: 'pending' | 'verified' | 'rejected';
          profile_completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string;
          full_name?: string;
          aadhaar_number?: string;
          pan_number?: string;
          date_of_birth?: string;
          address?: any;
          profile_picture_url?: string;
          kyc_status?: 'pending' | 'verified' | 'rejected';
          profile_completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      insurance_policies: {
        Row: {
          id: string;
          user_id: string;
          policy_number: string;
          policy_type: string;
          provider_name: string;
          policy_holder_name: string;
          premium_amount: number;
          coverage_amount: number;
          policy_start_date: string;
          policy_end_date: string;
          premium_due_date?: string;
          asset_details?: any;
          policy_status: string;
          policy_document_url?: string;
          auto_renewal: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          policy_number: string;
          policy_type: string;
          provider_name: string;
          policy_holder_name: string;
          premium_amount: number;
          coverage_amount: number;
          policy_start_date: string;
          policy_end_date: string;
          premium_due_date?: string;
          asset_details?: any;
          policy_status?: string;
          policy_document_url?: string;
          auto_renewal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          policy_number?: string;
          policy_type?: string;
          provider_name?: string;
          policy_holder_name?: string;
          premium_amount?: number;
          coverage_amount?: number;
          policy_start_date?: string;
          policy_end_date?: string;
          premium_due_date?: string;
          asset_details?: any;
          policy_status?: string;
          policy_document_url?: string;
          auto_renewal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      claims: {
        Row: {
          id: string;
          user_id: string;
          policy_id: string;
          claim_number: string;
          incident_date: string;
          incident_description: string;
          incident_location?: any;
          claimed_amount: number;
          estimated_amount?: number;
          approved_amount?: number;
          claim_status: string;
          priority_level: string;
          ml_damage_score?: number;
          ml_confidence?: number;
          damage_types?: any;
          reviewer_id?: string;
          review_notes?: string;
          settlement_date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          policy_id: string;
          claim_number: string;
          incident_date: string;
          incident_description: string;
          incident_location?: any;
          claimed_amount: number;
          estimated_amount?: number;
          approved_amount?: number;
          claim_status?: string;
          priority_level?: string;
          ml_damage_score?: number;
          ml_confidence?: number;
          damage_types?: any;
          reviewer_id?: string;
          review_notes?: string;
          settlement_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          policy_id?: string;
          claim_number?: string;
          incident_date?: string;
          incident_description?: string;
          incident_location?: any;
          claimed_amount?: number;
          estimated_amount?: number;
          approved_amount?: number;
          claim_status?: string;
          priority_level?: string;
          ml_damage_score?: number;
          ml_confidence?: number;
          damage_types?: any;
          reviewer_id?: string;
          review_notes?: string;
          settlement_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export default supabase; 