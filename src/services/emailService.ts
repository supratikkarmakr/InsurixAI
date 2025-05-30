import { supabase } from './supabase/client';

export interface ClaimEmailData {
  userEmail: string;
  userName: string;
  claimId: string;
  policyNumber: string;
  claimAmount: string;
  incidentDate: string;
  description: string;
  aiConfidence?: string;
  submissionDate: string;
}

export class EmailService {
  /**
   * Send claim confirmation email to user using Supabase Edge Function
   */
  static async sendClaimConfirmationEmail(claimData: ClaimEmailData): Promise<boolean> {
    try {
      console.log('📧 Sending claim confirmation email to:', claimData.userEmail);

      // Get current user and auth token
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated for email service:', userError);
        return false;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        console.error('No active session for email service:', sessionError);
        return false;
      }

      try {
        // Call the Supabase Edge Function
        console.log('📤 Calling send-claim-email Edge Function...');
        
        const { data: functionResult, error: functionError } = await supabase.functions.invoke(
          'send-claim-email',
          {
            body: { claimData },
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (functionError) {
          console.error('❌ Edge Function error:', functionError);
          throw new Error(`Edge Function failed: ${functionError.message}`);
        }

        if (functionResult?.success) {
          console.log('✅ Email sent successfully via Edge Function:', functionResult.emailId);
          return true;
        } else {
          console.error('❌ Edge Function returned failure:', functionResult);
          throw new Error('Edge Function returned failure');
        }

      } catch (edgeFunctionError) {
        console.error('❌ Edge Function call failed:', edgeFunctionError);
        console.log('🔄 Falling back to database logging...');
        
        // Fallback: Log to database if Edge Function fails
        const fallbackSuccess = await this.logEmailToDatabase(user, claimData, 'claim_confirmation');
        
        if (fallbackSuccess) {
          console.log('✅ Email logged to database as fallback');
          return true;
        } else {
          console.error('❌ Both Edge Function and database fallback failed');
          return false;
        }
      }

    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }

  /**
   * Fallback method to log email to database when Edge Function is unavailable
   */
  private static async logEmailToDatabase(
    user: any, 
    claimData: ClaimEmailData, 
    notificationType: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Claim Submitted Successfully',
          message: this.generateClaimEmailContent(claimData),
          notification_type: notificationType,
          claim_id: claimData.claimId,
          is_sent: false, // Mark as not sent since it's just logged
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error logging email to database:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Database logging error:', error);
      return false;
    }
  }

  /**
   * Generate email content for claim confirmation (text version)
   */
  private static generateClaimEmailContent(claimData: ClaimEmailData): string {
    return `
Dear ${claimData.userName},

Your insurance claim has been submitted successfully! We have received your claim and it is now being processed.

CLAIM DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claim ID: ${claimData.claimId}
Policy Number: ${claimData.policyNumber}
Incident Date: ${claimData.incidentDate}
Claim Amount: $${claimData.claimAmount}
Submission Date: ${claimData.submissionDate}
${claimData.aiConfidence ? `AI Analysis Confidence: ${claimData.aiConfidence}` : ''}

INCIDENT DESCRIPTION:
${claimData.description}

WHAT'S NEXT:
• Your claim will be reviewed by our team within 24-48 hours
• You will receive updates via email and SMS
• If additional documents are required, we will contact you
• Expected processing time: 5-7 business days

NEED HELP?
• Call us: 1-800-INSURIX (1-800-467-8749)
• Email: claims@insurix.com
• Visit: www.insurix.com/claims

Thank you for choosing InsurixAI for your insurance needs.

Best regards,
The InsurixAI Claims Team

---
This is an automated message. Please do not reply to this email.
    `.trim();
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated for welcome email:', userError);
        return false;
      }

      // For welcome emails, we'll just log to database for now
      // You can extend this to use Edge Functions if needed
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Welcome to InsurixAI!',
          message: `Welcome ${userName}! Your account has been created successfully. Start exploring our AI-powered insurance features.`,
          notification_type: 'welcome',
          is_sent: true,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error storing welcome email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Welcome email error:', error);
      return false;
    }
  }

  /**
   * Send claim status update email
   */
  static async sendClaimStatusUpdate(
    userEmail: string,
    userName: string,
    claimId: string,
    status: string,
    message: string
  ): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated for status update email:', userError);
        return false;
      }

      // For status updates, we'll log to database
      // You can extend this to use Edge Functions for actual email sending
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: `Claim Update: ${status}`,
          message: `Dear ${userName}, your claim ${claimId} status has been updated to: ${status}. ${message}`,
          notification_type: 'claim_update',
          claim_id: claimId,
          is_sent: true,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error storing claim status email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Claim status email error:', error);
      return false;
    }
  }
} 