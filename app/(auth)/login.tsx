import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase/client';
import { useCustomAlert } from '../../src/components/CustomAlert';
import { useTheme } from '../../contexts/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, AlertComponent } = useCustomAlert();
  const { theme, isDark } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        showAlert('Login Failed', error.message);
        return;
      }

      if (data.user) {
        // Login successful
        showAlert('Success', 'Login successful!', [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)/home'),
          }
        ]);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showAlert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/register' as any);
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password' as any);
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    header: {
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 48,
    },
    logoEmoji: {
      fontSize: 64,
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    form: {
      flex: 1,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      backgroundColor: theme.inputBackground,
      color: theme.text,
    },
    forgotPasswordContainer: {
      alignItems: 'flex-end',
      marginBottom: 32,
    },
    forgotPasswordText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    loginButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    loginButtonDisabled: {
      backgroundColor: theme.textSecondary,
    },
    loginButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      color: theme.textSecondary,
      paddingHorizontal: 16,
      fontSize: 14,
    },
    aadhaarButton: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 32,
      backgroundColor: theme.card,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    aadhaarButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 8,
    },
    aadhaarLogo: {
      width: 32,
      height: 20,
      resizeMode: 'contain',
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signUpText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    signUpLink: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    footer: {
      marginTop: 32,
      paddingTop: 24,
    },
    footerText: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={dynamicStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      <ScrollView contentContainerStyle={dynamicStyles.scrollContainer}>
        {/* Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.logoEmoji}>🛡️</Text>
          <Text style={dynamicStyles.title}>Welcome Back</Text>
          <Text style={dynamicStyles.subtitle}>Sign in to your InsurixAI account</Text>
        </View>

        {/* Form */}
        <View style={dynamicStyles.form}>
          {/* Email Input */}
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.label}>Email Address</Text>
            <TextInput
              style={dynamicStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.label}>Password</Text>
            <TextInput
              style={dynamicStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity 
            style={dynamicStyles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={dynamicStyles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[dynamicStyles.loginButton, isLoading && dynamicStyles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={dynamicStyles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={dynamicStyles.divider}>
            <View style={dynamicStyles.dividerLine} />
            <Text style={dynamicStyles.dividerText}>or</Text>
            <View style={dynamicStyles.dividerLine} />
          </View>

          {/* Aadhaar Login Button */}
          <TouchableOpacity style={dynamicStyles.aadhaarButton}>
            <Image 
              source={require('../../assets/images/aadhar-logo.png')} 
              style={dynamicStyles.aadhaarLogo}
            />
            <Text style={dynamicStyles.aadhaarButtonText}>Login with Aadhaar</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={dynamicStyles.signUpContainer}>
            <Text style={dynamicStyles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={dynamicStyles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={dynamicStyles.footer}>
          <Text style={dynamicStyles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
      
      <AlertComponent />
    </KeyboardAvoidingView>
  );
} 