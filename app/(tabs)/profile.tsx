import React from 'react';
import { View, ScrollView, Text as RNText } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Heading1, Heading2, Heading3, Body, Caption } from '../../src/components/Typography';
import { Text } from '../../src/components/Text';

export default function ProfileScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: theme.background,
    }}>
      <View style={{
        padding: 20,
        paddingTop: 60,
      }}>
        <Heading1 weight="bold" style={{ marginBottom: 20 }}>
          Font Comparison Demo
        </Heading1>
        
        {/* Font Comparison Section */}
        <View style={{
          backgroundColor: theme.surface,
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: theme.border,
        }}>
          <Heading2 weight="bold" style={{ marginBottom: 16 }}>
            Before vs After
          </Heading2>
          
          <View style={{ marginBottom: 20 }}>
            <Caption color={theme.textSecondary} style={{ marginBottom: 8 }}>
              OLD - React Native Default Font:
            </Caption>
            <RNText style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: theme.text,
              marginBottom: 4
            }}>
              Hello! This is the default React Native font
            </RNText>
            <RNText style={{ 
              fontSize: 14, 
              color: theme.textSecondary
            }}>
              This text uses the system default font family
            </RNText>
          </View>
          
          <View style={{
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 20,
          }} />
          
          <View>
            <Caption color={theme.textSecondary} style={{ marginBottom: 8 }}>
              NEW - Poppins Font (Product Sans Alternative):
            </Caption>
            <Text weight="bold" size={18} style={{ marginBottom: 4 }}>
              Hello! This is the new Poppins font
            </Text>
            <Text size={14} color={theme.textSecondary}>
              This text uses our new Poppins typography system
            </Text>
          </View>
        </View>
        
        <View style={{
          backgroundColor: theme.surface,
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: theme.border,
        }}>
          <Heading2 weight="bold" style={{ marginBottom: 16 }}>
            Font Weights
          </Heading2>
          
          <View style={{ marginBottom: 12 }}>
            <Text weight="light" size={16}>Light Weight (300)</Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text weight="regular" size={16}>Regular Weight (400)</Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text weight="medium" size={16}>Medium Weight (500)</Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text weight="semiBold" size={16}>SemiBold Weight (600)</Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text weight="bold" size={16}>Bold Weight (700)</Text>
          </View>
        </View>

        <View style={{
          backgroundColor: theme.surface,
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: theme.border,
        }}>
          <Heading2 weight="bold" style={{ marginBottom: 16 }}>
            Typography Variants
          </Heading2>
          
          <View style={{ marginBottom: 12 }}>
            <Heading1>Heading 1 - 32px Bold</Heading1>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Heading2>Heading 2 - 28px Bold</Heading2>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Heading3>Heading 3 - 24px SemiBold</Heading3>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Typography variant="h4">Heading 4 - 20px SemiBold</Typography>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Typography variant="h5">Heading 5 - 18px Medium</Typography>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Body>Body Text - 16px Regular. This is perfect for reading long paragraphs of content with the new Poppins font family.</Body>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Typography variant="body2">Body 2 - 14px Regular for smaller content</Typography>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Caption>Caption - 12px Regular for fine print and details</Caption>
          </View>
        </View>

        <View style={{
          backgroundColor: theme.primary,
          padding: 20,
          borderRadius: 12,
          marginBottom: 40,
        }}>
          <Text weight="bold" size={18} color="#ffffff" style={{ textAlign: 'center' }}>
            🎉 Your app now uses Poppins font!
          </Text>
          <Text weight="regular" size={14} color="#ffffff" style={{ textAlign: 'center', marginTop: 8, opacity: 0.9 }}>
            A beautiful alternative to Product Sans - the difference should be very visible!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 