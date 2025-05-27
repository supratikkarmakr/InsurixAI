import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
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
            <Text style={dynamicStyles.greeting}>Hello 👋 {getUserName()}!</Text>
            <Text style={dynamicStyles.subGreeting}>{greeting}</Text>
          </View>
          <ThemeToggle size="small" />
        </View>
        
        {/* Profile Completion */}
        <View style={dynamicStyles.profileCard}>
          <View style={dynamicStyles.profileInfo}>
            <View style={dynamicStyles.profileAvatar}>
              <Text style={dynamicStyles.avatarText}>{getUserName().charAt(0).toUpperCase()}</Text>
            </View>
            <View style={dynamicStyles.profileDetails}>
              <Text style={dynamicStyles.profilePercent}>60%</Text>
              <Text style={dynamicStyles.profileText}>Complete your profile easily</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Policy Card */}
      <View style={dynamicStyles.policyCard}>
        <View style={dynamicStyles.policyHeader}>
          <View style={dynamicStyles.policyIcon}>
            <Text style={dynamicStyles.policyIconText}>✓</Text>
          </View>
          <Text style={dynamicStyles.policyTitle}>Car Insurance</Text>
        </View>
        <Text style={dynamicStyles.policyType}>Comprehensive</Text>
        
        <View style={dynamicStyles.policyDetails}>
          <View style={dynamicStyles.policyRow}>
            <View>
              <Text style={dynamicStyles.policyLabel}>Policyholder</Text>
              <Text style={dynamicStyles.policyValue}>Rahul Sharma</Text>
            </View>
            <View>
              <Text style={dynamicStyles.policyLabel}>Policy Number</Text>
              <Text style={dynamicStyles.policyValue}>MPO4CY9999</Text>
            </View>
          </View>
          
          <View style={dynamicStyles.policyFooter}>
            <View>
              <Text style={dynamicStyles.policyLabel}>Third party validity</Text>
              <Text style={dynamicStyles.policyValue}>10/02/25</Text>
            </View>
            <TouchableOpacity style={dynamicStyles.renewButton}>
              <Text style={dynamicStyles.renewButtonText}>Renew Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Health & Wellness Section */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Health & Wellness</Text>
        <View style={dynamicStyles.iconRow}>
          <TouchableOpacity style={[dynamicStyles.iconCard, dynamicStyles.healthCard]}>
            <Text style={dynamicStyles.iconEmoji}>❤️</Text>
            <Text style={dynamicStyles.iconLabel}>Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[dynamicStyles.iconCard, dynamicStyles.bikeCard]}>
            <Text style={dynamicStyles.iconEmoji}>🚴</Text>
            <Text style={dynamicStyles.iconLabel}>Bike</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[dynamicStyles.iconCard, dynamicStyles.homeCard]}>
            <Text style={dynamicStyles.iconEmoji}>🏠</Text>
            <Text style={dynamicStyles.iconLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[dynamicStyles.iconCard, dynamicStyles.travelCard]}>
            <Text style={dynamicStyles.iconEmoji}>✈️</Text>
            <Text style={dynamicStyles.iconLabel}>Travel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={dynamicStyles.section}>
        <View style={dynamicStyles.sectionHeader}>
          <Text style={dynamicStyles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity>
            <Text style={dynamicStyles.seeMore}>See {'>'}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={dynamicStyles.actionCard} onPress={handleInstantClaim}>
          <View style={dynamicStyles.actionIcon}>
            <Text style={dynamicStyles.actionEmoji}>📸</Text>
          </View>
          <View style={dynamicStyles.actionContent}>
            <View style={dynamicStyles.actionHeader}>
              <Text style={dynamicStyles.actionTitle}>Instant Claim</Text>
              <View style={dynamicStyles.newBadge}>
                <Text style={dynamicStyles.newBadgeText}>New</Text>
              </View>
            </View>
            <Text style={dynamicStyles.actionSubtitle}>Quick claim processing</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={dynamicStyles.actionCard}>
          <View style={dynamicStyles.actionIcon}>
            <Text style={dynamicStyles.actionEmoji}>📍</Text>
          </View>
          <View style={dynamicStyles.actionContent}>
            <View style={dynamicStyles.actionHeader}>
              <Text style={dynamicStyles.actionTitle}>Find Local Services</Text>
              <Text style={dynamicStyles.actionAmount}>+$134.00</Text>
            </View>
            <Text style={dynamicStyles.actionSubtitle}>Weekly Savings</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom padding for navigation */}
      <View style={dynamicStyles.bottomPadding} />
    </ScrollView>
  );
} 