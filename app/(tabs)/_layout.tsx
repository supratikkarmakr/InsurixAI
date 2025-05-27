import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

// Custom icon components with minimal vector-style design
const HomeIcon = ({ focused }: { focused: boolean }) => {
  const { theme } = useTheme();
  const color = focused ? theme.primary : theme.textSecondary;
  
  return (
    <View style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{
        width: 20,
        height: 20,
        position: 'relative',
      }}>
        {/* House base */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 2,
          right: 2,
          height: 12,
          borderWidth: 2,
          borderColor: color,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
        }} />
        {/* Roof */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderBottomWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }} />
        </View>
        {/* Door */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 8,
          width: 4,
          height: 6,
          backgroundColor: color,
        }} />
      </View>
    </View>
  );
};

const PoliciesIcon = ({ focused }: { focused: boolean }) => {
  const { theme } = useTheme();
  const color = focused ? theme.primary : theme.textSecondary;
  
  return (
    <View style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{
        width: 18,
        height: 20,
        borderWidth: 2,
        borderColor: color,
        borderRadius: 2,
        backgroundColor: 'transparent',
      }}>
        <View style={{
          marginTop: 3,
          marginHorizontal: 3,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          marginBottom: 2,
        }} />
        <View style={{
          marginHorizontal: 3,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          marginBottom: 2,
        }} />
        <View style={{
          marginHorizontal: 3,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
        }} />
      </View>
    </View>
  );
};

const VoiceIcon = () => (
  <View style={{
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <View style={{
      width: 12,
      height: 16,
      backgroundColor: '#ffffff',
      borderRadius: 6,
      position: 'relative',
    }}>
      <View style={{
        position: 'absolute',
        bottom: -4,
        left: -2,
        right: -2,
        height: 6,
        borderWidth: 2,
        borderColor: '#ffffff',
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }} />
      <View style={{
        position: 'absolute',
        bottom: -8,
        left: 4,
        right: 4,
        height: 2,
        backgroundColor: '#ffffff',
        borderRadius: 1,
      }} />
    </View>
  </View>
);

const HelpIcon = ({ focused }: { focused: boolean }) => {
  const { theme } = useTheme();
  const color = focused ? theme.primary : theme.textSecondary;
  
  return (
    <View style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: color,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: color,
          marginTop: -1,
        }}>?</Text>
      </View>
    </View>
  );
};

const MoreIcon = ({ focused }: { focused: boolean }) => {
  const { theme } = useTheme();
  const color = focused ? theme.primary : theme.textSecondary;
  
  return (
    <View style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        <View style={{
          width: 4,
          height: 4,
          backgroundColor: color,
          borderRadius: 2,
        }} />
        <View style={{
          width: 4,
          height: 4,
          backgroundColor: color,
          borderRadius: 2,
        }} />
        <View style={{
          width: 4,
          height: 4,
          backgroundColor: color,
          borderRadius: 2,
        }} />
      </View>
    </View>
  );
};

export default function TabLayout() {
  const { theme } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopWidth: 0,
            height: 90,
            paddingBottom: 25,
            paddingTop: 15,
            elevation: 20,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarBackground: () => (
            <View style={{
              flex: 1,
              backgroundColor: theme.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: 'hidden',
            }} />
          ),
        }}
        sceneContainerStyle={{
          backgroundColor: theme.background,
        }}
      >
        <Tabs.Screen 
          name="home" 
          options={{ 
            title: 'Home',
            tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />
          }} 
        />
        <Tabs.Screen 
          name="policies" 
          options={{ 
            title: 'Policies',
            tabBarIcon: ({ focused }) => <PoliciesIcon focused={focused} />
          }} 
        />
        
        {/* Voice Assistant - Center Button */}
        <Tabs.Screen 
          name="voice-assistant" 
          options={{ 
            title: '',
            tabBarIcon: ({ focused }) => (
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 25,
                elevation: 8,
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}>
                <VoiceIcon />
              </View>
            ),
            tabBarLabel: () => null,
          }} 
        />
        
        <Tabs.Screen 
          name="claims" 
          options={{ 
            title: 'Help',
            tabBarIcon: ({ focused }) => <HelpIcon focused={focused} />
          }} 
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            title: 'More',
            tabBarIcon: ({ focused }) => <MoreIcon focused={focused} />
          }} 
        />
      </Tabs>
    </View>
  );
} 