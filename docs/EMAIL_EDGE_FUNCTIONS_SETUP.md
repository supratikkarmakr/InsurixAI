# Email Setup with Supabase Edge Functions

This guide shows you how to set up **real email sending** using Supabase Edge Functions with Resend for instant claims.

## 🚀 Quick Setup (Recommended)

**For Windows users**: Run the automated setup script to install everything in one go:

```powershell
# Run from your project root directory
scripts/setup-email-system.bat
```

This script will:
1. ✅ Install Supabase CLI locally (no global installation needed)
2. ✅ Login to Supabase and link your project
3. ✅ Deploy the Edge Function automatically
4. ✅ Guide you through environment variable setup
5. ✅ Provide next steps and useful commands

**After running the script**, just get your Resend API key and you're ready to send emails!

---

## Manual Setup (Alternative)

If you prefer manual setup or the automated script doesn't work, follow the detailed guide below:

## Overview

The email system now works in two layers:
1. **Primary**: Supabase Edge Function → Resend API → Real emails sent
2. **Fallback**: Database logging if Edge Function fails

## Prerequisites

1. **Supabase Project** with Edge Functions enabled
2. **Resend Account** (or another email service)
3. **Domain verification** for sending emails
4. **Supabase CLI** installed

## Step 1: Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Or using yarn
yarn global add supabase

# Verify installation
supabase --version
```

## Step 2: Get Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Create an account and verify your domain
3. Go to **API Keys** → **Create API Key**
4. Copy your API key (starts with `re_`)

## Step 3: Configure Environment Variables

### In Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Add these environment variables:

```env
RESEND_API_KEY=re_your_resend_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### For Local Development:

Create a `.env` file in your project root:

```env
# Resend Configuration
RESEND_API_KEY=re_your_resend_api_key_here

# Supabase Configuration  
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Deploy the Edge Function

### Option A: Deploy to Supabase Cloud

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy send-claim-email

# Set environment variables
supabase secrets set RESEND_API_KEY=re_your_key_here
```

### Option B: Test Locally First

```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve send-claim-email --env-file .env

# Test the function
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-claim-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"claimData":{"userEmail":"test@example.com","userName":"Test User","claimId":"CLM123","policyNumber":"POL456","claimAmount":"5000","incidentDate":"01/15/2024","description":"Test claim","submissionDate":"01/15/2024"}}'
```

## Step 5: Update Your Domain Settings

### In Resend Dashboard:

1. **Verify your domain** (e.g., `insurix.com`)
2. **Set up DNS records** as instructed
3. **Configure sender email** (e.g., `claims@insurix.com`)

### Update the Edge Function:

In `supabase/functions/send-claim-email/index.ts`, update:

```typescript
from: 'InsurixAI Claims <claims@yourdomain.com>',
```

## Step 6: Test the Integration

### 1. Test Database Tables

Make sure you've run the database setup scripts:
- `src/services/supabase/database-setup.sql`
- `src/services/supabase/create-claims-table.sql`

### 2. Test Edge Function

```bash
# Check function logs
supabase functions logs send-claim-email

# Test with real data
# Submit a claim through your app and check logs
```

### 3. Monitor Email Delivery

In Resend Dashboard:
- Check **Logs** section
- Verify email delivery status
- Monitor bounce/spam rates

## Step 7: App Integration

The app is already configured to use the Edge Function! It will:

1. **Try Edge Function first** for real email sending
2. **Fallback to database logging** if Edge Function fails
3. **Show appropriate error messages** for debugging

### Expected Console Output:

```
📧 Sending claim confirmation email to: user@example.com
📤 Calling send-claim-email Edge Function...
✅ Email sent successfully via Edge Function: email_id_123
```

### If Edge Function Fails:

```
❌ Edge Function call failed: [error details]
🔄 Falling back to database logging...
✅ Email logged to database as fallback
```

## Troubleshooting

### Common Issues:

#### 1. "Function not found"
- Make sure you deployed the function: `supabase functions deploy send-claim-email`
- Check function name is correct in the app

#### 2. "RESEND_API_KEY not set"
- Add the environment variable in Supabase dashboard
- Redeploy the function after adding secrets

#### 3. "Authentication failed"
- Ensure user is logged in before sending emails
- Check that session tokens are valid

#### 4. "Domain not verified"
- Complete domain verification in Resend
- Update the `from` email address to use your verified domain

#### 5. "Edge Function timeout"
- Check Resend API status
- Monitor function logs for specific errors

### Debug Commands:

```bash
# Check function status
supabase functions list

# View function logs
supabase functions logs send-claim-email --follow

# Test locally
supabase functions serve send-claim-email --debug

# Check environment variables
supabase secrets list
```

## Email Templates

The Edge Function includes both HTML and text email templates:

### Features:
- 📧 **Professional HTML design** with InsurixAI branding
- 📱 **Mobile-responsive** layout
- 🎨 **Branded colors** and styling
- 📋 **Detailed claim information**
- 🔗 **Contact information** and support links
- ✅ **Fallback text version** for all email clients

### Customization:

Edit `generateClaimEmailHTML()` and `generateClaimEmailText()` functions in the Edge Function to:
- Update branding and colors
- Add/remove claim details
- Modify contact information
- Include company logos

## Production Checklist

### Before Going Live:

- [ ] ✅ Domain verified in Resend
- [ ] ✅ DNS records properly configured
- [ ] ✅ Environment variables set in production
- [ ] ✅ Edge Function deployed and tested
- [ ] ✅ Database tables created
- [ ] ✅ Email templates customized
- [ ] ✅ Rate limits configured in Resend
- [ ] ✅ Email analytics/monitoring set up

### Monitoring:

- **Resend Dashboard**: Monitor delivery rates, bounces, complaints
- **Supabase Logs**: Check Edge Function performance
- **App Logs**: Monitor fallback usage and errors

## Advanced Features

### Additional Email Types:

You can extend the system to handle:
- Welcome emails
- Claim status updates  
- Payment confirmations
- Policy renewals

### Multiple Email Providers:

Modify the Edge Function to support multiple providers:
- Resend (primary)
- SendGrid (fallback)
- AWS SES (enterprise)

### Email Templates:

Create separate Edge Functions for different email types:
- `send-claim-email`
- `send-welcome-email` 
- `send-status-update`

## Cost Estimation

### Resend Pricing (as of 2024):
- **Free tier**: 3,000 emails/month
- **Pro tier**: $20/month for 50,000 emails
- **Business tier**: $85/month for 200,000 emails

### Supabase Edge Functions:
- **Free tier**: 500,000 function invocations/month
- **Pro tier**: 2,000,000 invocations/month

For most insurance applications, the free tiers should be sufficient for testing and small-scale deployment.

## Support

If you encounter issues:

1. **Check the console logs** for detailed error messages
2. **Review Supabase function logs** for Edge Function errors
3. **Monitor Resend dashboard** for email delivery issues
4. **Test the fallback system** by temporarily disabling the Edge Function

The system is designed to be robust with proper fallbacks, so claims will never be lost even if email sending fails! 🎉 