import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function SplashScreen() {
  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#14b8a6', '#0891b2']}
        style={styles.background}
      >
        <View style={styles.content}>
          {/* Transparent Logo - Professional Size */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo/FRONT.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          {/* Tagline positioned below logo */}
          <Text style={styles.tagline}>One app. All risks covered</Text>
        </View>

        {/* Get Started button */}
        <TouchableOpacity
          onPress={handleGetStarted}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logoContainer: {
    width: 280,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 400,
    height: 270,
  },
  tagline: {
    fontSize: 17,
    color: '#ffffff',
    opacity: 0.75,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
  },
  button: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#ffffff',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 220,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#0891b2',
    fontSize: 18,
    fontWeight: '600',
  },
}); 