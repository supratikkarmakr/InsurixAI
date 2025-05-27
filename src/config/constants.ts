// Environment Configuration Constants

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL,
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY, // Server-side only
} as const;

// App Configuration
export const APP_CONFIG = {
  env: process.env.APP_ENV || 'development',
  version: '1.0.0',
  name: 'InsurixAI',
} as const;

// Validation function to check required environment variables
export const validateEnvironment = () => {
  const missing: string[] = [];

  if (!SUPABASE_CONFIG.url) {
    missing.push('EXPO_PUBLIC_SUPABASE_URL');
  }
  
  if (!SUPABASE_CONFIG.anonKey) {
    missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\n` +
      'Please check your .env file and ensure all required variables are set.\n' +
      'Refer to env.example for the required format.\n\n' +
      'To get your Supabase credentials:\n' +
      '1. Go to https://supabase.com/dashboard\n' +
      '2. Select your project\n' +
      '3. Go to Settings > API\n' +
      '4. Copy the Project URL and anon public key'
    );
  }

  return true;
};

// API Endpoints (when using custom backend)
export const API_ENDPOINTS = {
  base: SUPABASE_CONFIG.url,
  auth: '/auth/v1',
  rest: '/rest/v1',
  storage: '/storage/v1',
} as const;

// Storage Buckets
export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  documents: 'documents',
  claims: 'claims',
  policies: 'policies',
} as const; 