# 🚗 Car Damage Detection ML Model Integration Guide

> A comprehensive guide for integrating car damage detection machine learning models into your Expo mobile application using a FastAPI backend.

## 📋 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Backend Setup (FastAPI)](#-backend-setup-fastapi)
- [Frontend Integration (Expo)](#-frontend-integration-expo)
- [Deployment Options](#-deployment-options)
- [Development Workflow](#-development-workflow)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

This guide demonstrates how to integrate pre-trained car damage detection ML models into an Expo mobile application. The architecture follows a client-server pattern where:

- **Backend**: Python FastAPI server hosts ML models and provides REST endpoints
- **Frontend**: Expo React Native app captures/uploads images and displays results
- **Models**: TensorFlow/Keras models for damage classification and localization

### Key Features

- ✅ Real-time damage detection and classification
- ✅ Support for multiple model types (classification, localization)
- ✅ Cross-platform mobile compatibility (iOS/Android)
- ✅ Scalable deployment options
- ✅ Developer-friendly API design

---

## 🔧 Prerequisites

### Backend Requirements
- Python 3.8+
- pip or conda package manager
- Virtual environment (recommended)

### Frontend Requirements
- Node.js 16+
- Expo CLI (`npm install -g @expo/cli`)
- React Native development environment

### ML Models
Ensure you have the following trained models in `.h5` format:
- `car_damage_classification_model.h5` - Damage severity classification
- `ft_model_locn.h5` - Damage location detection
- `ft_model.h5` - General feature extraction

---

## 📂 Project Structure

```
project-root/
├── 📁 api/                           # Python FastAPI backend
│   ├── 📁 app/
│   │   ├── 📄 main.py               # FastAPI application entry point
│   │   ├── 📄 model_loader.py       # ML model loading utilities
│   │   ├── 📄 utils.py              # Helper functions
│   │   └── 📄 config.py             # Configuration settings
│   ├── 📁 models/                   # ML model files
│   │   ├── 📄 car_damage_classification_model.h5
│   │   ├── 📄 ft_model.h5
│   │   └── 📄 ft_model_locn.h5
│   ├── 📁 tests/                    # API tests
│   ├── 📄 requirements.txt          # Python dependencies
│   ├── 📄 Dockerfile               # Docker configuration
│   └── 📄 README.md                # API documentation
├── 📁 mobile-app/                   # Expo frontend application
│   ├── 📁 app/                      # App screens and navigation
│   ├── 📁 components/               # Reusable UI components
│   ├── 📁 services/                 # API service layer
│   ├── 📁 utils/                    # Utility functions
│   ├── 📁 assets/                   # Images, fonts, etc.
│   ├── 📄 package.json
│   ├── 📄 app.json
│   └── 📄 tsconfig.json
└── 📄 README.md                     # Project documentation
```

---

## 🐍 Backend Setup (FastAPI)

### Step 1: Environment Setup

```bash
# Navigate to API directory
cd api

# Create and activate virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
# Install required packages
pip install fastapi uvicorn python-multipart tensorflow numpy pillow opencv-python

# Generate requirements file
pip freeze > requirements.txt
```

### Step 3: Create Configuration

**`api/app/config.py`**:

```python
from pydantic import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "Car Damage Detection API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Model paths
    model_dir: str = "../models"
    classification_model: str = "car_damage_classification_model.h5"
    location_model: str = "ft_model_locn.h5"
    feature_model: str = "ft_model.h5"
    
    # API settings
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = ["jpg", "jpeg", "png", "webp"]
    
    # CORS settings
    allowed_origins: List[str] = ["*"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Step 4: Model Loading Utilities

**`api/app/model_loader.py`**:

```python
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import logging
from pathlib import Path
from .config import settings

logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self):
        self.models = {}
        self.class_names = {
            'damage_severity': ['minor', 'moderate', 'severe'],
            'damage_type': ['scratch', 'dent', 'crack', 'rust']
        }
        self.load_models()
    
    def load_models(self):
        """Load all ML models into memory"""
        try:
            model_dir = Path(settings.model_dir)
            
            # Load classification model
            classification_path = model_dir / settings.classification_model
            if classification_path.exists():
                self.models['classification'] = tf.keras.models.load_model(
                    str(classification_path)
                )
                logger.info("Classification model loaded successfully")
            else:
                logger.warning(f"Classification model not found: {classification_path}")
            
            # Add more models as needed...
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            raise
    
    def preprocess_image(self, image_bytes: bytes, target_size: tuple = (224, 224)):
        """Preprocess image for model prediction"""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize(target_size)
            
            # Convert to numpy array and normalize
            image_array = np.array(image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)
            
            return image_array
        
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise
    
    def predict_damage(self, image_bytes: bytes):
        """Predict damage classification"""
        if 'classification' not in self.models:
            raise ValueError("Classification model not loaded")
        
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_bytes)
            
            # Make prediction
            prediction = self.models['classification'].predict(processed_image)[0]
            
            # Get class and confidence
            predicted_class_idx = np.argmax(prediction)
            confidence = float(np.max(prediction))
            predicted_class = self.class_names['damage_severity'][predicted_class_idx]
            
            return {
                'class': predicted_class,
                'confidence': confidence,
                'all_probabilities': {
                    class_name: float(prob) 
                    for class_name, prob in zip(
                        self.class_names['damage_severity'], 
                        prediction
                    )
                }
            }
        
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise

# Global model manager instance
model_manager = ModelManager()
```

### Step 5: Main API Application

**`api/app/main.py`**:

```python
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import Optional
import time

from .config import settings
from .model_loader import model_manager
from .utils import validate_image_file, format_response

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered car damage detection and classification API",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "status": "healthy",
        "timestamp": time.time()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "models_loaded": len(model_manager.models),
        "available_endpoints": ["/predict-damage", "/batch-predict"],
        "timestamp": time.time()
    }

