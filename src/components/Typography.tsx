import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TypographyProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'button';
  weight?: 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight = 'regular',
  color,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return { 
          fontSize: 32, 
          lineHeight: 40, 
          fontFamily: theme.fonts.bold,
          fontWeight: '700'
        };
      case 'h2':
        return { 
          fontSize: 28, 
          lineHeight: 36, 
          fontFamily: theme.fonts.bold,
          fontWeight: '700'
        };
      case 'h3':
        return { 
          fontSize: 24, 
          lineHeight: 32, 
          fontFamily: theme.fonts.semiBold,
          fontWeight: '600'
        };
      case 'h4':
        return { 
          fontSize: 20, 
          lineHeight: 28, 
          fontFamily: theme.fonts.semiBold,
          fontWeight: '600'
        };
      case 'h5':
        return { 
          fontSize: 18, 
          lineHeight: 24, 
          fontFamily: theme.fonts.medium,
          fontWeight: '500'
        };
      case 'h6':
        return { 
          fontSize: 16, 
          lineHeight: 24, 
          fontFamily: theme.fonts.medium,
          fontWeight: '500'
        };
      case 'body1':
        return { 
          fontSize: 16, 
          lineHeight: 24, 
          fontFamily: theme.fonts.regular,
          fontWeight: '400'
        };
      case 'body2':
        return { 
          fontSize: 14, 
          lineHeight: 20, 
          fontFamily: theme.fonts.regular,
          fontWeight: '400'
        };
      case 'caption':
        return { 
          fontSize: 12, 
          lineHeight: 16, 
          fontFamily: theme.fonts.regular,
          fontWeight: '400'
        };
      case 'button':
        return { 
          fontSize: 14, 
          lineHeight: 20, 
          fontFamily: theme.fonts.medium,
          fontWeight: '500'
        };
      default:
        return { 
          fontSize: 16, 
          lineHeight: 24, 
          fontFamily: theme.fonts.regular,
          fontWeight: '400'
        };
    }
  };

  const getWeightStyles = (): TextStyle => {
    switch (weight) {
      case 'light':
        return { fontFamily: theme.fonts.light, fontWeight: '300' };
      case 'regular':
        return { fontFamily: theme.fonts.regular, fontWeight: '400' };
      case 'medium':
        return { fontFamily: theme.fonts.medium, fontWeight: '500' };
      case 'semiBold':
        return { fontFamily: theme.fonts.semiBold, fontWeight: '600' };
      case 'bold':
        return { fontFamily: theme.fonts.bold, fontWeight: '700' };
      default:
        return { fontFamily: theme.fonts.regular, fontWeight: '400' };
    }
  };

  const combinedStyle: TextStyle = {
    ...getVariantStyles(),
    ...getWeightStyles(),
    color: color || theme.text,
    ...(style as TextStyle),
  };

  return (
    <RNText style={combinedStyle} {...props}>
      {children}
    </RNText>
  );
};

// Convenience components
export const Heading1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" {...props} />
);

export const Heading2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" {...props} />
);

export const Heading3 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" {...props} />
);

export const Heading4 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h4" {...props} />
);

export const Body = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body1" {...props} />
);

export const Caption = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" {...props} />
);

export const ButtonText = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="button" {...props} />
); 