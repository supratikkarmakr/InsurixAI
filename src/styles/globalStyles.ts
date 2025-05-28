import { StyleSheet, TextStyle, Platform } from 'react-native';

// System font families that work across platforms
export const fontFamilies = {
  light: Platform.select({
    ios: 'System',
    android: 'Roboto_300Light',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    default: 'System',
  }),
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto_500Medium',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    default: 'System',
  }),
  semiBold: Platform.select({
    ios: 'System',
    android: 'Roboto_700Bold',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto_900Black',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    default: 'System',
  }),
};

// Font sizes
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Text styles using system fonts with appropriate weights
export const textStyles = StyleSheet.create({
  // Base text styles
  text: {
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
    fontSize: fontSizes.base,
    lineHeight: 24,
  },
  textLight: {
    fontFamily: fontFamilies.light,
    fontWeight: '300',
    fontSize: fontSizes.base,
    lineHeight: 24,
  },
  textMedium: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: fontSizes.base,
    lineHeight: 24,
  },
  textSemiBold: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '600',
    fontSize: fontSizes.base,
    lineHeight: 24,
  },
  textBold: {
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
    fontSize: fontSizes.base,
    lineHeight: 24,
  },

  // Heading styles
  h1: {
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
    fontSize: fontSizes['4xl'],
    lineHeight: 44,
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
    fontSize: fontSizes['3xl'],
    lineHeight: 38,
  },
  h3: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '600',
    fontSize: fontSizes['2xl'],
    lineHeight: 32,
  },
  h4: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '600',
    fontSize: fontSizes.xl,
    lineHeight: 28,
  },
  h5: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: fontSizes.lg,
    lineHeight: 26,
  },
  h6: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: fontSizes.base,
    lineHeight: 24,
  },

  // Body text styles
  body1: {
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
    fontSize: fontSizes.base,
    lineHeight: 24,
  },
  body2: {
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },

  // Other text styles
  caption: {
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
    fontSize: fontSizes.xs,
    lineHeight: 16,
  },
  button: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  overline: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: fontSizes.xs,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
} as const);

// Helper function to get font family by weight
export const getFontFamily = (weight: keyof typeof fontFamilies = 'regular') => {
  return fontFamilies[weight];
};

// Helper function to create custom text style
export const createTextStyle = (
  size: keyof typeof fontSizes | number = 'base',
  weight: keyof typeof fontFamilies = 'regular',
  lineHeight?: number
): TextStyle => {
  const fontSize = typeof size === 'number' ? size : fontSizes[size];
  return {
    fontFamily: fontFamilies[weight],
    fontSize,
    lineHeight: lineHeight || fontSize * 1.5,
    fontWeight: weight === 'light' ? '300' : 
                weight === 'regular' ? '400' : 
                weight === 'medium' ? '500' : 
                weight === 'semiBold' ? '600' : '700',
  };
}; 