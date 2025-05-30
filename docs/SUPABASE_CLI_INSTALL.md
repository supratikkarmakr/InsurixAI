# Supabase CLI Installation Guide for Windows

The global npm installation of Supabase CLI is not supported. Here are the correct ways to install it on Windows:

## Method 1: Using Scoop (Recommended for Windows)

### Install Scoop first (if not already installed):
```powershell
# Run in PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Install Supabase CLI via Scoop:
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Verify installation:
```powershell
supabase --version
```

## Method 2: Using Chocolatey

### Install Chocolatey first (if not already installed):
```powershell
# Run in PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Install Supabase CLI:
```powershell
choco install supabase
```

## Method 3: Direct Download (Windows Binary)

1. Go to [Supabase CLI Releases](https://github.com/supabase/cli/releases)
2. Download the Windows binary (`supabase_windows_amd64.tar.gz`)
3. Extract the archive
4. Add the extracted folder to your PATH environment variable

## Method 4: Using Windows Subsystem for Linux (WSL)

If you have WSL installed:

```bash
# Install via curl
curl -fsSL https://supabase.com/install.sh | sh

# Or using package managers in Linux
sudo apt update
sudo apt install supabase
```

## Method 5: Using npm locally (Project-specific)

Instead of global installation, install it locally in your project:

```bash
# In your project directory
npm install supabase --save-dev

# Use via npx
npx supabase --version
```

## Verification

After installation, verify it works:

```powershell
supabase --version
supabase login
```

## Quick Setup for InsurixAI

Once Supabase CLI is installed, run these commands in your project directory:

```powershell
# Login to Supabase
supabase login

# Link your project (replace with your project reference)
supabase link --project-ref your-project-ref-here

# Deploy the email function
supabase functions deploy send-claim-email

# Set environment variables (replace with your actual API key)
supabase secrets set RESEND_API_KEY=re_your_resend_api_key_here
```

## Troubleshooting

### Common Issues:

1. **"Command not found"**: Make sure the CLI is in your PATH
2. **Permission errors**: Run PowerShell as Administrator for installation
3. **Network issues**: Check firewall/proxy settings

### Alternative: Use Supabase Dashboard

If CLI installation is problematic, you can also:
1. Copy the Edge Function code manually
2. Create the function in Supabase Dashboard → Edge Functions
3. Set environment variables in the dashboard
4. Deploy directly from the web interface

## Next Steps

After successful installation:
1. Follow the main setup guide: `docs/EMAIL_EDGE_FUNCTIONS_SETUP.md`
2. Run the deployment script: `scripts/deploy-email-function.bat`
3. Test the email functionality in your app 