import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ClaimEmailData {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the JWT token and verify user
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { claimData }: { claimData: ClaimEmailData } = await req.json()

    console.log('📧 Sending claim confirmation email for:', claimData.claimId)

    // Validate required fields
    if (!claimData.userEmail || !claimData.claimId || !claimData.userName) {
      return new Response(
        JSON.stringify({ error: 'Missing required email data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate email content
    const emailHtml = generateClaimEmailHTML(claimData)
    const emailText = generateClaimEmailText(claimData)

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'InsurixAI Claims <claims@insurix.com>',
        to: [claimData.userEmail],
        subject: `Claim Confirmation - ${claimData.claimId}`,
        html: emailHtml,
        text: emailText,
      }),
    })

    const emailResult = await emailResponse.json()

    if (!emailResponse.ok) {
      console.error('Failed to send email:', emailResult)
      throw new Error(`Failed to send email: ${emailResult.message || 'Unknown error'}`)
    }

    console.log('✅ Email sent successfully:', emailResult.id)

    // Log the email to notifications table
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Claim Submitted Successfully',
        message: emailText,
        notification_type: 'claim_confirmation',
        claim_id: claimData.claimId,
        is_sent: true,
        created_at: new Date().toISOString(),
      })

    if (notificationError) {
      console.error('Failed to log notification:', notificationError)
      // Don't fail the request if logging fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        emailId: emailResult.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-claim-email function:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateClaimEmailHTML(claimData: ClaimEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claim Confirmation - ${claimData.claimId}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .claim-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .next-steps { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .contact-info { background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        .success-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; display: inline-block; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Claim Submitted Successfully!</h1>
        <div class="success-badge">✅ Confirmed</div>
    </div>
    
    <div class="content">
        <p>Dear <strong>${claimData.userName}</strong>,</p>
        
        <p>Your insurance claim has been submitted successfully! We have received your claim and it is now being processed by our AI-enhanced claims system.</p>
        
        <div class="claim-details">
            <h3>📋 Claim Details</h3>
            <div class="detail-row">
                <span class="detail-label">Claim ID:</span>
                <span class="detail-value"><strong>${claimData.claimId}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Policy Number:</span>
                <span class="detail-value">${claimData.policyNumber}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Incident Date:</span>
                <span class="detail-value">${claimData.incidentDate}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Claim Amount:</span>
                <span class="detail-value">$${claimData.claimAmount}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Submission Date:</span>
                <span class="detail-value">${claimData.submissionDate}</span>
            </div>
            ${claimData.aiConfidence ? `
            <div class="detail-row">
                <span class="detail-label">AI Analysis Confidence:</span>
                <span class="detail-value">${claimData.aiConfidence}</span>
            </div>
            ` : ''}
        </div>
        
        <div class="next-steps">
            <h3>🚀 What's Next?</h3>
            <ul>
                <li><strong>Review Period:</strong> Your claim will be reviewed by our team within 24-48 hours</li>
                <li><strong>Updates:</strong> You will receive updates via email and SMS</li>
                <li><strong>Documentation:</strong> If additional documents are required, we will contact you</li>
                <li><strong>Processing Time:</strong> Expected processing time is 5-7 business days</li>
            </ul>
        </div>
        
        <div class="contact-info">
            <h3>📞 Need Help?</h3>
            <p><strong>Phone:</strong> 1-800-INSURIX (1-800-467-8749)<br>
            <strong>Email:</strong> claims@insurix.com<br>
            <strong>Website:</strong> www.insurix.com/claims</p>
        </div>
        
        <p>Thank you for choosing InsurixAI for your insurance needs. Our AI-powered system ensures faster and more accurate claim processing.</p>
        
        <p>Best regards,<br>
        <strong>The InsurixAI Claims Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.<br>
        © 2024 InsurixAI. All rights reserved.</p>
    </div>
</body>
</html>
  `.trim()
}

function generateClaimEmailText(claimData: ClaimEmailData): string {
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
  `.trim()
} 