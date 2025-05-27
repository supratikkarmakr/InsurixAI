import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function VoiceAssistantScreen() {
  const { theme } = useTheme();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: 20,
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 8,
      }}>Voice Assistant</Text>
      <Text style={{
        fontSize: 16,
        color: theme.textSecondary,
      }}>AI-powered voice assistance</Text>
    </View>
  );
} 