@app.post("/predict-damage")
async def predict_damage(
    file: UploadFile = File(...),
    include_probabilities: Optional[bool] = False
):
    """
    Predict car damage from uploaded image
    
    Args:
        file: Image file (JPG, PNG, WEBP)
        include_probabilities: Include all class probabilities in response
    
    Returns:
        JSON response with damage classification and confidence
    """
    try:
        # Validate file
        await validate_image_file(file)
        
        # Read file content
        file_content = await file.read()
        
        # Make prediction
        prediction_result = model_manager.predict_damage(file_content)
        
        # Format response based on user preference
        response = format_response(prediction_result, include_probabilities)
        
        logger.info(f"Prediction completed: {prediction_result['class']} "
                   f"({prediction_result['confidence']:.2%})")
        
        return JSONResponse(content=response)
    
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.exception_handler(413)
async def file_too_large_handler(request, exc):
    """Handle file size too large errors"""
    return JSONResponse(
        status_code=413,
        content={"error": "File too large", "max_size_mb": settings.max_file_size // (1024 * 1024)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
```

### Step 6: Utility Functions

**`api/app/utils.py`**:

```python
from fastapi import UploadFile, HTTPException
from typing import Dict, Any
from .config import settings
import logging

logger = logging.getLogger(__name__)

async def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded image file"""
    
    # Check file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed: {', '.join(settings.allowed_extensions)}"
        )
    
    # Check file size
    file_content = await file.read()
    if len(file_content) > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size: {settings.max_file_size // (1024 * 1024)}MB"
        )
    
    # Reset file pointer
    await file.seek(0)

def format_response(prediction_result: Dict[str, Any], include_probabilities: bool = False) -> Dict[str, Any]:
    """Format prediction response"""
    response = {
        "success": True,
        "data": {
            "predicted_class": prediction_result["class"],
            "confidence": round(prediction_result["confidence"], 4),
            "confidence_percentage": f"{prediction_result['confidence']:.1%}"
        },
        "metadata": {
            "model_version": "1.0.0",
            "timestamp": None
        }
    }
    
    if include_probabilities:
        response["data"]["all_probabilities"] = prediction_result.get("all_probabilities", {})
    
    return response
```

### Step 7: Run the Server

```bash
# Development mode
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 📱 Frontend Integration (Expo)

### Step 1: Install Dependencies

```bash
# Navigate to mobile app directory
cd mobile-app

# Install required packages
npm install axios expo-image-picker @expo/vector-icons
npm install --save-dev @types/react @types/react-native
```

### Step 2: Create API Service

**`mobile-app/services/damageDetectionService.ts`**:

```typescript
import axios, { AxiosResponse } from 'axios';

// Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000'  // Development
  : 'https://your-production-api.com';  // Production

const API_TIMEOUT = 30000; // 30 seconds

// Types
export interface DamageDetectionResult {
  success: boolean;
  data: {
    predicted_class: string;
    confidence: number;
    confidence_percentage: string;
    all_probabilities?: Record<string, number>;
  };
  metadata: {
    model_version: string;
    timestamp: string;
  };
}

export interface ApiError {
  error: string;
  detail?: string;
  max_size_mb?: number;
}

// API Service Class
class DamageDetectionService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  constructor() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async detectDamage(
    imageUri: string,
    includeProbabilities: boolean = false
  ): Promise<DamageDetectionResult> {
    try {
      const formData = new FormData();
      
      // Append image file
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'damage_image.jpg',
      } as any);

      const response: AxiosResponse<DamageDetectionResult> = await this.api.post(
        `/predict-damage?include_probabilities=${includeProbabilities}`,
        formData
      );

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 413) {
        throw new Error(`File too large. Maximum size: ${error.response.data.max_size_mb}MB`);
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid file format');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      } else {
        throw new Error(error.response?.data?.detail || 'Failed to detect damage');
      }
    }
  }
}

// Export singleton instance
export const damageDetectionService = new DamageDetectionService();
```

### Step 3: Create UI Components

**`mobile-app/components/DamageDetector.tsx`**:

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { damageDetectionService, DamageDetectionResult } from '../services/damageDetectionService';

interface Props {
  onResult?: (result: DamageDetectionResult) => void;
}

export default function DamageDetector({ onResult }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DamageDetectionResult | null>(null);

  const pickImageFromLibrary = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant access to photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setResult(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera access');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setResult(null);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const detectDamage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      const detectionResult = await damageDetectionService.detectDamage(
        selectedImage,
        true // Include probabilities
      );
      
      setResult(detectionResult);
      onResult?.(detectionResult);
    } catch (error: any) {
      console.error('Detection error:', error);
      Alert.alert('Detection Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Selection Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Image</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
            <MaterialIcons name="photo-library" size={24} color="white" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Preview */}
      {selectedImage && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Image</Text>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          
          <TouchableOpacity 
            style={[styles.detectButton, isLoading && styles.disabledButton]} 
            onPress={detectDamage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <MaterialIcons name="search" size={24} color="white" />
            )}
            <Text style={styles.buttonText}>
              {isLoading ? 'Analyzing...' : 'Detect Damage'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results Section */}
      {result && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detection Results</Text>
          
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultClass}>
                {result.data.predicted_class.toUpperCase()}
              </Text>
              <View style={[
                styles.confidenceBadge,
                { backgroundColor: getSeverityColor(result.data.predicted_class) }
              ]}>
                <Text style={styles.confidenceText}>
                  {result.data.confidence_percentage}
                </Text>
              </View>
            </View>
            
            {result.data.all_probabilities && (
              <View style={styles.probabilitiesSection}>
                <Text style={styles.probabilitiesTitle}>All Probabilities:</Text>
                {Object.entries(result.data.all_probabilities).map(([className, probability]) => (
                  <View key={className} style={styles.probabilityRow}>
                    <Text style={styles.probabilityLabel}>{className}</Text>
                    <Text style={styles.probabilityValue}>
                      {(probability * 100).toFixed(1)}%
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 6,
    marginTop: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  resultCard: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultClass: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  confidenceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  confidenceText: {
    color: 'white',
    fontWeight: 'bold',
  },
  probabilitiesSection: {
    marginTop: 16,
  },
  probabilitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  probabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  probabilityLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  probabilityValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

### Step 4: Integration in App Navigation

**`mobile-app/app/(tabs)/damage-detection.tsx`**:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import DamageDetector from '../../components/DamageDetector';
import { DamageDetectionResult } from '../../services/damageDetectionService';

export default function DamageDetectionScreen() {
  const handleDetectionResult = (result: DamageDetectionResult) => {
    // Handle the result (e.g., save to context, navigate to results screen, etc.)
    console.log('Detection result:', result);
  };

  return (
    <View style={styles.container}>
      <DamageDetector onResult={handleDetectionResult} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

---

## 🚀 Deployment Options

### Option 1: Render (Recommended for beginners)

1. **Create `Dockerfile`**:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Deploy to Render**:
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option 2: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Google Cloud Run

```bash
# Build and push container
gcloud builds submit --tag gcr.io/PROJECT-ID/damage-detection-api

# Deploy to Cloud Run
gcloud run deploy --image gcr.io/PROJECT-ID/damage-detection-api --platform managed
```

---

## 🔄 Development Workflow

### Concurrent Development Setup

**`package.json`** (root level):

```json
{
  "name": "car-damage-detection-fullstack",
  "scripts": {
    "dev": "concurrently \"npm run api\" \"npm run mobile\"",
    "api": "cd api && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000",
    "mobile": "cd mobile-app && expo start",
    "build:api": "cd api && docker build -t damage-detection-api .",
    "test:api": "cd api && pytest",
    "test:mobile": "cd mobile-app && npm test"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

### Running the Full Stack

```bash
# Install concurrently globally
npm install -g concurrently

# Run both frontend and backend
npm run dev
```

---

## 🐛 Troubleshooting

### Common Backend Issues

1. **Model Loading Errors**
   ```bash
   # Check model file permissions
   ls -la api/models/
   
   # Verify TensorFlow installation
   python -c "import tensorflow as tf; print(tf.__version__)"
   ```

2. **CORS Issues**
   - Ensure CORS middleware is properly configured
   - Check if frontend URL is in allowed origins

3. **Memory Issues**
   - Reduce model batch size
   - Use model quantization for smaller memory footprint

### Common Frontend Issues

1. **Network Errors**
   ```typescript
   // Check API connectivity
   const isHealthy = await damageDetectionService.healthCheck();
   console.log('API Health:', isHealthy);
   ```

2. **Image Picker Permissions**
   - Ensure proper permissions in `app.json`:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "expo-image-picker",
           {
             "photosPermission": "Allow access to select photos for damage detection"
           }
         ]
       ]
     }
   }
   ```

3. **File Size Issues**
   - Compress images before upload
   - Implement client-side image optimization

### Performance Optimization

1. **Backend Optimization**
   - Use model caching
   - Implement request queuing for high traffic
   - Add response compression

2. **Frontend Optimization**
   - Implement image compression
   - Add loading states and error boundaries
   - Cache API responses where appropriate

---

## ✅ Final Checklist

- [ ] Python environment setup and dependencies installed
- [ ] ML models placed in correct directory structure
- [ ] FastAPI backend running and accessible
- [ ] Expo app configured with necessary permissions
- [ ] API service layer implemented and tested
- [ ] UI components created and integrated
- [ ] Error handling implemented for both frontend and backend
- [ ] Deployment configuration completed
- [ ] Testing completed for core functionality

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices for frontend
- Use type hints and docstrings in Python backend
- Write tests for new functionality
- Update documentation for API changes
- Follow conventional commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section above**
2. **Review API documentation** at `/docs` endpoint (development mode)
3. **Create an issue** in the repository with detailed error information
4. **Join our community** for real-time support

---

**Happy coding! 🚗✨**
