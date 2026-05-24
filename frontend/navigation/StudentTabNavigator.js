import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/student/HomeScreen';
import SearchScreen from '../screens/student/SearchScreen';
import JobDetailScreen from '../screens/student/JobDetailScreen';
import ApplyScreen from '../screens/student/ApplyScreen';
import ApplicationTrackerScreen from '../screens/student/ApplicationTrackerScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';
import SavedJobsScreen from '../screens/student/SavedJobsScreen';
import MessagingScreen from '../screens/shared/MessagingScreen';
import ConversationScreen from '../screens/shared/ConversationScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ChangePasswordScreen from '../screens/shared/ChangePasswordScreen';
import NotificationSettingsScreen from '../screens/shared/NotificationSettingsScreen';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../constants/typography';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Stack wrappers for each tab ─────────────────────────────────────────────

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="JobDetail" component={JobDetailScreen} />
    <Stack.Screen name="Apply" component={ApplyScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const TrackerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ApplicationTracker" component={ApplicationTrackerScreen} />
  </Stack.Navigator>
);


const MessagesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Messages" component={MessagingScreen} />
    <Stack.Screen name="Conversation" component={ConversationScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={StudentProfileScreen} />
    <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
  </Stack.Navigator>
);

// ─── Custom Tab Bar Icon ──────────────────────────────────────────────────────

const TabIcon = ({ name, focused, color, COLORS, styles }) => (
  <View style={[styles.tabIconWrapper, focused && { backgroundColor: COLORS.primary + '12' }]}>
    <Ionicons name={name} size={22} color={focused ? COLORS.primary : COLORS.textMuted} />
  </View>
);

// ─── Student Tab Navigator ────────────────────────────────────────────────────

const StudentTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: insets.bottom + 4 },
        ],
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'compass' : 'compass-outline'} focused={focused} COLORS={COLORS} styles={styles} />
          ),
        }}
      />
      <Tab.Screen
        name="TrackerTab"
        component={TrackerStack}
        options={{
          tabBarLabel: 'Tracker',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'bar-chart' : 'bar-chart-outline'} focused={focused} COLORS={COLORS} styles={styles} />
          ),
        }}
      />

      <Tab.Screen
        name="MessagesTab"
        component={MessagesStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} focused={focused} COLORS={COLORS} styles={styles} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} COLORS={COLORS} styles={styles} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 70,
    paddingTop: 8,
    ...SHADOWS.lg,
  },
  tabLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  tabIconWrapper: {
    width: 40,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudentTabNavigator;
