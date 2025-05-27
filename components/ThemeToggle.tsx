import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Sun icon component
const SunIcon = ({ size = 20, color = '#F59E0B' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.5,
      height: size * 0.5,
      backgroundColor: color,
      borderRadius: size * 0.25,
      position: 'relative',
    }}>
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            width: 2,
            height: size * 0.2,
            backgroundColor: color,
            borderRadius: 1,
            top: -size * 0.35,
            left: '50%',
            marginLeft: -1,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: `1px ${size * 0.35 + size * 0.25}px`,
          }}
        />
      ))}
    </View>
  </View>
);

// Moon icon component
const MoonIcon = ({ size = 20, color = '#6366F1' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.8,
      height: size * 0.8,
      borderRadius: size * 0.4,
      backgroundColor: color,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <View style={{
        position: 'absolute',
        top: size * 0.1,
        right: size * 0.1,
        width: size * 0.6,
        height: size * 0.6,
        borderRadius: size * 0.3,
        backgroundColor: '#111827',
      }} />
    </View>
  </View>
);

export const ThemeToggle: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  
  const getSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 48;
      default: return 40;
    }
  };

  const iconSize = getSize() * 0.5;
  const containerSize = getSize();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        }
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      {isDark ? (
        <MoonIcon size={iconSize} color="#6366F1" />
      ) : (
        <SunIcon size={iconSize} color="#F59E0B" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 