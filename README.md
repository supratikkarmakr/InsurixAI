# 📱 InsurixAI – One App. All Risks Covered

> *A smart and responsive one-stop insurance solution for India. Buy, compare, and manage insurance policies with ease. Submit instant claims powered by ML and OCR.*

## 🌟 Overview

InsurixAI is a comprehensive mobile application designed to revolutionize the insurance experience in India. Our platform combines cutting-edge technology with user-friendly design to provide seamless insurance management, intelligent claim processing, and AI-powered assistance.

**Key Features:**
- 🤖 AI-powered damage assessment
- 🎤 Voice assistant integration
- ⚡ Instant claim processing
- 🔐 Secure Aadhaar-based authentication

---

## 🚀 App Flow Overview

### 1. 🎨 Splash Screen
- **Branding**: InsurixAI logo and visual identity
- **Slogan**: "*One app. All risks covered*"
- **Navigation**: "Get Started" button → Login/Sign-Up screen

### 2. 🔐 Authentication
**Login Options:**
- 📧 **Email-based registration/login**
- 🆔 **Aadhaar-based login** (via secure KYC API integration)

**Post-login**: Automatic redirect to Home Dashboard

---

## 🏠 Main Dashboard

### Top Section
```
┌─────────────────────────────────────┐
│ 🌅 Good morning, XYZ            │
│ 👤 Profile (60% complete)          │
│                                     │   
└─────────────────────────────────────┘
```

**Features:**
- **Smart Greetings**: Time-based personalized messages
- **Profile Completion**: Visual progress indicator
- **AI Voice Assistant**: Accessible via microphone button on the button middle

### Policy Management Card

| Field | Example |
|-------|---------|
| **Policyholder** | Rahul Sharma |
| **Policy Number** | MPO4CY9999 |
| **Third-party Validity** | 10/02/25 |
| **Policy Type** | Comprehensive |
| **Action** | 🔄 Renew Now |

### 🔄 Add New Policies
1. **Quick Add**: Manual policy entry
2. **AI Assistant**: Voice-guided policy addition

### ⚡ Quick Actions
- 🚨 **Instant Claim** – Start your claim in minutes
- 🔧 **Find Local Services** – Repair shops, towing, hospitals
- 📋 **See More** – Additional quick actions

---

## 📷 Instant Claim Flow

### Step 1: 📸 Photo Capture/Upload
```
┌─────────────────┐    ┌─────────────────┐
│   📤 Upload     │ OR │   📸 Camera     │
│   from Device   │    │   Capture       │
└─────────────────┘    └─────────────────┘
```

### Step 2: 📝 Claim Details Form
| Field | Input Method |
|-------|-------------|
| **Policy Number** | Manual entry or OCR scan |
| **Incident Date** | Date picker |
| **Claim Amount** | Numerical input |
| **Description** | Free text |

### Step 3: 🧠 ML-Powered Assessment
**AI Processing Pipeline:**
```
📸 Photos + 📄 Data → 🤖 ML Model → 📊 Analysis Report
```

**ML Model Tasks:**
- ✅ Detect visible damages (dents, scratches, broken parts)
- 💰 Estimate claimable amount
- 📈 Calculate confidence score
- 📋 Generate structured claim request

### Step 4: ✅ Confirmation
**Success Flow:**
1. ✅ Verification passed
2. 🎉 Animated success indicator
3. 📋 Navigate to Claim History

---

## 🔌 OCR Integration

### Auto-Fill Feature
```
📄 Scan Policy Document → 🔍 OCR Processing → 📝 Auto-populate Fields
```

**Supported Documents:**
- Insurance policy documents
- Vehicle registration certificates
- Previous claim documents

---

## 👤 Profile & Management

### Core Features
- 📋 **Policy Portfolio**: View and manage all insurance policies
- 📊 **Claim Tracking**: Monitor instant claim submissions
- 🔍 **Status Updates**: Real-time claim progress tracking
- 🎤 **Voice Queries**: Get updates via AI assistant

---

## 🧠 Machine Learning Integration

### Backend API Structure

#### Damage Prediction Endpoint
```http
POST /api/v1/predict-damage
Content-Type: application/json

{
  "images": ["base64_img1", "base64_img2"],
  "policyNumber": "MPO4CY9999",
  "incidentDate": "2025-05-25",
  "vehicleDetails": {
    "make": "Honda",
    "model": "City",
    "year": 2020
  }
}
```

