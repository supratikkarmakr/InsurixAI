import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { ClaimsService } from '../src/services/claimsService';
import { supabase } from '../src/services/supabase/client';

interface Claim {
  id: string;
  claim_number: string;
  policy_id: string;
  incident_date: string;
  incident_description: string;
  claimed_amount: number;
  claim_status: string;
  ml_confidence?: number;
  created_at: string;
  updated_at: string;
}

export default function MyClaimsScreen() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      console.log('📋 Loading user claims...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        setLoading(false);
        return;
      }

      // Fetch claims from database
      const { data: claimsData, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (claimsError) {
        console.error('Error fetching claims:', claimsError);
        setLoading(false);
        return;
      }

      console.log('✅ Claims loaded:', claimsData?.length || 0);
      setClaims(claimsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Unexpected error loading claims:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClaims();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return '#3B82F6'; // Blue
      case 'under_review':
        return '#F59E0B'; // Orange
      case 'approved':
        return '#10B981'; // Green
      case 'rejected':
        return '#EF4444'; // Red
      case 'settled':
        return '#8B5CF6'; // Purple
      default:
        return theme.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'settled':
        return 'Settled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderClaimCard = (claim: Claim) => (
    <TouchableOpacity 
      key={claim.id} 
      style={dynamicStyles.claimCard}
      onPress={() => {
        // Navigate to claim details (you can implement this later)
        console.log('View claim details:', claim.claim_number);
      }}
    >
      <View style={dynamicStyles.claimHeader}>
        <View style={dynamicStyles.claimTitleSection}>
          <Text style={dynamicStyles.claimNumber}>{claim.claim_number}</Text>
          <Text style={dynamicStyles.claimDate}>{formatDate(claim.created_at)}</Text>
        </View>
        <View style={[dynamicStyles.statusBadge, { backgroundColor: getStatusColor(claim.claim_status) }]}>
          <Text style={dynamicStyles.statusText}>{getStatusText(claim.claim_status)}</Text>
        </View>
      </View>

      <View style={dynamicStyles.claimDetails}>
        <View style={dynamicStyles.detailRow}>
          <Text style={dynamicStyles.detailLabel}>Incident Date:</Text>
          <Text style={dynamicStyles.detailValue}>{claim.incident_date}</Text>
        </View>
        
        <View style={dynamicStyles.detailRow}>
          <Text style={dynamicStyles.detailLabel}>Amount:</Text>
          <Text style={[dynamicStyles.detailValue, dynamicStyles.amountText]}>
            {formatAmount(claim.claimed_amount)}
          </Text>
        </View>

        {claim.ml_confidence && (
          <View style={dynamicStyles.detailRow}>
            <Text style={dynamicStyles.detailLabel}>AI Confidence:</Text>
            <Text style={dynamicStyles.detailValue}>
              {Math.round(claim.ml_confidence * 100)}%
            </Text>
          </View>
        )}
      </View>

      <View style={dynamicStyles.descriptionSection}>
        <Text style={dynamicStyles.descriptionText} numberOfLines={2}>
          {claim.incident_description}
        </Text>
      </View>

      <View style={dynamicStyles.claimFooter}>
        <Text style={dynamicStyles.footerText}>
          Last updated: {formatDate(claim.updated_at)}
        </Text>
        <Text style={dynamicStyles.viewDetailsText}>Tap to view details →</Text>
      </View>
    </TouchableOpacity>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      color: theme.text,
      fontSize: 24,
      fontWeight: 'bold',
    },
    headerTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 16,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme.textSecondary,
      marginTop: 16,
      fontSize: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
    },
    emptySubtitle: {
      color: theme.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 24,
    },
    createClaimButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    createClaimButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    claimsList: {
      padding: 16,
    },
    claimCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    claimHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    claimTitleSection: {
      flex: 1,
    },
    claimNumber: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    claimDate: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    claimDetails: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    detailLabel: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    detailValue: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '500',
    },
    amountText: {
      color: theme.primary,
      fontWeight: 'bold',
    },
    descriptionSection: {
      marginBottom: 12,
    },
    descriptionText: {
      color: theme.text,
      fontSize: 14,
      lineHeight: 20,
    },
    claimFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    footerText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    viewDetailsText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '500',
    },
  });

  if (loading) {
    return (
      <View style={dynamicStyles.container}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={theme.background}
        />
        
        {/* Header */}
        <View style={dynamicStyles.header}>
          <TouchableOpacity 
            style={dynamicStyles.backButton}
            onPress={() => router.back()}
          >
            <Text style={dynamicStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>My Claims</Text>
        </View>

        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={dynamicStyles.loadingText}>Loading your claims...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background}
      />
      
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity 
          style={dynamicStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={dynamicStyles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>My Claims ({claims.length})</Text>
      </View>

      {/* Content */}
      <View style={dynamicStyles.content}>
        {claims.length === 0 ? (
          <View style={dynamicStyles.emptyContainer}>
            <Text style={dynamicStyles.emptyTitle}>No Claims Yet</Text>
            <Text style={dynamicStyles.emptySubtitle}>
              You haven't submitted any insurance claims yet. When you do, they'll appear here for easy tracking.
            </Text>
            <TouchableOpacity 
              style={dynamicStyles.createClaimButton}
              onPress={() => router.push('/instant-claim-enhanced')}
            >
              <Text style={dynamicStyles.createClaimButtonText}>Create Your First Claim</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView 
            style={dynamicStyles.claimsList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {claims.map(renderClaimCard)}
          </ScrollView>
        )}
      </View>
    </View>
  );
} 