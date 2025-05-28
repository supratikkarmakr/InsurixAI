export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  light: 'Inter_300Light',
} as const;

export type FontWeight = keyof typeof FONTS;

// Font mapping for different platforms
export const getFontFamily = (weight: FontWeight = 'regular') => {
  return FONTS[weight];
};

// Default font styles
export const defaultFontStyles = {
  fontFamily: FONTS.regular,
  color: '#1F2937', // Default text color
};

// Font sizes scale
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export type FontSize = keyof typeof FONT_SIZES; 