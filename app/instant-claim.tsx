import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../contexts/ThemeContext';
import { useCustomAlert } from '../src/components/CustomAlert';

// Vector icon components
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

const UploadIcon = ({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.7,
      height: size * 0.7,
      borderWidth: 2,
      borderColor: color,
      borderRadius: 4,
      position: 'relative',
    }}>
      <View style={{
        position: 'absolute',
        top: 2,
        left: '50%',
        marginLeft: -1,
        width: 2,
        height: size * 0.3,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        top: 2,
        left: '50%',
        marginLeft: -3,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 4,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }} />
    </View>
  </View>
);

const DocumentIcon = ({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.7,
      height: size * 0.9,
      borderWidth: 2,
      borderColor: color,
      borderRadius: 2,
      position: 'relative',
    }}>
      <View style={{
        marginTop: 4,
        marginHorizontal: 3,
        height: 1.5,
        backgroundColor: color,
        marginBottom: 2,
      }} />
      <View style={{
        marginHorizontal: 3,
        height: 1.5,
        backgroundColor: color,
        marginBottom: 2,
      }} />
      <View style={{
        marginHorizontal: 3,
        height: 1.5,
        backgroundColor: color,
      }} />
    </View>
  </View>
);

export default function InstantClaimScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [policyNumber, setPolicyNumber] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [description, setDescription] = useState('');
  const { theme, isDark } = useTheme();
  const { showAlert, AlertComponent } = useCustomAlert();

  const handleUploadPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      showAlert('Permission Denied', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      showAlert('Permission Denied', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  const handleScanDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // Simulate OCR processing
        showAlert(
          'Document Scanned',
          'OCR processing started. Claim details will be auto-filled shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Simulate auto-filling form
                setPolicyNumber('MPO4CY9999');
                setIncidentDate('12/15/2024');
                setClaimAmount('15000');
                setDescription('Vehicle damage from accident - Front bumper and headlight damage');
              },
            },
          ]
        );
      }
    } catch (error) {
      showAlert('Error', 'Failed to scan document');
    }
  };

  const handleSubmitClaim = () => {
    if (!policyNumber || !incidentDate || !claimAmount || !description) {
      showAlert('Error', 'Please fill in all required fields');
      return;
    }

    if (selectedImages.length === 0) {
      showAlert('Error', 'Please upload at least one photo of the damage');
      return;
    }

    showAlert(
      'Claim Submitted!',
      'Your claim has been submitted successfully. You will receive updates via email and SMS.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        }
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surface,
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
      shadowOffset: {
        width: 0,
        height: 2,
      },
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
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    photoSection: {
      marginTop: 20,
      marginBottom: 24,
    },
    uploadArea: {
      borderWidth: 2,
      borderColor: theme.border,
      borderStyle: 'dashed',
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      backgroundColor: theme.card,
    },
    uploadIcon: {
      width: 64,
      height: 64,
      backgroundColor: theme.background,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    uploadText: {
      color: theme.textSecondary,
      fontSize: 16,
      marginBottom: 24,
      textAlign: 'center',
    },
    uploadButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    uploadButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    uploadButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    takePhotoButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    takePhotoButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    },
    imagePreview: {
      marginTop: 12,
      padding: 12,
      backgroundColor: theme.successLight,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.success,
    },
    imagePreviewText: {
      color: theme.success,
      fontSize: 14,
      textAlign: 'center',
      fontWeight: '500',
    },
    ocrSection: {
      marginBottom: 24,
    },
    ocrButton: {
      backgroundColor: theme.card,
      borderWidth: 2,
      borderColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    ocrButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
    },
    aiChip: {
      backgroundColor: theme.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    aiChipText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: 'bold',
    },
    ocrSubtext: {
      color: theme.textSecondary,
      fontSize: 12,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    claimSection: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: theme.text,
      fontSize: 16,
    },
    textArea: {
      height: 100,
      paddingTop: 14,
    },
    submitButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    submitButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    bottomPadding: {
      height: 120,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.surface} />
      
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={dynamicStyles.backButton}>
          <Text style={dynamicStyles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Instant Claim</Text>
        <View style={dynamicStyles.placeholder} />
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Photo Upload Section */}
        <View style={dynamicStyles.photoSection}>
          <View style={dynamicStyles.uploadArea}>
            <View style={dynamicStyles.uploadIcon}>
              <CameraIcon size={32} color={theme.textSecondary} />
            </View>
            <Text style={dynamicStyles.uploadText}>Upload or take a photo</Text>
            
            <View style={dynamicStyles.uploadButtons}>
              <TouchableOpacity style={dynamicStyles.uploadButton} onPress={handleUploadPhoto}>
                <UploadIcon size={18} color="#ffffff" />
                <Text style={dynamicStyles.uploadButtonText}>Upload Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={dynamicStyles.takePhotoButton} onPress={handleTakePhoto}>
                <CameraIcon size={18} color="#ffffff" />
                <Text style={dynamicStyles.takePhotoButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <View style={dynamicStyles.imagePreview}>
              <Text style={dynamicStyles.imagePreviewText}>
                {selectedImages.length} photo(s) selected
              </Text>
            </View>
          )}
        </View>

        {/* OCR Document Scan Section */}
        <View style={dynamicStyles.ocrSection}>
          <TouchableOpacity style={dynamicStyles.ocrButton} onPress={handleScanDocument}>
            <DocumentIcon size={20} color={theme.primary} />
            <Text style={dynamicStyles.ocrButtonText}>Scan Document (Auto-fill)</Text>
            <View style={dynamicStyles.aiChip}>
              <Text style={dynamicStyles.aiChipText}>AI</Text>
            </View>
          </TouchableOpacity>
          <Text style={dynamicStyles.ocrSubtext}>Upload insurance documents to automatically fill claim details using OCR</Text>
        </View>

        {/* Claim Details Section */}
        <View style={dynamicStyles.claimSection}>
          <Text style={dynamicStyles.sectionTitle}>Claim Details</Text>
          
          {/* Policy Number */}
          <View style={dynamicStyles.inputGroup}>
            <Text style={dynamicStyles.inputLabel}>Policy Number</Text>
            <TextInput
              style={dynamicStyles.input}
              value={policyNumber}
              onChangeText={setPolicyNumber}
              placeholder="Enter policy number"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Date of Incident */}
          <View style={dynamicStyles.inputGroup}>
            <Text style={dynamicStyles.inputLabel}>Date of Incident</Text>
            <TextInput
              style={dynamicStyles.input}
              value={incidentDate}
              onChangeText={setIncidentDate}
              placeholder="mm/dd/yyyy"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Claim Amount */}
          <View style={dynamicStyles.inputGroup}>
            <Text style={dynamicStyles.inputLabel}>Claim Amount</Text>
            <TextInput
              style={dynamicStyles.input}
              value={claimAmount}
              onChangeText={setClaimAmount}
              placeholder="Enter claim amount"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Description */}
          <View style={dynamicStyles.inputGroup}>
            <Text style={dynamicStyles.inputLabel}>Description</Text>
            <TextInput
              style={[dynamicStyles.input, dynamicStyles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what happened..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={dynamicStyles.submitButton} onPress={handleSubmitClaim}>
            <Text style={dynamicStyles.submitButtonText}>Submit Claim</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for navigation */}
        <View style={dynamicStyles.bottomPadding} />
      </ScrollView>
      
      <AlertComponent />
    </View>
  );
} 