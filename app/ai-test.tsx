import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useCustomAlert } from '../src/components/CustomAlert';
import { damageDetectionService } from '../services/damageDetectionService';

export default function AITestScreen() {
  const [apiInfo, setApiInfo] = useState<any>(null);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [testing, setTesting] = useState(false);
  const { theme, isDark } = useTheme();
  const { showAlert, AlertComponent } = useCustomAlert();

  useEffect(() => {
    performHealthCheck();
  }, []);

  const performHealthCheck = async () => {
    setTesting(true);
    try {
      console.log('🔍 Testing ML API connection...');
      
      // Test all possible API endpoints
      const testUrls = [
        'http://192.168.29.66:8001', // Your actual local network IP (MAIN)
        'http://localhost:8001',
        'http://127.0.0.1:8001',
        'http://10.0.2.2:8001',
      ];
      
      let workingUrl = null;
      let lastError = null;
      
      for (const url of testUrls) {
        try {
          console.log(`🔍 Testing ${url}...`);
          
          // Create a simple timeout promise for React Native compatibility
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
          );
          
          const fetchPromise = fetch(`${url}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });
          
          const testResponse = await Promise.race([fetchPromise, timeoutPromise]) as Response;
          
          if (testResponse.ok) {
            const data = await testResponse.json();
            console.log(`✅ Found working API at ${url}:`, data);
            workingUrl = url;
            setApiInfo(data);
            break;
          }
        } catch (error) {
          console.log(`❌ ${url} failed:`, error instanceof Error ? error.message : 'Unknown error');
          lastError = error;
        }
      }
      
      if (workingUrl) {
        // Now test the service
        const healthy = await damageDetectionService.healthCheck();
        setIsHealthy(healthy);
        
        if (healthy) {
          showAlert(
            'AI Service Status',
            `✅ ML API is working!\n\nWorking URL: ${workingUrl}\nModels Loaded: ${apiInfo?.models_loaded || 'Unknown'}\nTensorFlow: ${apiInfo?.tensorflow_available ? 'Available' : 'Not Available'}\nStatus: ${apiInfo?.status}`,
            [{ text: 'Great!' }]
          );
        } else {
          showAlert(
            'Partial Connection',
            `⚠️ Connected to ${workingUrl} but service is not healthy.\n\nThis might be a model loading issue.`,
            [{ text: 'OK' }]
          );
        }
      } else {
        setIsHealthy(false);
        const errorMsg = lastError instanceof Error ? lastError.message : 'Connection failed';
        showAlert(
          'AI Service Issue',
          `❌ Could not connect to ML API on any endpoint.\n\nLast error: ${errorMsg}\n\nPlease ensure:\n1. API server is running (python start_api.py)\n2. Port 8001 is not blocked\n3. Check console for detailed logs`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('❌ API Test Error:', error);
      setIsHealthy(false);
      showAlert(
        'Connection Error',
        `❌ Failed to test ML API:\n\n${error.message}\n\nCheck the console for detailed error information.`,
        [{ text: 'OK' }]
      );
    } finally {
      setTesting(false);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: theme.surface,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 3,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      color: theme.text,
      fontSize: 24,
      fontWeight: 'bold',
    },
    headerTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      color: theme.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    statusLabel: {
      color: theme.textSecondary,
      fontSize: 14,
      flex: 1,
    },
    statusValue: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '500',
    },
    testButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    testButtonDisabled: {
      backgroundColor: theme.textSecondary,
    },
    testButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    infoText: {
      color: theme.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 12,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.surface}
      />
      
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity 
          style={dynamicStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={dynamicStyles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>AI Service Test</Text>
        <View style={dynamicStyles.placeholder} />
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* API Status Card */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.title}>ML API Status</Text>
          
          <View style={dynamicStyles.statusRow}>
            <View style={[
              dynamicStyles.statusDot, 
              { backgroundColor: isHealthy === null ? theme.textSecondary : 
                               isHealthy ? theme.success : theme.error }
            ]} />
            <Text style={dynamicStyles.statusLabel}>Connection Status</Text>
            <Text style={dynamicStyles.statusValue}>
              {isHealthy === null ? 'Testing...' : isHealthy ? 'Connected' : 'Disconnected'}
            </Text>
          </View>

          {apiInfo && (
            <>
              <View style={dynamicStyles.statusRow}>
                <View style={[dynamicStyles.statusDot, { backgroundColor: theme.success }]} />
                <Text style={dynamicStyles.statusLabel}>Models Loaded</Text>
                <Text style={dynamicStyles.statusValue}>{apiInfo.models_loaded || 0}</Text>
              </View>

              <View style={dynamicStyles.statusRow}>
                <View style={[
                  dynamicStyles.statusDot, 
                  { backgroundColor: apiInfo.tensorflow_available ? theme.success : theme.error }
                ]} />
                <Text style={dynamicStyles.statusLabel}>TensorFlow</Text>
                <Text style={dynamicStyles.statusValue}>
                  {apiInfo.tensorflow_available ? 'Available' : 'Not Available'}
                </Text>
              </View>

              <View style={dynamicStyles.statusRow}>
                <View style={[dynamicStyles.statusDot, { backgroundColor: theme.primary }]} />
                <Text style={dynamicStyles.statusLabel}>API Version</Text>
                <Text style={dynamicStyles.statusValue}>{apiInfo.version || 'Unknown'}</Text>
              </View>

              {apiInfo.models && (
                <View style={dynamicStyles.statusRow}>
                  <View style={[dynamicStyles.statusDot, { backgroundColor: theme.primary }]} />
                  <Text style={dynamicStyles.statusLabel}>Available Models</Text>
                  <Text style={dynamicStyles.statusValue}>
                    {Object.keys(apiInfo.models).join(', ')}
                  </Text>
                </View>
              )}
            </>
          )}

          <TouchableOpacity
            style={[dynamicStyles.testButton, testing && dynamicStyles.testButtonDisabled]}
            onPress={performHealthCheck}
            disabled={testing}
          >
            <Text style={dynamicStyles.testButtonText}>
              {testing ? 'Testing Connection...' : 'Test API Connection'}
            </Text>
          </TouchableOpacity>

          <Text style={dynamicStyles.infoText}>
            This test verifies that the ML damage detection API is running and all models are loaded correctly. 
            The backend should be running on http://localhost:8001
          </Text>
        </View>

        {/* Usage Instructions */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.title}>How to Use AI Features</Text>
          <Text style={dynamicStyles.infoText}>
            1. Go to "Instant Claim" from the home screen{'\n'}
            2. Upload or take a photo of vehicle damage{'\n'}
            3. The AI will automatically analyze the image{'\n'}
            4. Review the AI-detected damage severity and location{'\n'}
            5. Complete the claim form with AI-suggested details{'\n'}
            6. Submit your AI-enhanced claim
          </Text>
        </View>
      </ScrollView>

      <AlertComponent />
    </View>
  );
} 