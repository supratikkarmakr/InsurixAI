import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TextProps extends RNTextProps {
  weight?: 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
  size?: number;
}

export const Text: React.FC<TextProps> = ({
  weight = 'regular',
  color,
  size,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const getFontStyles = () => {
    switch (weight) {
      case 'light':
        return { fontFamily: theme.fonts.light, fontWeight: '300' as const };
      case 'regular':
        return { fontFamily: theme.fonts.regular, fontWeight: '400' as const };
      case 'medium':
        return { fontFamily: theme.fonts.medium, fontWeight: '500' as const };
      case 'semiBold':
        return { fontFamily: theme.fonts.semiBold, fontWeight: '600' as const };
      case 'bold':
        return { fontFamily: theme.fonts.bold, fontWeight: '700' as const };
      default:
        return { fontFamily: theme.fonts.regular, fontWeight: '400' as const };
    }
  };

  const combinedStyle: TextStyle = {
    ...getFontStyles(),
    color: color || theme.text,
    fontSize: size || 16,
    ...(style as TextStyle),
  };

  return (
    <RNText style={combinedStyle} {...props}>
      {children}
    </RNText>
  );
};

export default Text; 