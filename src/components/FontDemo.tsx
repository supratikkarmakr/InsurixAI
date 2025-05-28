import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Typography, Heading1, Heading2, Heading3, Body, Caption } from './Typography';
import { Text } from './Text';
import { useTheme } from '../../contexts/ThemeContext';
import { textStyles } from '../styles/globalStyles';

export const FontDemo: React.FC = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    section: {
      marginBottom: 24,
      padding: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionTitle: {
      marginBottom: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    fontItem: {
      marginBottom: 8,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Typography Component Examples */}
      <View style={styles.section}>
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Typography Components
        </Typography>
        
        <View style={styles.fontItem}>
          <Heading1>Heading 1 - Inter Bold 32px</Heading1>
        </View>
        
        <View style={styles.fontItem}>
          <Heading2>Heading 2 - Inter Bold 28px</Heading2>
        </View>
        
        <View style={styles.fontItem}>
          <Heading3>Heading 3 - Inter SemiBold 24px</Heading3>
        </View>
        
        <View style={styles.fontItem}>
          <Typography variant="h4">Heading 4 - Inter SemiBold 20px</Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Body>Body Text - Inter Regular 16px. This is the default text style for most content in the app. It provides excellent readability on all screen sizes.</Body>
        </View>
        
        <View style={styles.fontItem}>
          <Caption>Caption Text - Inter Regular 12px for small details</Caption>
        </View>
      </View>

      {/* Font Weights */}
      <View style={styles.section}>
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Font Weights
        </Typography>
        
        <View style={styles.fontItem}>
          <Typography weight="light">Light - Inter 300</Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography weight="regular">Regular - Inter 400</Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography weight="medium">Medium - Inter 500</Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography weight="semiBold">SemiBold - Inter 600</Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography weight="bold">Bold - Inter 700</Typography>
        </View>
      </View>

      {/* Custom Text Component */}
      <View style={styles.section}>
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Custom Text Component
        </Typography>
        
        <View style={styles.fontItem}>
          <Text size={24} weight="bold">Large Bold Text</Text>
        </View>
        
        <View style={styles.fontItem}>
          <Text size={18} weight="medium">Medium Weight Text</Text>
        </View>
        
        <View style={styles.fontItem}>
          <Text size={14} weight="light" color={theme.textSecondary}>
            Light secondary text
          </Text>
        </View>
      </View>

      {/* Global Styles */}
      <View style={styles.section}>
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Global Styles
        </Typography>
        
        <View style={styles.fontItem}>
          <Typography style={textStyles.h1}>H1 Global Style</Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography style={textStyles.h2}>H2 Global Style</Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography style={textStyles.body1}>Body1 Global Style</Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography style={textStyles.button}>Button Global Style</Typography>
        </View>
      </View>

      {/* Special Use Cases */}
      <View style={styles.section}>
        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Special Use Cases
        </Typography>
        
        <View style={styles.fontItem}>
          <Typography variant="h4" color={theme.primary}>
            Branded Text Color
          </Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography variant="body1" weight="medium" color={theme.success}>
            Success Message Text
          </Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography variant="body2" weight="regular" color={theme.error}>
            Error Message Text
          </Typography>
        </View>
        
        <View style={styles.fontItem}>
          <Typography variant="caption" style={textStyles.overline}>
            OVERLINE TEXT STYLE
          </Typography>
        </View>
      </View>
    </ScrollView>
  );
}; 