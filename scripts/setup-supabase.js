#!/usr/bin/env node

/**
 * Supabase Setup Script for InsurixAI
 * 
 * This script helps you set up your Supabase configuration.
 * Run with: node scripts/setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupSupabase() {
  console.log('🚀 InsurixAI Supabase Setup\n');
  
  // Check if .env already exists
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', 'env.example');
  
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('Please provide your Supabase credentials:');
  console.log('(You can find these in your Supabase Dashboard > Settings > API)\n');

  // Get Supabase URL
  const supabaseUrl = await question('📍 Supabase Project URL: ');
  if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
    console.log('❌ Invalid Supabase URL. Should look like: https://your-project.supabase.co');
    rl.close();
    return;
  }

  // Get Supabase Anon Key
  const supabaseAnonKey = await question('🔑 Supabase Anon Key: ');
  if (!supabaseAnonKey || supabaseAnonKey.length < 100) {
    console.log('❌ Invalid Supabase Anon Key. It should be a long JWT token.');
    rl.close();
    return;
  }

  // Optional: Service Role Key
  const serviceRoleKey = await question('🔐 Supabase Service Role Key (optional, press Enter to skip): ');

  // Create .env content
  const envContent = `# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
${serviceRoleKey ? `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}` : '# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here'}

# App Configuration
APP_ENV=development
`;

  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Successfully created .env file!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm start');
    console.log('2. Your app should now connect to Supabase');
    console.log('3. Check the console for any connection errors');
    console.log('\n🔒 Remember: .env file is gitignored for security');
  } catch (error) {
    console.log('\n❌ Error creating .env file:', error.message);
  }

  rl.close();
}

if (require.main === module) {
  setupSupabase().catch(console.error);
}

module.exports = { setupSupabase }; 