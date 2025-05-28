import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  StatusBar 
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase/client';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Typography, Heading2, Heading3, Body, Caption } from '../../src/components/Typography';
import { Text } from '../../src/components/Text';

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const { theme, isDark } = useTheme();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    return () => subscription.unsubscribe();
  }, []);

  const handleInstantClaim = () => {
    router.push('/instant-claim' as any);
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'Supratik';
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
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 3,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    greetingSection: {
      flex: 1,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    subGreeting: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    profileCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    avatarText: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    profileDetails: {
      flex: 1,
    },
    profilePercent: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    profileText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    policyCard: {
      backgroundColor: theme.card,
      margin: 20,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    policyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    policyIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.success,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    policyIconText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    policyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    policyType: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    policyDetails: {
      gap: 16,
    },
    policyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    policyLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    policyValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    policyFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    renewButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    renewButtonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    seeMore: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    iconCard: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    healthCard: {
      backgroundColor: isDark ? theme.card : '#FEE2E2',
    },
    bikeCard: {
      backgroundColor: isDark ? theme.card : '#FEF3C7',
    },
    homeCard: {
      backgroundColor: isDark ? theme.card : '#E0E7FF',
    },
    travelCard: {
      backgroundColor: isDark ? theme.card : '#D1FAE5',
    },
    iconEmoji: {
      fontSize: 24,
      marginBottom: 8,
    },
    iconLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.text,
    },
    actionCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    actionEmoji: {
      fontSize: 20,
    },
    actionContent: {
      flex: 1,
    },
    actionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    actionAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.success,
    },
    actionSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    newBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    newBadgeText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: 'bold',
    },
    bottomPadding: {
      height: 120,
      backgroundColor: theme.background,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.surface} />
      
      {/* Header Section */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerTop}>
          <View style={dynamicStyles.greetingSection}>
            <Heading2 weight="bold">Hello 👋 {getUserName()}!</Heading2>
            <Body color={theme.textSecondary}>{greeting}</Body>
          </View>
          <ThemeToggle size="small" />
        </View>
        
        {/* Profile Completion */}
        <View style={dynamicStyles.profileCard}>
          <View style={dynamicStyles.profileInfo}>
            <View style={dynamicStyles.profileAvatar}>
              <Text weight="bold" size={20} color="#ffffff">{getUserName().charAt(0).toUpperCase()}</Text>
            </View>
            <View style={dynamicStyles.profileDetails}>
              <Typography variant="h5" weight="bold">60%</Typography>
              <Caption color={theme.textSecondary}>Complete your profile easily</Caption>
            </View>
          </View>
        </View>
      </View>

      {/* Policy Card */}
      <View style={dynamicStyles.policyCard}>
        <View style={dynamicStyles.policyHeader}>
          <View style={dynamicStyles.policyIcon}>
            <Text weight="bold" size={14} color="#ffffff">✓</Text>
          </View>
          <Typography variant="h5" weight="bold">Car Insurance</Typography>
        </View>
        <Body color={theme.textSecondary}>Comprehensive</Body>
        
        <View style={dynamicStyles.policyDetails}>
          <View style={dynamicStyles.policyRow}>
            <View>
              <Caption color={theme.textSecondary}>Policyholder</Caption>
              <Text weight="semiBold" size={14}>Rahul Sharma</Text>
            </View>
            <View>
              <Caption color={theme.textSecondary}>Policy Number</Caption>
              <Text weight="semiBold" size={14}>MPO4CY9999</Text>
            </View>
          </View>
          
          <View style={dynamicStyles.policyFooter}>
            <View>
              <Caption color={theme.textSecondary}>Third party validity</Caption>
              <Text weight="semiBold" size={14}>10/02/25</Text>
            </View>
            <TouchableOpacity style={dynamicStyles.renewButton}>
              <Text weight="semiBold" size={12} color="#ffffff">Renew Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Health & Wellness Section */}
      <View style={dynamicStyles.section}>
        <Heading3 weight="bold">Health & Wellness</Heading3>
        <View style={dynamicStyles.iconRow}>
          <TouchableOpacity style={[dynamicStyles.iconCard, dynamicStyles.healthCard]}>
            <Text size={24}>❤️</Text>
            <Text weight="semiBold" size={12}>Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[dynamicStyles.iconCard, dynamicStyles.bikeCard]}>
            <Text size={24}>🚴</Text>
            <Text weight="semiBold" size={12}>Bike</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[dynamicStyles.iconCard, dynamicStyles.homeCard]}>
            <Text size={24}>🏠</Text>
            <Text weight="semiBold" size={12}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[dynamicStyles.iconCard, dynamicStyles.travelCard]}>
            <Text size={24}>✈️</Text>
            <Text weight="semiBold" size={12}>Travel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={dynamicStyles.section}>
        <View style={dynamicStyles.sectionHeader}>
          <Heading3 weight="bold">Quick Actions</Heading3>
          <TouchableOpacity>
            <Text weight="semiBold" size={14} color={theme.primary}>See {'>'}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={dynamicStyles.actionCard} onPress={handleInstantClaim}>
          <View style={dynamicStyles.actionIcon}>
            <Text size={20}>📸</Text>
          </View>
          <View style={dynamicStyles.actionContent}>
            <View style={dynamicStyles.actionHeader}>
              <Text weight="semiBold" size={16}>Instant Claim</Text>
              <View style={dynamicStyles.newBadge}>
                <Text weight="bold" size={10} color="#ffffff">New</Text>
              </View>
            </View>
            <Caption color={theme.textSecondary}>Quick claim processing</Caption>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={dynamicStyles.actionCard}>
          <View style={dynamicStyles.actionIcon}>
            <Text size={20}>📍</Text>
          </View>
          <View style={dynamicStyles.actionContent}>
            <View style={dynamicStyles.actionHeader}>
              <Text weight="semiBold" size={16}>Find Local Services</Text>
              <Text weight="semiBold" size={14} color={theme.success}>+$134.00</Text>
            </View>
            <Caption color={theme.textSecondary}>Weekly Savings</Caption>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom padding for navigation */}
      <View style={dynamicStyles.bottomPadding} />
    </ScrollView>
  );
} 