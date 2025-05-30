@echo off
echo 🚀 InsurixAI Email Edge Function Deployment
echo ===========================================

REM Check if Supabase CLI is installed globally
supabase --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Supabase CLI found (global installation)
    set SUPABASE_CMD=supabase
    goto :check_auth
)

REM Check if Supabase CLI is available via npx
npx supabase --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Supabase CLI found (npx/local installation)
    set SUPABASE_CMD=npx supabase
    goto :check_auth
)

REM Supabase CLI not found
echo ❌ Supabase CLI is not installed.
echo.
echo Please install Supabase CLI using one of these methods:
echo.
echo Method 1 - Local npm installation (Recommended):
echo   npm install supabase --save-dev
echo   Then run this script again.
echo.
echo Method 2 - Using Scoop:
echo   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
echo   scoop install supabase
echo.
echo Method 3 - Using Chocolatey:
echo   choco install supabase
echo.
echo 📚 Full installation guide: docs/SUPABASE_CLI_INSTALL.md
echo.
pause
exit /b 1

:check_auth
REM Check if logged in
%SUPABASE_CMD% projects list >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Supabase first:
    %SUPABASE_CMD% login
    if %errorlevel% neq 0 (
        echo ❌ Login failed!
        pause
        exit /b 1
    )
)

echo ✅ Authenticated with Supabase

REM Check if project is linked
if not exist .supabase\config.toml (
    echo ❌ Project not linked to Supabase.
    echo.
    echo To link your project:
    echo 1. Go to your Supabase dashboard
    echo 2. Copy your project reference (from Settings → General)
    echo 3. Run: %SUPABASE_CMD% link --project-ref YOUR_PROJECT_REF
    echo.
    pause
    exit /b 1
)

echo ✅ Project linked

REM Check if the function directory exists
if not exist supabase\functions\send-claim-email (
    echo ❌ Edge Function directory not found!
    echo Expected: supabase\functions\send-claim-email\
    echo.
    echo Please make sure you're running this script from the project root directory.
    pause
    exit /b 1
)

echo ✅ Edge Function directory found

REM Deploy the function
echo 📦 Deploying send-claim-email function...
%SUPABASE_CMD% functions deploy send-claim-email
if %errorlevel% neq 0 (
    echo ❌ Function deployment failed!
    echo.
    echo Common solutions:
    echo 1. Check your internet connection
    echo 2. Verify you have permission to deploy functions
    echo 3. Check function logs: %SUPABASE_CMD% functions logs send-claim-email
    pause
    exit /b 1
)

echo ✅ Function deployed successfully!

REM Provide next steps
echo.
echo 🔧 Environment Variables Setup
echo ============================
echo Please set these environment variables in your Supabase dashboard:
echo.
echo 1. Go to: Supabase Dashboard → Settings → Edge Functions
echo 2. Add these variables:
echo    - RESEND_API_KEY: Your Resend API key (required)
echo    - SUPABASE_URL: Your Supabase project URL
echo    - SUPABASE_ANON_KEY: Your Supabase anon key
echo.
echo Or set them via CLI:
echo   %SUPABASE_CMD% secrets set RESEND_API_KEY=re_your_key_here
echo.
echo 🎉 Deployment Complete!
echo.
echo Next steps:
echo 1. Set environment variables (see above)
echo 2. Test the function by submitting a claim in your app
echo 3. Check function logs: %SUPABASE_CMD% functions logs send-claim-email
echo 4. Monitor email delivery in your Resend dashboard
echo.
echo 📚 Setup guides:
echo   - docs/EMAIL_EDGE_FUNCTIONS_SETUP.md
echo   - docs/SUPABASE_CLI_INSTALL.md
echo.
pause 