import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { damageDetectionService, ComprehensiveAnalysisResult } from '../services/damageDetectionService';

const { width } = Dimensions.get('window');

interface Props {
  onResult?: (result: ComprehensiveAnalysisResult) => void;
  onImageSelected?: (imageUri: string) => void;
  style?: any;
}

export default function DamageDetector({ onResult, onImageSelected, style }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ComprehensiveAnalysisResult | null>(null);
  const [analysisType, setAnalysisType] = useState<'basic' | 'comprehensive'>('comprehensive');
  const { theme, isDark } = useTheme();

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
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setResult(null);
        onImageSelected?.(imageUri);
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
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setResult(null);
        onImageSelected?.(imageUri);
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
      let detectionResult: ComprehensiveAnalysisResult;
      
      if (analysisType === 'comprehensive') {
        detectionResult = await damageDetectionService.comprehensiveAnalysis(
          selectedImage,
          true, // Include probabilities
          'all' // Use all models
        );
      } else {
        // Basic analysis - only damage classification
        const basicResult = await damageDetectionService.detectDamage(selectedImage, true);
        detectionResult = {
          success: true,
          data: {
            damage_severity: {
              predicted_class: basicResult.data.predicted_class,
              confidence: basicResult.data.confidence,
              confidence_percentage: basicResult.data.confidence_percentage,
              all_probabilities: basicResult.data.all_probabilities,
            }
          },
          metadata: {
            model_version: basicResult.metadata.model_version,
            timestamp: basicResult.metadata.timestamp,
            models_used: ['classification']
          }
        };
      }
      
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

  const getLocationColor = (location: string) => {
    const colors = ['#2196F3', '#9C27B0', '#FF5722', '#009688', '#795548', '#607D8B'];
    const index = location.length % colors.length;
    return colors[index];
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    section: {
      backgroundColor: theme.surface,
      margin: 16,
      padding: 16,
      borderRadius: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
    },
    analysisTypeContainer: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 4,
    },
    analysisTypeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 6,
      gap: 8,
    },
    analysisTypeButtonActive: {
      backgroundColor: theme.primary,
    },
    analysisTypeText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    analysisTypeTextActive: {
      color: 'white',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 12,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      gap: 8,
      flex: 1,
      justifyContent: 'center',
    },
    detectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.success,
      paddingVertical: 16,
      borderRadius: 8,
      marginTop: 16,
      gap: 8,
    },
    disabledButton: {
      backgroundColor: theme.textSecondary,
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
      backgroundColor: theme.card,
    },
    resultCard: {
      padding: 16,
      backgroundColor: theme.card,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.success,
      marginBottom: 12,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    resultTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    resultClass: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    confidenceBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    confidenceText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    probabilitiesSection: {
      marginTop: 12,
    },
    probabilitiesTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    probabilityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      gap: 8,
    },
    probabilityLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      textTransform: 'capitalize',
      width: 80,
    },
    probabilityBar: {
      flex: 1,
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    probabilityFill: {
      height: '100%',
      borderRadius: 4,
    },
    probabilityValue: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
      width: 40,
      textAlign: 'right',
    },
    overallConfidenceCard: {
      backgroundColor: theme.successLight,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    overallConfidenceTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.success,
      marginBottom: 12,
    },
    overallConfidenceContainer: {
      alignItems: 'center',
    },
    overallConfidenceValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.success,
    },
    overallConfidenceLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
  });

  return (
    <ScrollView style={[dynamicStyles.container, style]} showsVerticalScrollIndicator={false}>
      {/* Analysis Type Selector */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Analysis Type</Text>
        <View style={dynamicStyles.analysisTypeContainer}>
          <TouchableOpacity
            style={[
              dynamicStyles.analysisTypeButton,
              analysisType === 'basic' && dynamicStyles.analysisTypeButtonActive
            ]}
            onPress={() => setAnalysisType('basic')}
          >
            <MaterialIcons 
              name="speed" 
              size={20} 
              color={analysisType === 'basic' ? 'white' : theme.textSecondary} 
            />
            <Text style={[
              dynamicStyles.analysisTypeText,
              analysisType === 'basic' && dynamicStyles.analysisTypeTextActive
            ]}>
              Basic
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              dynamicStyles.analysisTypeButton,
              analysisType === 'comprehensive' && dynamicStyles.analysisTypeButtonActive
            ]}
            onPress={() => setAnalysisType('comprehensive')}
          >
            <MaterialIcons 
              name="analytics" 
              size={20} 
              color={analysisType === 'comprehensive' ? 'white' : theme.textSecondary} 
            />
            <Text style={[
              dynamicStyles.analysisTypeText,
              analysisType === 'comprehensive' && dynamicStyles.analysisTypeTextActive
            ]}>
              Comprehensive
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Selection Section */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Select Damage Image</Text>
        
        <View style={dynamicStyles.buttonRow}>
          <TouchableOpacity style={dynamicStyles.button} onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={dynamicStyles.buttonText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={dynamicStyles.button} onPress={pickImageFromLibrary}>
            <MaterialIcons name="photo-library" size={24} color="white" />
            <Text style={dynamicStyles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Preview */}
      {selectedImage && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Selected Image</Text>
          <Image source={{ uri: selectedImage }} style={dynamicStyles.previewImage} />
          
          <TouchableOpacity 
            style={[dynamicStyles.detectButton, isLoading && dynamicStyles.disabledButton]} 
            onPress={detectDamage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <MaterialIcons name="auto-fix-high" size={24} color="white" />
            )}
            <Text style={dynamicStyles.buttonText}>
              {isLoading ? 'Analyzing...' : `${analysisType === 'comprehensive' ? 'Analyze' : 'Detect'} Damage`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results Section */}
      {result && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Analysis Results</Text>
          
          {/* Damage Severity */}
          {result.data.damage_severity && (
            <View style={dynamicStyles.resultCard}>
              <View style={dynamicStyles.resultHeader}>
                <View style={dynamicStyles.resultTitleContainer}>
                  <MaterialIcons name="report-problem" size={20} color={theme.textSecondary} />
                  <Text style={dynamicStyles.resultTitle}>Damage Severity</Text>
                </View>
                <View style={[
                  dynamicStyles.confidenceBadge,
                  { backgroundColor: getSeverityColor(result.data.damage_severity.predicted_class) }
                ]}>
                  <Text style={dynamicStyles.confidenceText}>
                    {result.data.damage_severity.confidence_percentage}
                  </Text>
                </View>
              </View>
              
              <Text style={dynamicStyles.resultClass}>
                {result.data.damage_severity.predicted_class.toUpperCase()}
              </Text>
              
              {result.data.damage_severity.all_probabilities && (
                <View style={dynamicStyles.probabilitiesSection}>
                  <Text style={dynamicStyles.probabilitiesTitle}>All Probabilities:</Text>
                  {Object.entries(result.data.damage_severity.all_probabilities).map(([className, probability]) => (
                    <View key={className} style={dynamicStyles.probabilityRow}>
                      <Text style={dynamicStyles.probabilityLabel}>{className}</Text>
                      <View style={dynamicStyles.probabilityBar}>
                        <View 
                          style={[
                            dynamicStyles.probabilityFill,
                            { 
                              width: `${probability * 100}%`,
                              backgroundColor: getSeverityColor(className)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={dynamicStyles.probabilityValue}>
                        {(probability * 100).toFixed(1)}%
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          
          {/* Damage Location */}
          {result.data.damage_location && (
            <View style={dynamicStyles.resultCard}>
              <View style={dynamicStyles.resultHeader}>
                <View style={dynamicStyles.resultTitleContainer}>
                  <MaterialIcons name="location-on" size={20} color={theme.textSecondary} />
                  <Text style={dynamicStyles.resultTitle}>Damage Location</Text>
                </View>
                <View style={[
                  dynamicStyles.confidenceBadge,
                  { backgroundColor: getLocationColor(result.data.damage_location.predicted_location) }
                ]}>
                  <Text style={dynamicStyles.confidenceText}>
                    {result.data.damage_location.confidence_percentage}
                  </Text>
                </View>
              </View>
              
              <Text style={dynamicStyles.resultClass}>
                {result.data.damage_location.predicted_location.toUpperCase()}
              </Text>
              
              {result.data.damage_location.all_probabilities && (
                <View style={dynamicStyles.probabilitiesSection}>
                  <Text style={dynamicStyles.probabilitiesTitle}>Location Probabilities:</Text>
                  {Object.entries(result.data.damage_location.all_probabilities).map(([location, probability]) => (
                    <View key={location} style={dynamicStyles.probabilityRow}>
                      <Text style={dynamicStyles.probabilityLabel}>{location}</Text>
                      <View style={dynamicStyles.probabilityBar}>
                        <View 
                          style={[
                            dynamicStyles.probabilityFill,
                            { 
                              width: `${probability * 100}%`,
                              backgroundColor: getLocationColor(location)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={dynamicStyles.probabilityValue}>
                        {(probability * 100).toFixed(1)}%
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          
          {/* Feature Extraction */}
          {result.data.features && (
            <View style={dynamicStyles.resultCard}>
              <View style={dynamicStyles.resultHeader}>
                <View style={dynamicStyles.resultTitleContainer}>
                  <MaterialIcons name="auto-awesome" size={20} color={theme.textSecondary} />
                  <Text style={dynamicStyles.resultTitle}>Feature Analysis</Text>
                </View>
                <View style={[dynamicStyles.confidenceBadge, { backgroundColor: theme.primary }]}>
                  <Text style={dynamicStyles.confidenceText}>
                    {result.data.features.feature_count} features
                  </Text>
                </View>
              </View>
              
              <Text style={dynamicStyles.resultClass}>
                {result.data.features.extracted ? 'FEATURES EXTRACTED' : 'EXTRACTION FAILED'}
              </Text>
            </View>
          )}
          
          {/* Overall Confidence */}
          {result.data.overall_confidence && (
            <View style={dynamicStyles.overallConfidenceCard}>
              <Text style={dynamicStyles.overallConfidenceTitle}>Overall Analysis Confidence</Text>
              <View style={dynamicStyles.overallConfidenceContainer}>
                <Text style={dynamicStyles.overallConfidenceValue}>
                  {result.data.overall_confidence.percentage}
                </Text>
                <Text style={dynamicStyles.overallConfidenceLabel}>Accuracy</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
} 