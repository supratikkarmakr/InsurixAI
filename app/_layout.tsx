import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { supabase } from '@/services/supabase/client';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function AppContent() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Initialize Supabase client
    console.log('Supabase client initialized');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="instant-claim" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
} 