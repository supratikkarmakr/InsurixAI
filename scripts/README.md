# InsurixAI Setup Scripts

This directory contains scripts to help you set up the email functionality for InsurixAI.

## 🎯 Which Script Should I Use?

### For Complete Setup (Recommended)
**`setup-email-system.bat`** - Complete automated setup
- ✅ Installs Supabase CLI locally  
- ✅ Logs you into Supabase
- ✅ Links your project
- ✅ Deploys the Edge Function
- ✅ Guides through environment setup
- **Use this if**: You're setting up email functionality for the first time

### For Deployment Only
**`deploy-email-function.bat`** - Deploy the Edge Function only
- ✅ Deploys the send-claim-email function
- ✅ Handles both global and local Supabase CLI installations
- ✅ Provides detailed error messages and troubleshooting
- **Use this if**: You already have Supabase CLI set up and just need to deploy

**`deploy-email-function.sh`** - Unix/Linux version of the deployment script
- **Use this if**: You're on macOS or Linux

## 📋 Prerequisites

Before running any script:

1. **Node.js and npm** installed
2. **Internet connection** for downloading packages
3. **Supabase account** with a project created
4. **Project files** - make sure you're in the project root directory

## 🚀 Quick Start

1. **Open PowerShell** in your project root directory
2. **Run the complete setup**:
   ```powershell
   scripts/setup-email-system.bat
   ```
3. **Follow the prompts** to complete setup
4. **Get a Resend API key** from https://resend.com
5. **Test by submitting a claim** in your app

## 🔧 Troubleshooting

### Common Issues:

**"Command not found"**
- Make sure you're running from the project root directory
- Check that the script files have proper permissions

**"Supabase CLI installation failed"**
- Check your internet connection
- Try running `npm install supabase --save-dev` manually
- See `docs/SUPABASE_CLI_INSTALL.md` for alternative installation methods

**"Function deployment failed"**
- Verify you're logged into Supabase: `npx supabase projects list`
- Check your project is linked: Look for `.supabase/config.toml` file
- Ensure the function files exist in `supabase/functions/send-claim-email/`

**"Permission denied"**
- Run PowerShell as Administrator
- Check if your antivirus is blocking the script

### Getting Help:

1. **Check the logs** - Scripts provide detailed error messages
2. **Read the docs** - See `docs/` directory for detailed guides
3. **Try manual setup** - Use the manual installation guides if scripts fail

## 📚 Related Documentation

- `docs/EMAIL_EDGE_FUNCTIONS_SETUP.md` - Complete email setup guide
- `docs/SUPABASE_CLI_INSTALL.md` - Supabase CLI installation options
- `docs/QUICK_DATABASE_SETUP.md` - Database setup guide

## 🔄 Re-running Scripts

**Safe to re-run**: All scripts are designed to be safe to run multiple times
- They check for existing installations
- Skip steps that are already completed  
- Won't break your existing setup

**When to re-run**:
- After updating the Edge Function code
- When switching between projects
- If environment variables change
- After updating Supabase CLI

Happy coding! 🎉 