import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useCustomAlert } from '../src/components/CustomAlert';
import DamageDetector from '../components/DamageDetector';
import { ComprehensiveAnalysisResult, damageDetectionService } from '../services/damageDetectionService';
import { ClaimsService, ClaimData } from '../src/services/claimsService';
import { supabase } from '../src/services/supabase/client';

// Note: Email functionality removed - claims are stored locally and can be viewed in profile

// Vector icon components (same as before)
const CameraIcon = ({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.8,
      height: size * 0.6,
      borderWidth: 2,
      borderColor: color,
      borderRadius: 4,
      position: 'relative',
    }}>
      <View style={{
        position: 'absolute',
        top: -4,
        left: size * 0.2,
        width: size * 0.4,
        height: 4,
        backgroundColor: color,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
      }} />
      <View style={{
        position: 'absolute',
        top: 6,
        left: 4,
        right: 4,
        bottom: 4,
        borderWidth: 1,
        borderColor: color,
        borderRadius: 8,
      }} />
    </View>
  </View>
);

const AIIcon = ({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.8,
      height: size * 0.8,
      borderRadius: size * 0.4,
      borderWidth: 2,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ color, fontSize: size * 0.3, fontWeight: 'bold' }}>AI</Text>
    </View>
  </View>
);

export default function EnhancedInstantClaimScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [policyNumber, setPolicyNumber] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [description, setDescription] = useState('');
  const [damageAnalysis, setDamageAnalysis] = useState<ComprehensiveAnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'form'>('upload');
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const { theme, isDark } = useTheme();
  const { showAlert, AlertComponent } = useCustomAlert();

  useEffect(() => {
    // Only check API health on component mount
    // Database connectivity is verified during actual claim submission 
    // to avoid unnecessary popups and provide better error handling
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      console.log('🔍 Checking ML API health...');
      const isHealthy = await damageDetectionService.healthCheck();
      setApiHealthy(isHealthy);
      
      if (isHealthy) {
        console.log('✅ ML API is healthy and ready');
        // Get API info for debugging
        const apiInfo = await damageDetectionService.getApiInfo();
        console.log('📊 API Info:', apiInfo);
      } else {
        console.log('⚠️ ML API health check failed');
        showAlert(
          'AI Service Notice',
          'The AI damage detection service is currently unavailable. You can still submit claims manually.\n\nTip: Make sure the ML API server is running on port 8001.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ API health check error:', error);
      setApiHealthy(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('🔧 Debug info: Trying multiple API endpoints automatically...');
      
      showAlert(
        'Connection Issue',
        `Unable to connect to AI service: ${errorMessage}\n\nThe app will try multiple connection methods automatically. You can still submit claims manually.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleImageSelected = (imageUri: string) => {
    setSelectedImages([...selectedImages, imageUri]);
    setCurrentStep('analyze');
  };

  const handleDamageAnalysisResult = (result: ComprehensiveAnalysisResult) => {
    setDamageAnalysis(result);
    
    // Auto-fill form based on AI analysis
    autoFillForm(result);
    
    // Show analysis results
    showAnalysisResults(result);
    
    setCurrentStep('form');
  };

  const autoFillForm = (result: ComprehensiveAnalysisResult) => {
    let autoDescription = 'AI-Detected Damage: ';
    let estimatedAmount = '5000'; // Default amount

    // Build description based on analysis
    if (result.data.damage_severity) {
      const severity = result.data.damage_severity.predicted_class;
      autoDescription += `${severity} damage`;
      
      // Estimate amount based on severity
      switch (severity.toLowerCase()) {
        case 'minor':
          estimatedAmount = '3000';
          break;
        case 'moderate':
          estimatedAmount = '8000';
          break;
        case 'severe':
          estimatedAmount = '15000';
          break;
      }
    }

    if (result.data.damage_location) {
      const location = result.data.damage_location.predicted_location;
      autoDescription += ` detected on ${location}`;
    }

    if (result.data.overall_confidence) {
      const confidence = result.data.overall_confidence.percentage;
      autoDescription += ` (${confidence} confidence)`;
    }

    setDescription(autoDescription);
    setClaimAmount(estimatedAmount);
    
    // Set current date as incident date
    const today = new Date();
    const dateStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
    setIncidentDate(dateStr);
  };

  const showAnalysisResults = (result: ComprehensiveAnalysisResult) => {
    let message = 'AI Analysis Complete!\n\n';
    
    if (result.data.damage_severity) {
      message += `Damage Severity: ${result.data.damage_severity.predicted_class.toUpperCase()}\n`;
      message += `Confidence: ${result.data.damage_severity.confidence_percentage}\n\n`;
    }
    
    if (result.data.damage_location) {
      message += `Damage Location: ${result.data.damage_location.predicted_location.toUpperCase()}\n`;
      message += `Confidence: ${result.data.damage_location.confidence_percentage}\n\n`;
    }
    
    if (result.data.overall_confidence) {
      message += `Overall Analysis Confidence: ${result.data.overall_confidence.percentage}`;
    }

    showAlert(
      'AI Damage Analysis',
      message,
      [
        {
          text: 'Continue to Form',
          onPress: () => setCurrentStep('form'),
        }
      ]
    );
  };

  const handleSubmitClaim = async () => {
    if (!policyNumber || !incidentDate || !claimAmount || !description) {
      showAlert('Error', 'Please fill in all required fields');
      return;
    }

    if (selectedImages.length === 0) {
      showAlert('Error', 'Please upload at least one photo of the damage');
      return;
    }

    try {
      console.log('🚀 Starting claim submission process...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User authentication error:', userError);
        showAlert('Error', 'User not authenticated. Please log in again.');
        return;
      }

      console.log('✅ User authenticated:', user.id);

      // Prepare claim data
      const claimData: ClaimData = {
        policyNumber,
        incidentDate,
        claimAmount,
        description,
        images: selectedImages,
        aiAnalysis: damageAnalysis,
        timestamp: new Date().toISOString(),
      };

      console.log('📋 Claim data prepared:', {
        policyNumber: claimData.policyNumber,
        incidentDate: claimData.incidentDate,
        claimAmount: claimData.claimAmount,
        hasAiAnalysis: !!claimData.aiAnalysis,
        imageCount: claimData.images.length
      });

      // Submit claim to database
      showAlert('Processing...', 'Submitting your claim. Please wait.');
      
      console.log('💾 Submitting claim to database...');
      const claimResult = await ClaimsService.submitClaim(claimData);
      
      if (!claimResult.success) {
        console.error('❌ Claim submission failed:', claimResult.error);
        showAlert('Submission Error', `Failed to submit claim:\n\n${claimResult.error}\n\nPlease check your internet connection and try again.`);
        return;
      }

      const claimId = claimResult.claimId!;
      console.log('✅ Claim submitted successfully with ID:', claimId);

      // Show success message
      showAlert(
        'Claim Submitted Successfully! 🎉',
        `Your AI-enhanced claim has been submitted and saved to our system!\n\n📋 Claim Details:\n• Claim ID: ${claimId}\n• Policy: ${policyNumber}\n• Amount: $${claimAmount}\n• AI Confidence: ${damageAnalysis?.data.overall_confidence?.percentage || 'N/A'}\n\n📱 SMS Update: Will be sent shortly\n\n⏱️ Processing Time: 5-7 business days\n\nYou can track your claim status in the app.`,
        [
          {
            text: 'View My Claims',
            onPress: () => {
              // Navigate to claims screen in profile section
              router.push('/my-claims');
            },
          },
          {
            text: 'Back to Home',
            onPress: () => router.back(),
          }
        ]
      );
    } catch (error) {
      console.error('❌ Unexpected claim submission error:', error);
      showAlert(
        'Submission Error', 
        `An unexpected error occurred:\n\n${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again or contact support if the problem persists.`
      );
    }
  };

  const renderStepIndicator = () => (
    <View style={dynamicStyles.stepIndicator}>
      <View style={[dynamicStyles.step, currentStep === 'upload' && dynamicStyles.activeStep]}>
        <Text style={[dynamicStyles.stepText, currentStep === 'upload' && dynamicStyles.activeStepText]}>1</Text>
      </View>
      <View style={dynamicStyles.stepLine} />
      <View style={[dynamicStyles.step, currentStep === 'analyze' && dynamicStyles.activeStep]}>
        <Text style={[dynamicStyles.stepText, currentStep === 'analyze' && dynamicStyles.activeStepText]}>2</Text>
      </View>
      <View style={dynamicStyles.stepLine} />
      <View style={[dynamicStyles.step, currentStep === 'form' && dynamicStyles.activeStep]}>
        <Text style={[dynamicStyles.stepText, currentStep === 'form' && dynamicStyles.activeStepText]}>3</Text>
      </View>
    </View>
  );

  const renderStepLabels = () => (
    <View style={dynamicStyles.stepLabels}>
      <View style={dynamicStyles.stepLabelContainer}>
        <Text style={[dynamicStyles.stepLabel, currentStep === 'upload' && dynamicStyles.activeStepLabel]}>
          Upload Image
        </Text>
      </View>
      <View style={dynamicStyles.stepLabelSpacer} />
      <View style={dynamicStyles.stepLabelContainer}>
        <Text style={[dynamicStyles.stepLabel, currentStep === 'analyze' && dynamicStyles.activeStepLabel]}>
          AI Analysis
        </Text>
      </View>
      <View style={dynamicStyles.stepLabelSpacer} />
      <View style={dynamicStyles.stepLabelContainer}>
        <Text style={[dynamicStyles.stepLabel, currentStep === 'form' && dynamicStyles.activeStepLabel]}>
          Claim Form
        </Text>
      </View>
    </View>
  );

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
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
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
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
    },
    apiStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      minWidth: 80,
      justifyContent: 'center',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '600',
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
      backgroundColor: theme.background,
    },
    stepIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    step: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: 2,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeStep: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    stepText: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    activeStepText: {
      color: '#ffffff',
    },
    stepLine: {
      width: 70,
      height: 2,
      backgroundColor: theme.border,
      marginHorizontal: 12,
    },
    stepLabels: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: theme.background,
    },
    stepLabelContainer: {
      width: 80,
      alignItems: 'center',
    },
    stepLabelSpacer: {
      width: 35 + 10, // stepLine width + margins
    },
    stepLabel: {
      color: theme.textSecondary,
      fontSize: 12,
      textAlign: 'center',
      fontWeight: '500',
    },
    activeStepLabel: {
      color: theme.primary,
      fontWeight: 'bold',
    },
    formSection: {
      backgroundColor: theme.surface,
      margin: 16,
      padding: 20,
      borderRadius: 16,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.text,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    submitButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      margin: 16,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    analysisCard: {
      backgroundColor: theme.successLight,
      borderWidth: 1,
      borderColor: theme.success,
      margin: 16,
      padding: 16,
      borderRadius: 12,
    },
    analysisTitle: {
      color: theme.success,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    analysisText: {
      color: theme.text,
      fontSize: 14,
      lineHeight: 20,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background}
      />
      
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity 
          style={dynamicStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={dynamicStyles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>AI-Enhanced Instant Claim</Text>
        <View style={dynamicStyles.apiStatus}>
          {apiHealthy === null ? (
            <View style={[dynamicStyles.statusDot, { backgroundColor: theme.textSecondary }]} />
          ) : apiHealthy ? (
            <View style={[dynamicStyles.statusDot, { backgroundColor: theme.success }]} />
          ) : (
            <View style={[dynamicStyles.statusDot, { backgroundColor: theme.error }]} />
          )}
          <Text style={dynamicStyles.statusText}>
            {apiHealthy === null ? 'Checking...' : apiHealthy ? 'AI Ready' : 'AI Offline'}
          </Text>
        </View>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}
      {renderStepLabels()}

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1 & 2: Image Upload and AI Analysis */}
        {(currentStep === 'upload' || currentStep === 'analyze') && (
          <DamageDetector
            onResult={handleDamageAnalysisResult}
            onImageSelected={handleImageSelected}
            style={{ flex: 1, margin: 0, backgroundColor: 'transparent' }}
          />
        )}

        {/* Step 3: Claim Form */}
        {currentStep === 'form' && (
          <>
            {/* AI Analysis Summary */}
            {damageAnalysis && (
              <View style={dynamicStyles.analysisCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <AIIcon size={20} color={theme.success} />
                  <Text style={[dynamicStyles.analysisTitle, { marginLeft: 8, marginBottom: 0 }]}>
                    AI Analysis Complete
                  </Text>
                </View>
                <Text style={dynamicStyles.analysisText}>
                  {damageAnalysis.data.damage_severity && 
                    `Severity: ${damageAnalysis.data.damage_severity.predicted_class} (${damageAnalysis.data.damage_severity.confidence_percentage})\n`
                  }
                  {damageAnalysis.data.damage_location && 
                    `Location: ${damageAnalysis.data.damage_location.predicted_location} (${damageAnalysis.data.damage_location.confidence_percentage})\n`
                  }
                  {damageAnalysis.data.overall_confidence && 
                    `Overall Confidence: ${damageAnalysis.data.overall_confidence.percentage}`
                  }
                </Text>
              </View>
            )}

            {/* Claim Form */}
            <View style={dynamicStyles.formSection}>
              <Text style={dynamicStyles.sectionTitle}>Claim Information</Text>
              
              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Policy Number *</Text>
                <TextInput
                  style={dynamicStyles.input}
                  value={policyNumber}
                  onChangeText={setPolicyNumber}
                  placeholder="Enter your policy number"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Incident Date *</Text>
                <TextInput
                  style={dynamicStyles.input}
                  value={incidentDate}
                  onChangeText={setIncidentDate}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Estimated Claim Amount *</Text>
                <TextInput
                  style={dynamicStyles.input}
                  value={claimAmount}
                  onChangeText={setClaimAmount}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={dynamicStyles.formGroup}>
                <Text style={dynamicStyles.label}>Description *</Text>
                <TextInput
                  style={[dynamicStyles.input, dynamicStyles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe the incident and damage..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <TouchableOpacity
              style={dynamicStyles.submitButton}
              onPress={handleSubmitClaim}
            >
              <Text style={dynamicStyles.submitButtonText}>Submit AI-Enhanced Claim</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <AlertComponent />
    </View>
  );
} 