# Email Setup for Instant Claims

This guide explains how to set up email functionality for the instant claims feature in InsurixAI.

## Overview

When a user submits an instant claim, the app will:
1. Store the claim in Supabase database
2. Send a confirmation email to the user
3. Log the email as a notification in the database

## Database Setup

### Step 1: Create Required Tables

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the SQL script from `src/services/supabase/database-setup.sql`

**Important Notes:**
- The script only creates the `notifications` table needed for email functionality
- The `claims` table should already exist from your main database setup
- If you get a permission error about `auth.users`, that's been fixed in the updated script
- The script will show success/failure messages when you run it

This will create:
- `notifications` table to store email notifications
- Row Level Security policies for data protection
- Proper indexes for performance

### Step 2: Verify Tables

Check that the tables were created successfully:

```sql
-- Check notifications table
SELECT * FROM notifications LIMIT 1;

-- Check claims table (should already exist)
SELECT * FROM claims LIMIT 1;

-- Verify table structure
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('claims', 'notifications')
ORDER BY table_name, ordinal_position;
```

### Troubleshooting Database Setup

**Error: "must be owner of table users"**
- This error occurred in earlier versions of the setup script
- The updated script no longer tries to modify the `auth.users` system table
- Simply run the updated script from `src/services/supabase/database-setup.sql`

**Claims table doesn't exist:**
- If you get errors about the claims table not existing, you may need to run the main database setup first
- Check the `SUPABASE_SETUP.md` file for the complete database schema setup
- The claims table is required for the app to work properly

## Current Implementation

### Email Service Architecture

The current implementation uses a **hybrid approach**:

1. **Immediate Feedback**: Claims are stored in Supabase instantly
2. **Email Logging**: Email content is stored in the `notifications` table
3. **Future Integration**: Ready for actual email service integration

### Services Created

#### 1. EmailService (`src/services/emailService.ts`)
- `sendClaimConfirmationEmail()` - Sends claim confirmation
- `sendWelcomeEmail()` - Sends welcome emails for new users
- `sendClaimStatusUpdate()` - Sends claim status updates

#### 2. ClaimsService (`src/services/claimsService.ts`)
- `submitClaim()` - Stores claim in database
- `getUserClaims()` - Retrieves user's claims
- `getClaimById()` - Gets specific claim
- `updateClaimStatus()` - Updates claim status

## Email Integration Options

### Option 1: Supabase Edge Functions (Recommended)

Create a Supabase Edge Function to send actual emails:

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { to, subject, html } = await req.json()
  
  // Use a service like Resend, SendGrid, or AWS SES
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'claims@insurix.com',
      to,
      subject,
      html,
    }),
  })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### Option 2: Third-Party Email Services

#### Resend Integration

1. Install Resend:
```bash
npm install resend
```

2. Update EmailService:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

static async sendClaimConfirmationEmail(claimData: ClaimEmailData): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'claims@insurix.com',
      to: claimData.userEmail,
      subject: 'Claim Submitted Successfully',
      html: this.generateClaimEmailHTML(claimData),
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}
```

#### SendGrid Integration

1. Install SendGrid:
```bash
npm install @sendgrid/mail
```

2. Update EmailService:
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

static async sendClaimConfirmationEmail(claimData: ClaimEmailData): Promise<boolean> {
  const msg = {
    to: claimData.userEmail,
    from: 'claims@insurix.com',
    subject: 'Claim Submitted Successfully',
    html: this.generateClaimEmailHTML(claimData),
  };
  
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}
```

## Environment Variables

Add these to your `.env` file:

```env
# Email Service (choose one)
RESEND_API_KEY=your_resend_api_key
SENDGRID_API_KEY=your_sendgrid_api_key

# Email Configuration
FROM_EMAIL=claims@insurix.com
COMPANY_NAME=InsurixAI
SUPPORT_EMAIL=support@insurix.com
SUPPORT_PHONE=1-800-INSURIX
```

## Testing

### Test Claim Submission

1. Submit a claim through the app
2. Check the `claims` table in Supabase
3. Check the `notifications` table for email logs
4. Verify user receives actual email (if configured)

### Test Email Templates

You can test email templates by calling the service directly:

```typescript
const testEmailData: ClaimEmailData = {
  userEmail: 'test@example.com',
  userName: 'Test User',
  claimId: 'CLM12345',
  policyNumber: 'MPO4CY9999',
  claimAmount: '5000',
  incidentDate: '01/15/2024',
  description: 'Test claim for email functionality',
  aiConfidence: '85%',
  submissionDate: '01/15/2024',
};

const result = await EmailService.sendClaimConfirmationEmail(testEmailData);
console.log('Email sent:', result);
```

## Features

### Current Features
- ✅ Claim storage in Supabase
- ✅ Email content generation
- ✅ Notification logging
- ✅ User authentication integration
- ✅ AI analysis data preservation
- ✅ Professional email templates

### Planned Features
- 📧 Actual email delivery
- 📱 SMS notifications
- 🔄 Claim status tracking
- 📊 Email analytics
- 🎨 HTML email templates
- 📎 Attachment support

## Troubleshooting

### Common Issues

1. **Claims not saving**: Check RLS policies and user authentication
2. **Email not logging**: Verify notifications table exists
3. **User not found**: Ensure user is logged in before claim submission

### Debug Commands

```sql
-- Check recent claims
SELECT * FROM claims ORDER BY created_at DESC LIMIT 10;

-- Check email notifications
SELECT * FROM notifications WHERE notification_type = 'claim_confirmation' ORDER BY created_at DESC LIMIT 10;

-- Check user's claims
SELECT * FROM claims WHERE user_id = 'user-uuid-here';
```

## Security

- All database operations use Row Level Security (RLS)
- Users can only access their own claims and notifications
- Email content is sanitized before storage
- User authentication is verified before claim submission

## Next Steps

1. Set up actual email service (Resend/SendGrid)
2. Create HTML email templates
3. Implement SMS notifications
4. Add claim status tracking
5. Create claims history screen
6. Add email preferences management

For questions or issues, contact the development team. 