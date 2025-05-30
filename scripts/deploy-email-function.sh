#!/bin/bash

# Deploy Email Edge Function Script
# This script deploys the send-claim-email function to Supabase

echo "🚀 InsurixAI Email Edge Function Deployment"
echo "==========================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "🔐 Please login to Supabase first:"
    supabase login
fi

echo "✅ Authenticated with Supabase"

# Check if project is linked
if [ ! -f .supabase/config.toml ]; then
    echo "❌ Project not linked to Supabase."
    echo "Please run: supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
fi

echo "✅ Project linked"

# Deploy the function
echo "📦 Deploying send-claim-email function..."
if supabase functions deploy send-claim-email; then
    echo "✅ Function deployed successfully!"
else
    echo "❌ Function deployment failed!"
    exit 1
fi

# Check if environment variables are set
echo ""
echo "🔧 Checking environment variables..."
echo "Please make sure these are set in your Supabase dashboard:"
echo "- RESEND_API_KEY: Your Resend API key (required)"
echo "- SUPABASE_URL: Your Supabase project URL"
echo "- SUPABASE_ANON_KEY: Your Supabase anon key"

# Provide next steps
echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Supabase Dashboard → Settings → Edge Functions"
echo "2. Test the function by submitting a claim in your app"
echo "3. Check function logs: supabase functions logs send-claim-email"
echo "4. Monitor email delivery in your Resend dashboard"
echo ""
echo "📚 Full setup guide: docs/EMAIL_EDGE_FUNCTIONS_SETUP.md" 