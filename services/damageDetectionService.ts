import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

// Configuration
const API_URLS = __DEV__ 
  ? [
      'http://192.168.29.66:8001', // Your actual local network IP (MAIN)
      'http://localhost:8001',      // Try localhost as backup
      'http://127.0.0.1:8001',      // Try 127.0.0.1
      'http://10.0.2.2:8001',       // Android emulator host
    ]
  : ['https://your-production-api.com'];  // Production URL

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
    timestamp: number;
  };
}

export interface LocationDetectionResult {
  success: boolean;
  data: {
    predicted_location: string;
    confidence: number;
    confidence_percentage: string;
    all_probabilities?: Record<string, number>;
  };
  metadata: {
    model_version: string;
    timestamp: number;
  };
}

export interface FeatureExtractionResult {
  success: boolean;
  data: {
    feature_count: number;
    extracted: boolean;
    raw_features?: number[];
  };
  metadata: {
    model_version: string;
    timestamp: number;
  };
}

export interface ComprehensiveAnalysisResult {
  success: boolean;
  data: {
    damage_severity?: {
      predicted_class: string;
      confidence: number;
      confidence_percentage: string;
      all_probabilities?: Record<string, number>;
    };
    damage_location?: {
      predicted_location: string;
      confidence: number;
      confidence_percentage: string;
      all_probabilities?: Record<string, number>;
    };
    features?: {
      feature_count: number;
      extracted: boolean;
      raw_features?: number[];
    };
    overall_confidence?: {
      score: number;
      percentage: string;
    };
  };
  metadata: {
    model_version: string;
    timestamp: number;
    models_used: string[];
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    timestamp: number;
    max_size_mb?: number;
  };
}

// API Service Class
class DamageDetectionService {
  private api = axios.create({
    baseURL: API_URLS[0],
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  private workingBaseURL: string | null = null;

  constructor() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error: AxiosError) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private async findWorkingAPI(): Promise<string | null> {
    // If we already have a working URL, verify it's still working
    if (this.workingBaseURL) {
      try {
        const response = await fetch(`${this.workingBaseURL}/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (response.ok) {
          return this.workingBaseURL;
        }
      } catch {
        // Current URL is no longer working, reset and try others
        this.workingBaseURL = null;
      }
    }

    for (const url of API_URLS) {
      try {
        console.log(`🔍 Testing API at: ${url}`);
        
        // Create a simple timeout promise for React Native compatibility
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        
        const fetchPromise = fetch(`${url}/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (response.ok) {
          console.log(`✅ Found working API at: ${url}`);
          this.workingBaseURL = url;
          this.api.defaults.baseURL = url; // Update axios instance
          return url;
        }
      } catch (error) {
        console.log(`❌ API at ${url} failed:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
    
    console.log('❌ No working API found');
    return null;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const workingURL = await this.findWorkingAPI();
      if (!workingURL) {
        return false;
      }
      
      const response = await this.api.get('/health');
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      this.workingBaseURL = null; // Reset so we try again next time
      return false;
    }
  }

  async getApiInfo(): Promise<any> {
    try {
      const workingURL = await this.findWorkingAPI();
      if (!workingURL) {
        throw new Error('No working API found');
      }
      
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Failed to get API info:', error);
      throw new Error('Failed to connect to API');
    }
  }

  async detectDamage(
    imageUri: string,
    includeProbabilities: boolean = false
  ): Promise<DamageDetectionResult> {
    try {
      const workingURL = await this.findWorkingAPI();
      if (!workingURL) {
        throw new Error('API service is not available');
      }

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
      this.handleApiError(error);
      throw error; // Re-throw after handling
    }
  }

  async detectLocation(
    imageUri: string,
    includeProbabilities: boolean = false
  ): Promise<LocationDetectionResult> {
    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'damage_image.jpg',
      } as any);

      const response: AxiosResponse<LocationDetectionResult> = await this.api.post(
        `/predict-location?include_probabilities=${includeProbabilities}`,
        formData
      );

      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error;
    }
  }

  async extractFeatures(
    imageUri: string,
    includeRawFeatures: boolean = false
  ): Promise<FeatureExtractionResult> {
    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'damage_image.jpg',
      } as any);

      const response: AxiosResponse<FeatureExtractionResult> = await this.api.post(
        `/extract-features?include_raw_features=${includeRawFeatures}`,
        formData
      );

      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error;
    }
  }

  async comprehensiveAnalysis(
    imageUri: string,
    includeProbabilities: boolean = false,
    models: string = 'all'
  ): Promise<ComprehensiveAnalysisResult> {
    try {
      const workingURL = await this.findWorkingAPI();
      if (!workingURL) {
        throw new Error('API service is not available');
      }

      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'damage_image.jpg',
      } as any);

      const response: AxiosResponse<ComprehensiveAnalysisResult> = await this.api.post(
        `/comprehensive-analysis?include_probabilities=${includeProbabilities}&models=${models}`,
        formData
      );

      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error;
    }
  }

  private handleApiError(error: any): void {
    if (error.response?.status === 413) {
      throw new Error(`File too large. Maximum size: ${error.response.data.error?.max_size_mb || 10}MB`);
    } else if (error.response?.status === 400) {
      const errorMsg = error.response.data.error?.message || error.response.data.detail || 'Invalid file format';
      throw new Error(errorMsg);
    } else if (error.response?.status === 503) {
      throw new Error('AI model is not available. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error('Network error. Please check your connection.');
    } else {
      const errorMsg = error.response?.data?.error?.message || 'Failed to analyze image';
      throw new Error(errorMsg);
    }
  }
}

// Export singleton instance
export const damageDetectionService = new DamageDetectionService(); 