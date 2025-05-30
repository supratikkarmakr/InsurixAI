@echo off
echo 🎯 InsurixAI Email System Setup
echo ===============================
echo This script will:
echo 1. Install Supabase CLI locally
echo 2. Set up the Edge Function for email sending
echo 3. Guide you through the configuration
echo.
pause

REM Check if we're in the right directory
if not exist package.json (
    echo ❌ Error: package.json not found!
    echo Please run this script from your project root directory.
    pause
    exit /b 1
)

echo ✅ Project directory confirmed

REM Step 1: Install Supabase CLI locally
echo.
echo 📦 Step 1: Installing Supabase CLI locally...
echo ============================================
npm install supabase --save-dev
if %errorlevel% neq 0 (
    echo ❌ Failed to install Supabase CLI
    echo Please check your npm installation and try again.
    pause
    exit /b 1
)

echo ✅ Supabase CLI installed successfully!

REM Step 2: Verify installation
echo.
echo 🔍 Step 2: Verifying installation...
echo ===================================
npx supabase --version
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI verification failed
    pause
    exit /b 1
)

echo ✅ Supabase CLI is working!

REM Step 3: Login to Supabase
echo.
echo 🔐 Step 3: Login to Supabase...
echo ==============================
echo Please login to your Supabase account when prompted.
npx supabase login
if %errorlevel% neq 0 (
    echo ❌ Login failed!
    echo Please try again or check your credentials.
    pause
    exit /b 1
)

echo ✅ Logged in successfully!

REM Step 4: Link project
echo.
echo 🔗 Step 4: Link your Supabase project...
echo ========================================
echo.
echo To link your project, you need your project reference:
echo 1. Go to your Supabase dashboard: https://supabase.com/dashboard
echo 2. Select your project
echo 3. Go to Settings → General
echo 4. Copy the "Reference ID"
echo.
set /p PROJECT_REF="Enter your project reference ID: "

if "%PROJECT_REF%"=="" (
    echo ❌ Project reference is required!
    pause
    exit /b 1
)

npx supabase link --project-ref %PROJECT_REF%
if %errorlevel% neq 0 (
    echo ❌ Failed to link project!
    echo Please check your project reference and try again.
    pause
    exit /b 1
)

echo ✅ Project linked successfully!

REM Step 5: Check if Edge Function exists
echo.
echo 📋 Step 5: Checking Edge Function...
echo ===================================
if not exist supabase\functions\send-claim-email (
    echo ❌ Edge Function not found!
    echo Expected: supabase\functions\send-claim-email\
    echo.
    echo Please make sure the email function files are in place.
    echo Check the docs/EMAIL_EDGE_FUNCTIONS_SETUP.md guide.
    pause
    exit /b 1
)

echo ✅ Edge Function found!

REM Step 6: Deploy the function
echo.
echo 🚀 Step 6: Deploying Edge Function...
echo ====================================
npx supabase functions deploy send-claim-email
if %errorlevel% neq 0 (
    echo ❌ Function deployment failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo ✅ Edge Function deployed successfully!

REM Step 7: Environment variables setup
echo.
echo 🔧 Step 7: Environment Variables Setup
echo =====================================
echo.
echo Now you need to set up your environment variables.
echo You'll need:
echo.
echo 1. RESEND_API_KEY - Get this from https://resend.com
echo 2. SUPABASE_URL - Your Supabase project URL
echo 3. SUPABASE_ANON_KEY - Your Supabase anon key
echo.
echo Choose how to set them up:
echo [1] Set via CLI now
echo [2] Set via Supabase Dashboard later
echo.
set /p SETUP_CHOICE="Enter your choice (1 or 2): "

if "%SETUP_CHOICE%"=="1" (
    echo.
    echo Setting up environment variables via CLI...
    echo.
    set /p RESEND_KEY="Enter your Resend API key (starts with 're_'): "
    
    if not "%RESEND_KEY%"=="" (
        npx supabase secrets set RESEND_API_KEY=%RESEND_KEY%
        if %errorlevel% equ 0 (
            echo ✅ RESEND_API_KEY set successfully!
        ) else (
            echo ❌ Failed to set RESEND_API_KEY
        )
    )
)

if "%SETUP_CHOICE%"=="2" (
    echo.
    echo Manual setup instructions:
    echo 1. Go to: Supabase Dashboard → Settings → Edge Functions
    echo 2. Add these environment variables:
    echo    - RESEND_API_KEY: Your Resend API key
    echo    - SUPABASE_URL: Your project URL
    echo    - SUPABASE_ANON_KEY: Your anon key
)

REM Step 8: Final verification
echo.
echo 🎉 Setup Complete!
echo =================
echo.
echo Your email system is now set up! Here's what you can do next:
echo.
echo 1. ✅ Supabase CLI installed locally
echo 2. ✅ Project linked to Supabase
echo 3. ✅ Edge Function deployed
echo 4. 🔧 Environment variables (set them if you haven't)
echo.
echo Next steps:
echo -----------
echo 1. Make sure environment variables are set
echo 2. Test by submitting a claim in your app
echo 3. Check function logs: npx supabase functions logs send-claim-email
echo 4. Monitor emails in your Resend dashboard
echo.
echo Useful commands:
echo ---------------
echo - View function logs: npx supabase functions logs send-claim-email
echo - Redeploy function: npx supabase functions deploy send-claim-email
echo - Set secrets: npx supabase secrets set KEY_NAME=value
echo - List secrets: npx supabase secrets list
echo.
echo 📚 Documentation:
echo - docs/EMAIL_EDGE_FUNCTIONS_SETUP.md
echo - docs/SUPABASE_CLI_INSTALL.md
echo.
echo Happy coding! 🚀
pause 