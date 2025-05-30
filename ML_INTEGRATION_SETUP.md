# 🚗 ML Model Integration Setup Guide

This guide will walk you through setting up the complete car damage detection system with your Expo app.

## 📋 Prerequisites

- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed
- ✅ Expo CLI installed (`npm install -g @expo/cli`)
- ✅ Your trained ML models in `api/models/` directory

## 🔧 Step 1: Backend Setup (FastAPI)

### 1.1 Navigate to API Directory
```bash
cd api
```

### 1.2 Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 1.3 Install Python Dependencies

**Option 1: Automated Installation (Recommended)**
```bash
python install_dependencies.py
```

**Option 2: Standard Installation**
```bash
pip install -r requirements.txt
```

**Option 3: If you get TensorFlow version errors**
```bash
# Try the simplified requirements
pip install -r requirements-simple.txt

# Or install TensorFlow separately
pip install tensorflow --upgrade
pip install -r requirements.txt
```

**Option 4: Manual Installation**
```bash
# Install packages individually
pip install fastapi uvicorn[standard] python-multipart
pip install tensorflow numpy pillow opencv-python
pip install pydantic loguru
```

### 🔧 Common Installation Issues

**TensorFlow Version Conflicts:**
- The original requirements specified TensorFlow 2.15.0, which may not be available
- Updated requirements now use flexible version ranges
- If you still have issues, try: `pip install tensorflow` (latest version)

**Windows-specific issues:**
```bash
# If you get Microsoft Visual C++ errors:
pip install --upgrade setuptools wheel
pip install tensorflow --no-cache-dir
```

**macOS Apple Silicon (M1/M2) issues:**
```bash
# Use conda instead of pip for better compatibility
conda install tensorflow
# Then install other requirements
pip install fastapi uvicorn[standard] python-multipart
```

### 1.4 Verify Model Files
Ensure these files exist in `api/models/`:
- `car_damage_classification_model.h5`
- `ft_model_locn.h5` 
- `ft_model.h5`

### 1.5 Start the API Server
```bash
# Using the startup script (recommended)
python start_api.py

# Or manually:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- 🌐 **Main API**: http://localhost:8000
- 📚 **Documentation**: http://localhost:8000/docs
- ❤️ **Health Check**: http://localhost:8000/health

## 📱 Step 2: Frontend Setup (Expo)

### 2.1 Install Additional Dependencies
```bash
# From the root project directory
npm install axios @types/axios
```

### 2.2 Update API Configuration
Edit `services/damageDetectionService.ts` and update the API_BASE_URL:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000'  // For development
  : 'https://your-production-api.com';  // For production
```

**Important**: If testing on a physical device, replace `localhost` with your computer's IP address:
```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.100:8000'  // Replace with your actual IP
  : 'https://your-production-api.com';
```

To find your IP address:
- **Windows**: `ipconfig` in Command Prompt
- **macOS/Linux**: `ifconfig` in Terminal

### 2.3 Add to App Navigation

You can use the new enhanced instant claim screen by updating your navigation:

```typescript
// In your navigation file or app structure
import EnhancedInstantClaimScreen from './app/instant-claim-enhanced';

// Replace your existing instant claim route with:
<Stack.Screen 
  name="instant-claim" 
  component={EnhancedInstantClaimScreen}
  options={{ title: "AI-Enhanced Instant Claim" }}
/>
```

## 🚀 Step 3: Testing the Integration

### 3.1 Start Both Services

**Terminal 1 (Backend):**
```bash
cd api
python start_api.py
```

**Terminal 2 (Frontend):**
```bash
npm start
```

### 3.2 Test the API

Visit http://localhost:8000/health to verify the API is running. You should see:
```json
{
  "status": "healthy",
  "models_loaded": 3,
  "available_models": ["classification", "location", "features"],
  "available_endpoints": [
    "/predict-damage", 
    "/predict-location", 
    "/extract-features",
    "/comprehensive-analysis"
  ]
}
```

### 3.3 Test the Mobile App

1. Open your Expo app
2. Navigate to the AI-Enhanced Instant Claim screen
3. Upload an image or take a photo
4. Watch the AI analysis happen in real-time
5. Review the auto-filled claim form

## 🔧 Step 4: Available API Endpoints

Your backend now provides these endpoints:

### Core Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check and status
- `POST /predict-damage` - Damage severity classification
- `POST /predict-location` - Damage location detection  
- `POST /extract-features` - Feature extraction
- `POST /comprehensive-analysis` - Full analysis using all models

### Example API Usage

```typescript
// Basic damage detection
const result = await damageDetectionService.detectDamage(imageUri, true);

// Location detection
const location = await damageDetectionService.detectLocation(imageUri, true);

// Comprehensive analysis (recommended)
const analysis = await damageDetectionService.comprehensiveAnalysis(imageUri, true);
```

## 🎯 Step 5: Component Integration

### Using the DamageDetector Component

```tsx
import DamageDetector from '../components/DamageDetector';
import { ComprehensiveAnalysisResult } from '../services/damageDetectionService';

function MyScreen() {
  const handleAnalysisResult = (result: ComprehensiveAnalysisResult) => {
    console.log('AI Analysis:', result);
    // Handle the results - auto-fill forms, save to state, etc.
  };

  const handleImageSelected = (imageUri: string) => {
    console.log('Image selected:', imageUri);
    // Handle image selection
  };

  return (
    <DamageDetector
      onResult={handleAnalysisResult}
      onImageSelected={handleImageSelected}
    />
  );
}
```

### Response Format

The comprehensive analysis returns:

```