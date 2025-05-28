import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface Theme {
  primary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  inputBackground: string;
  shadow: string;
  success: string;
  successLight: string;
  error: string;
  warning: string;
  fonts: {
    light: string;
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
}

// Poppins fonts - very distinctive and noticeable
const getPoppinsFonts = () => {
  return {
    light: 'Poppins_300Light',
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  };
};

const poppinsFonts = getPoppinsFonts();

const lightTheme: Theme = {
  primary: '#14B8A6',
  background: '#F8FAFC',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  inputBackground: '#F9FAFB',
  shadow: '#000000',
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  warning: '#F59E0B',
  fonts: poppinsFonts,
};

const darkTheme: Theme = {
  primary: '#14B8A6',
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#4B5563',
  inputBackground: '#374151',
  shadow: '#000000',
  success: '#10B981',
  successLight: '#064E3B',
  error: '#EF4444',
  warning: '#F59E0B',
  fonts: poppinsFonts,
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 