#### Response Format
```json
{
  "status": "success",
  "damageAssessment": {
    "overallScore": 0.85,
    "damageTypes": ["front_bumper_dent", "headlight_crack"],
    "estimatedCost": 15000,
    "confidence": 0.92,
    "claimable": true
  },
  "processingTime": "2.3s"
}
```

---

## 🛠️ Tech Stack
Frontend: React Native with TypeScript, Expo, and Expo Router ,Tailwind CSS
Backend/Database: Supabase
UI Framework: React Native Paper
AI Processing: DeepSeek

### 🤖 AI/ML & OCR
| Technology | Purpose |
|------------|---------|
| **TensorFlow / PyTorch** | Damage detection models |
| **Tesseract** | OCR processing |
| **OpenCV** | Image preprocessing |

---

## 🗄️ Database Schema (Supabase)

### 📊 Core Tables

#### 1. `users` - User Authentication & Profile
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  aadhaar_number VARCHAR(12) UNIQUE,
  pan_number VARCHAR(10) UNIQUE,
  date_of_birth DATE,
  address JSONB, -- {street, city, state, pincode}
  profile_picture_url TEXT,
  kyc_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
  profile_completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

#### 2. `insurance_policies` - Policy Management
```sql
CREATE TABLE insurance_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  policy_number VARCHAR(50) UNIQUE NOT NULL,
  policy_type VARCHAR(30) NOT NULL, -- car, health, life, home, travel
  provider_name VARCHAR(100) NOT NULL,
  policy_holder_name VARCHAR(100) NOT NULL,
  
  -- Policy Details
  premium_amount DECIMAL(10,2),
  coverage_amount DECIMAL(12,2),
  policy_start_date DATE NOT NULL,
  policy_end_date DATE NOT NULL,
  premium_due_date DATE,
  
  -- Vehicle/Asset Specific (for car/home insurance)
  asset_details JSONB, -- {make, model, year, registration_number, etc.}
  
  -- Status & Documents
  policy_status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
  policy_document_url TEXT,
  auto_renewal BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. `claims` - Claim Management
```sql
CREATE TABLE claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES insurance_policies(id) ON DELETE CASCADE,
  
  -- Claim Information
  claim_number VARCHAR(50) UNIQUE NOT NULL,
  incident_date DATE NOT NULL,
  incident_description TEXT NOT NULL,
  incident_location JSONB, -- {latitude, longitude, address}
  
  -- Financial Details
  claimed_amount DECIMAL(10,2) NOT NULL,
  estimated_amount DECIMAL(10,2), -- ML prediction
  approved_amount DECIMAL(10,2),
  
  -- Status Tracking
  claim_status VARCHAR(30) DEFAULT 'submitted', -- submitted, under_review, approved, rejected, settled
  priority_level VARCHAR(10) DEFAULT 'medium', -- low, medium, high, urgent
  
  -- ML Analysis
  ml_damage_score DECIMAL(3,2), -- 0.00 to 1.00
  ml_confidence DECIMAL(3,2),
  damage_types JSONB, -- ["front_bumper_dent", "headlight_crack"]
  
  -- Processing
  reviewer_id UUID REFERENCES users(id),
  review_notes TEXT,
  settlement_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. `claim_documents` - Document Management
