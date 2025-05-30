import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Heading1, Heading2, Heading3, Body, Caption } from '../../src/components/Typography';
import { Text } from '../../src/components/Text';
import { supabase } from '../../src/services/supabase/client';
import { useCustomAlert } from '../../src/components/CustomAlert';

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [claimsCount, setClaimsCount] = useState(0);
  const { showAlert, AlertComponent } = useCustomAlert();

  useEffect(() => {
    loadUserData();
    loadClaimsCount();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error loading user:', error);
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Unexpected error loading user:', error);
    }
  };

  const loadClaimsCount = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data, error } = await supabase
        .from('claims')
        .select('id')
        .eq('user_id', user.id);

      if (!error && data) {
        setClaimsCount(data.length);
      }
    } catch (error) {
      console.error('Error loading claims count:', error);
    }
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'No email';
  };

  const handleSignOut = async () => {
    showAlert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              // Navigation will be handled by auth state change
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.surface,
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    avatarText: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    profileInfo: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.surface,
      margin: 16,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastMenuItem: {
      borderBottomWidth: 0,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    menuItemText: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    menuItemSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    menuItemBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 12,
    },
    badgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    newBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 12,
    },
    chevron: {
      color: theme.textSecondary,
      fontSize: 18,
    },
    signOutButton: {
      backgroundColor: theme.error,
      margin: 16,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    signOutButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    bottomPadding: {
      height: 120,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.surface}
      />
      
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerTop}>
          <View style={dynamicStyles.profileSection}>
            <View style={dynamicStyles.profileAvatar}>
              <Text style={dynamicStyles.avatarText}>
                {getUserName().charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={dynamicStyles.profileInfo}>
              <Typography variant="h4" weight="bold">
                {getUserName()}
              </Typography>
              <Body color={theme.textSecondary}>
                {getUserEmail()}
              </Body>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Claims & Policies Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Insurance</Text>
          
          <TouchableOpacity 
            style={dynamicStyles.menuItem}
            onPress={() => router.push('/my-claims')}
          >
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#3B82F6' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>📋</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>My Claims</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Track and manage your insurance claims
                </Text>
              </View>
            </View>
            {claimsCount > 0 && (
              <View style={dynamicStyles.menuItemBadge}>
                <Text style={dynamicStyles.badgeText}>{claimsCount}</Text>
              </View>
            )}
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[dynamicStyles.menuItem, dynamicStyles.lastMenuItem]}
            onPress={() => router.push('/(tabs)/policies')}
          >
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#10B981' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>📄</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>My Policies</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  View and manage your insurance policies
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={dynamicStyles.menuItem}>
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#8B5CF6' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>👤</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>Personal Information</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Update your profile and contact details
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.menuItem}>
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#F59E0B' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>🔒</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>Privacy & Security</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Manage your privacy settings and security
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[dynamicStyles.menuItem, dynamicStyles.lastMenuItem]}>
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#EF4444' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>🔔</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>Notifications</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Configure your notification preferences
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={dynamicStyles.menuItem}>
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#06B6D4' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>💬</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>Help & Support</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Get help with your insurance questions
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.menuItem}>
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#84CC16' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>⭐</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>Rate Our App</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Share your feedback and rate our app
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[dynamicStyles.menuItem, dynamicStyles.lastMenuItem]}>
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#6B7280' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>ℹ️</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>About</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  App version and legal information
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Smart Features Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Smart Features</Text>
          
          <TouchableOpacity 
            style={dynamicStyles.menuItem}
            onPress={() => router.push('/instant-claim-enhanced')}
          >
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#F59E0B' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>🤖</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>AI Instant Claims</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Quick claim processing with AI analysis
                </Text>
              </View>
            </View>
            <View style={dynamicStyles.newBadge}>
              <Text style={dynamicStyles.badgeText}>New</Text>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={dynamicStyles.menuItem}
            onPress={() => router.push('/(tabs)/voice-assistant')}
          >
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#06B6D4' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>🎙️</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>Voice Assistant</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Get help with voice commands
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[dynamicStyles.menuItem, dynamicStyles.lastMenuItem]}>
            <View style={dynamicStyles.menuItemLeft}>
              <View style={[dynamicStyles.menuIcon, { backgroundColor: '#EF4444' }]}>
                <Text style={{ color: '#fff', fontSize: 18 }}>🚨</Text>
              </View>
              <View style={dynamicStyles.menuItemText}>
                <Text style={dynamicStyles.menuItemTitle}>Emergency Services</Text>
                <Text style={dynamicStyles.menuItemSubtitle}>
                  Quick access to emergency support
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={dynamicStyles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={dynamicStyles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={dynamicStyles.bottomPadding} />
      </ScrollView>
      
      <AlertComponent />
    </View>
  );
} 