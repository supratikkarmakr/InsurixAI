import { supabase } from './supabase/client';
import { ComprehensiveAnalysisResult } from '../../services/damageDetectionService';

export interface ClaimData {
  policyNumber: string;
  incidentDate: string;
  claimAmount: string;
  description: string;
  images: string[];
  aiAnalysis?: ComprehensiveAnalysisResult | null;
  timestamp: string;
}

export interface StoredClaim {
  id: string;
  userId: string;
  policyId: string;
  claimNumber: string;
  policyNumber: string;
  incidentDate: string;
  claimAmount: number;
  description: string;
  images: string[];
  aiAnalysis?: any;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'settled';
  createdAt: string;
  updatedAt: string;
}

export class ClaimsService {
  /**
   * Submit a new insurance claim
   */
  static async submitClaim(claimData: ClaimData): Promise<{ success: boolean; claimId?: string; error?: string }> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Generate unique claim number and ID
      const claimNumber = `CLM${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      console.log('📋 Generated claim number:', claimNumber);
      
      // Try to find a policy for this user with the given policy number
      // For now, we'll create a dummy policy_id since we don't have the policies table populated
      // In production, you should query the insurance_policies table to get the actual policy_id
      const dummyPolicyId = `policy-${user.id}-${claimData.policyNumber}`;

      console.log('🔧 Preparing claim payload...');
      
      // Prepare claim data for database using the existing schema
      const claimPayload = {
        user_id: user.id,
        policy_id: dummyPolicyId, // This should be a real UUID from insurance_policies table
        claim_number: claimNumber,
        incident_date: claimData.incidentDate,
        incident_description: claimData.description,
        incident_location: null, // Could be populated from GPS or address input
        claimed_amount: parseFloat(claimData.claimAmount),
        estimated_amount: parseFloat(claimData.claimAmount), // Same as claimed for now
        claim_status: 'submitted',
        priority_level: 'medium',
        ml_damage_score: claimData.aiAnalysis?.data.overall_confidence ? 
          parseFloat(claimData.aiAnalysis.data.overall_confidence.percentage.replace('%', '')) / 100 : null,
        ml_confidence: claimData.aiAnalysis?.data.overall_confidence ? 
          parseFloat(claimData.aiAnalysis.data.overall_confidence.percentage.replace('%', '')) / 100 : null,
        damage_types: claimData.aiAnalysis ? JSON.stringify({
          severity: claimData.aiAnalysis.data.damage_severity?.predicted_class,
          location: claimData.aiAnalysis.data.damage_location?.predicted_location,
          images: claimData.images,
          fullAnalysis: claimData.aiAnalysis
        }) : JSON.stringify({ images: claimData.images }),
      };

      console.log('📊 Claim payload prepared:', {
        user_id: claimPayload.user_id,
        claim_number: claimPayload.claim_number,
        claimed_amount: claimPayload.claimed_amount,
        incident_date: claimPayload.incident_date,
        has_ai_analysis: !!claimData.aiAnalysis
      });

      // First, let's test if the claims table exists and what columns it has
      console.log('🔍 Testing claims table structure...');
      
      // Try a simple select to understand the table structure
      const { data: testData, error: testError } = await supabase
        .from('claims')
        .select('*')
        .limit(1);

      if (testError) {
        console.error('❌ Claims table test failed:', testError);
        console.error('Error details:', JSON.stringify(testError, null, 2));
        
        // Check if it's a "relation does not exist" error
        if (testError.message.includes('relation') && testError.message.includes('does not exist')) {
          return { 
            success: false, 
            error: 'Claims table does not exist. Please run the complete database setup from SUPABASE_SETUP.md to create all required tables.' 
          };
        }
        
        return { 
          success: false, 
          error: `Database error: ${testError.message}. Please check your database setup.` 
        };
      }

      console.log('✅ Claims table is accessible');

      // Insert claim into database
      console.log('💾 Inserting claim into database...');
      const { data: insertedClaim, error: insertError } = await supabase
        .from('claims')
        .insert(claimPayload)
        .select('id, claim_number')
        .single();

      if (insertError) {
        console.error('❌ Error inserting claim:', insertError);
        console.error('Full error object:', JSON.stringify(insertError, null, 2));
        console.error('Payload that failed:', JSON.stringify(claimPayload, null, 2));
        
        // Provide more specific error messages based on the error
        let errorMessage = 'Failed to submit claim';
        
        if (insertError.message) {
          errorMessage += `: ${insertError.message}`;
        } else if (insertError.code) {
          errorMessage += ` (Error code: ${insertError.code})`;
        } else {
          errorMessage += '. The database schema might not match the expected structure.';
        }
        
        return { success: false, error: errorMessage };
      }

      if (!insertedClaim) {
        console.error('❌ No data returned from insert operation');
        return { success: false, error: 'Failed to create claim record' };
      }

      console.log('✅ Claim submitted successfully with ID:', insertedClaim.id);
      console.log('📋 Claim number:', insertedClaim.claim_number);
      
      return { success: true, claimId: insertedClaim.claim_number };
    } catch (error) {
      console.error('❌ Claims service error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get user's claims
   */
  static async getUserClaims(userId: string): Promise<StoredClaim[]> {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user claims:', error);
        return [];
      }

      return data.map(this.transformClaim);
    } catch (error) {
      console.error('Error getting user claims:', error);
      return [];
    }
  }

  /**
   * Get claim by ID
   */
  static async getClaimById(claimId: string): Promise<StoredClaim | null> {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('claim_number', claimId)
        .single();

      if (error) {
        console.error('Error fetching claim:', error);
        return null;
      }

      return this.transformClaim(data);
    } catch (error) {
      console.error('Error getting claim by ID:', error);
      return null;
    }
  }

  /**
   * Update claim status
   */
  static async updateClaimStatus(claimId: string, status: StoredClaim['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('claims')
        .update({ 
          claim_status: status, 
          updated_at: new Date().toISOString() 
        })
        .eq('claim_number', claimId);

      if (error) {
        console.error('Error updating claim status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating claim status:', error);
      return false;
    }
  }

  /**
   * Transform database claim to app claim type
   */
  private static transformClaim(dbClaim: any): StoredClaim {
    let damageData = {};
    try {
      damageData = dbClaim.damage_types ? JSON.parse(dbClaim.damage_types) : {};
    } catch (e) {
      console.error('Error parsing damage_types:', e);
    }

    return {
      id: dbClaim.id,
      userId: dbClaim.user_id,
      policyId: dbClaim.policy_id,
      claimNumber: dbClaim.claim_number,
      policyNumber: dbClaim.policy_id, // Using policy_id as fallback for policy number
      incidentDate: dbClaim.incident_date,
      claimAmount: dbClaim.claimed_amount,
      description: dbClaim.incident_description,
      images: (damageData as any).images || [],
      aiAnalysis: (damageData as any).fullAnalysis || null,
      status: dbClaim.claim_status as StoredClaim['status'],
      createdAt: dbClaim.created_at,
      updatedAt: dbClaim.updated_at,
    };
  }
} 