```sql
CREATE TABLE claim_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  
  document_type VARCHAR(30) NOT NULL, -- damage_photo, police_report, medical_bill, invoice
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER, -- in bytes
  mime_type VARCHAR(100),
  
  -- OCR & Analysis
  ocr_extracted_text TEXT,
  ml_analysis_result JSONB,
  is_verified BOOLEAN DEFAULT false,
  
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. `ai_interactions` - AI Assistant Logs
```sql
CREATE TABLE ai_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  session_id UUID NOT NULL,
  interaction_type VARCHAR(20) NOT NULL, -- voice, text, image
  user_input TEXT,
  ai_response TEXT NOT NULL,
  intent_detected VARCHAR(50), -- add_policy, check_claim, find_service
  confidence_score DECIMAL(3,2),
  
  -- Context
  policy_id UUID REFERENCES insurance_policies(id),
  claim_id UUID REFERENCES claims(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. `service_providers` - Local Services
```sql
CREATE TABLE service_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  name VARCHAR(100) NOT NULL,
  service_type VARCHAR(30) NOT NULL, -- garage, hospital, towing, legal
  contact_phone VARCHAR(15),
  contact_email VARCHAR(255),
  
  -- Location
  address JSONB NOT NULL, -- {street, city, state, pincode}
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Business Details
  rating DECIMAL(2,1) DEFAULT 0.0, -- 0.0 to 5.0
  is_verified BOOLEAN DEFAULT false,
  operating_hours JSONB, -- {monday: "9:00-18:00", ...}
  services_offered TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7. `notifications` - Push Notifications
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(30) NOT NULL, -- claim_update, renewal_reminder, payment_due
  
  -- Related Entities
  policy_id UUID REFERENCES insurance_policies(id),
  claim_id UUID REFERENCES claims(id),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 🔗 Database Relationships
```
users (1) ←→ (N) insurance_policies
users (1) ←→ (N) claims  
users (1) ←→ (N) ai_interactions
users (1) ←→ (N) notifications

insurance_policies (1) ←→ (N) claims
claims (1) ←→ (N) claim_documents

service_providers (standalone with geolocation queries)
```

### 📈 Database Indexes (Performance Optimization)
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_aadhaar ON users(aadhaar_number);

-- Policy searches
CREATE INDEX idx_policies_user_id ON insurance_policies(user_id);
CREATE INDEX idx_policies_number ON insurance_policies(policy_number);
CREATE INDEX idx_policies_status ON insurance_policies(policy_status);
CREATE INDEX idx_policies_end_date ON insurance_policies(policy_end_date);

-- Claim tracking
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_claims_policy_id ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(claim_status);
CREATE INDEX idx_claims_number ON claims(claim_number);

-- Geolocation for services
CREATE INDEX idx_service_providers_location ON service_providers USING GIST(ll_to_earth(latitude, longitude));

-- AI interaction analysis
CREATE INDEX idx_ai_interactions_user_session ON ai_interactions(user_id, session_id);
CREATE INDEX idx_ai_interactions_intent ON ai_interactions(intent_detected);
```

---

## 📁 Optimal Folder Structure

### 🏗️ React Native + Expo Project Structure
```
insurix-ai/
├── 📱 app/                          # Expo Router App Directory
│   ├── (auth)/                      # Authentication Group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   │
│   ├── (tabs)/                      # Main App Tabs
│   │   ├── index.tsx                # Home Dashboard
│   │   ├── policies.tsx             # Policy Management
│   │   ├── claims.tsx               # Claims History
│   │   ├── services.tsx             # Local Services
│   │   ├── profile.tsx              # User Profile
│   │   └── _layout.tsx              # Tab Layout
│   │
│   ├── claim/                       # Claim Flow Screens
│   │   ├── camera.tsx               # Photo Capture
│   │   ├── details.tsx              # Claim Form
│   │   ├── review.tsx               # Review & Submit
│   │   └── success.tsx              # Success Screen
│   │
│   ├── policy/                      # Policy Management
│   │   ├── add.tsx                  # Add New Policy
│   │   ├── [id].tsx                 # Policy Details
│   │   └── renew/[id].tsx           # Policy Renewal
│   │
│   ├── onboarding/                  # First-time User Flow
│   │   ├── welcome.tsx
│   │   ├── kyc.tsx
│   │   └── permissions.tsx
│   │
│   ├── +not-found.tsx               # 404 Screen
│   └── _layout.tsx                  # Root Layout
│
├── 🧩 src/                          # Source Code
│   ├── components/                  # Reusable Components
│   │   ├── ui/                      # Base UI Components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/                   # Form Components
│   │   │   ├── ClaimForm.tsx
│   │   │   ├── PolicyForm.tsx
│   │   │   └── ProfileForm.tsx
│   │   │
│   │   ├── layout/                  # Layout Components
│   │   │   ├── Header.tsx
│   │   │   ├── TabBar.tsx
│   │   │   └── SafeAreaWrapper.tsx
│   │   │
│   │   └── features/                # Feature-specific Components
│   │       ├── camera/
│   │       │   ├── CameraView.tsx
│   │       │   └── ImagePreview.tsx
│   │       ├── ai-assistant/
│   │       │   ├── VoiceButton.tsx
│   │       │   └── ChatInterface.tsx
│   │       └── maps/
│   │           └── ServiceLocator.tsx
│   │
│   ├── hooks/                       # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── usePolicies.ts
│   │   ├── useClaims.ts
│   │   ├── useCamera.ts
│   │   ├── useLocation.ts
│   │   ├── useVoiceRecording.ts
│   │   └── useSupabase.ts
│   │
│   ├── services/                    # API & External Services
│   │   ├── api/                     # API Layer
│   │   │   ├── auth.ts
│   │   │   ├── policies.ts
│   │   │   ├── claims.ts
│   │   │   ├── users.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── supabase/                # Supabase Configuration
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── ai/                      # AI/ML Services
│   │   │   ├── deepseek.ts          # DeepSeek Integration
│   │   │   ├── damage-detection.ts
│   │   │   ├── ocr.ts               # Tesseract OCR
│   │   │   └── voice-processing.ts
│   │   │
│   │   └── external/                # Third-party Integrations
│   │       ├── maps.ts              # Google Maps
│   │       ├── notifications.ts     # Push Notifications
│   │       └── payment.ts           # Payment Gateway
│   │
│   ├── stores/                      # State Management (Zustand)
│   │   ├── authStore.ts
│   │   ├── policyStore.ts
│   │   ├── claimStore.ts
│   │   ├── appStore.ts
│   │   └── index.ts
│   │
│   ├── utils/                       # Utility Functions
│   │   ├── validation.ts            # Form Validation
│   │   ├── formatting.ts            # Data Formatting
│   │   ├── constants.ts             # App Constants
│   │   ├── helpers.ts               # General Helpers
│   │   ├── storage.ts               # Local Storage
│   │   └── permissions.ts           # Device Permissions
│   │
│   ├── types/                       # TypeScript Types
│   │   ├── api.ts                   # API Response Types
│   │   ├── database.ts              # Database Schema Types
│   │   ├── navigation.ts            # Navigation Types
│   │   ├── user.ts                  # User Types
│   │   ├── policy.ts                # Policy Types
│   │   ├── claim.ts                 # Claim Types
│   │   └── index.ts
│   │
│   └── styles/                      # Styling
│       ├── theme.ts                 # Theme Configuration
│       ├── colors.ts                # Color Palette
│       ├── typography.ts            # Typography Scale
│       └── globals.css              # Global Styles
│
├── 📦 assets/                       # Static Assets
│   ├── images/
│   │   ├── logo/
│   │   ├── onboarding/
│   │   ├── icons/
│   │   └── placeholders/
│   │
│   ├── animations/                  # Lottie Animations
│   │   ├── loading.json
│   │   ├── success.json
│   │   └── error.json
│   │
│   └── fonts/                       # Custom Fonts
│       ├── Roboto-Regular.ttf
│       └── Roboto-Bold.ttf
│
├── 🧪 __tests__/                    # Testing
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── setup.ts
│
├── 📚 docs/                         # Documentation
│   ├── README.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── 🔧 config/                       # Configuration Files
│   ├── env.example
│   ├── supabase.ts
│   └── app.config.ts
│
├── 📱 Platform-specific/
│   ├── android/                     # Android specific
│   └── ios/                         # iOS specific
│
├── 🚀 scripts/                      # Build & Deployment Scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── database-migrate.sql
│
├── 📋 Configuration Files
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript Config
├── expo.json                        # Expo Configuration
├── tailwind.config.js               # Tailwind CSS
├── babel.config.js                  # Babel Configuration
├── jest.config.js                   # Testing Configuration
├── .env.example                     # Environment Variables
├── .gitignore
└── README.md
```

### 📱 Key Folder Descriptions

#### **`app/` - Expo Router Pages**
- Uses file-based routing with Expo Router
- Groups related screens using parentheses `(auth)`, `(tabs)`
- Dynamic routes with `[id].tsx` syntax

#### **`src/components/` - Component Library**
- **`ui/`**: Base reusable components (Button, Card, Input)
- **`forms/`**: Complex form components
- **`layout/`**: App structure components
- **`features/`**: Feature-specific components

#### **`src/services/` - Business Logic**
- **`api/`**: HTTP API calls
- **`supabase/`**: Database operations
- **`ai/`**: ML and AI processing
- **`external/`**: Third-party integrations

#### **`src/stores/` - State Management**
- Zustand stores for different app domains
- Reactive state management with TypeScript

#### **`src/types/` - TypeScript Definitions**
- Comprehensive type safety
- Database schema types
- API response types

### 🔧 Configuration Highlights

#### **Package.json Dependencies**
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "~3.4.0",
    "react-native": "0.73.0",
    "react-native-paper": "^5.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.45.0",
    "expo-camera": "~14.0.0",
    "expo-location": "~16.1.0",
    "expo-av": "~13.4.0",
    "nativewind": "^2.0.11"
  }
}
```

This structure provides:
- 🎯 **Clear Separation**: Each domain has its own folder
- 🔄 **Scalability**: Easy to add new features
- 🧪 **Testability**: Co-located tests with components
- 📱 **Platform Support**: iOS/Android specific code organization
- ⚡ **Performance**: Optimized imports and tree-shaking

---

## 🗂️ App Screens Reference

| Screen | Description | Key Features |
|--------|-------------|--------------|
| **Splash Screen** | App branding & onboarding | Logo, slogan, CTA button |
| **Home Dashboard** | Main interface | Profile, policies, quick actions |
| **Instant Claim** | Claim submission flow | Photo upload, form filling, ML processing |
| **Profile** | User management | Settings, policy portfolio, claim history |

---

## 🎤 AI Assistant Capabilities

### Core Functions
- 🗣️ **Policy Management**: Add new policies via voice commands
- 📚 **Education**: Explain complex insurance terms in simple language
- 📊 **Tracking**: Provide real-time claim status updates
- 🗺️ **Location Services**: Find nearest garages, hospitals, service centers
- 💬 **Support**: 24/7 customer assistance in multiple languages

### Voice Commands Examples
```
"Add my new car insurance policy"
"What's the status of my claim MPO4CY9999?"
"Find the nearest authorized repair shop"
"Explain comprehensive vs third-party insurance"
```

---

## 🚀 Future Enhancements

### Phase 2 Features
- 🏛️ **Government Integration**: IRDAI API connectivity
- 🆔 **Enhanced KYC**: PAN/Aadhaar eKYC verification
- 🔍 **Insurance Marketplace**: Real-time policy comparison engine
- 🌐 **Localization**: Multi-language support (Hindi, Tamil, Bengali, etc.)

### Phase 3 Features
- 💳 **Payment Gateway**: In-app premium payments
- 🔔 **Smart Notifications**: Renewal reminders and alerts
- 📈 **Analytics Dashboard**: Personal insurance insights
- 🤝 **Partner Network**: Integration with hospitals, garages, and service providers

---

## 📊 Getting Started

### Prerequisites
- **Node.js 18+** with npm/yarn
- **Expo CLI** (`npm install -g @expo/cli`)
- **React Native development environment**
- **Supabase Account** (for database & authentication)
- **DeepSeek API Key** (for AI processing)

### Installation & Setup

#### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-org/insurix-ai.git
cd insurix-ai

# Install dependencies
npm install
# or
yarn install
```

#### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your keys
nano .env
```

**Required Environment Variables:**
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# DeepSeek AI
DEEPSEEK_API_KEY=your_deepseek_api_key

# External Services (Optional)
GOOGLE_MAPS_API_KEY=your_google_maps_key
EXPO_PUBLIC_APP_ENV=development
```

#### 3. Database Setup (Supabase)
```bash
# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

#### 4. Start Development Server
```bash
# Start Expo development server
npm start
# or
expo start

# For specific platforms
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web Browser
```

### 📱 Development Workflow

#### Running on Physical Device
```bash
# Install Expo Go app on your phone
# Scan QR code from terminal

# For production builds
eas build --platform ios
eas build --platform android
```

#### Testing
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:components
```

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

<div align="center">

**Made with ❤️ for the Indian Insurance Industry**

[Website](https://insurixai.com) • [Documentation](https://docs.insurixai.com) • [API Reference](https://api.insurixai.com)

</div>
