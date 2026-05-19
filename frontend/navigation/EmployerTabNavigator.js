import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EmployerHomeScreen from '../screens/employer/EmployerHomeScreen';
import PostJobScreen from '../screens/employer/PostJobScreen';
import ApplicantDashboard from '../screens/employer/ApplicantDashboard';
import MyListingsScreen from '../screens/employer/MyListingsScreen';
import EmployerProfileScreen from '../screens/employer/EmployerProfileScreen';
import MessagingScreen from '../screens/shared/MessagingScreen';
import ConversationScreen from '../screens/shared/ConversationScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ChangePasswordScreen from '../screens/shared/ChangePasswordScreen';
import NotificationSettingsScreen from '../screens/shared/NotificationSettingsScreen';

import { COLORS, SHADOWS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EmployerHome" component={EmployerHomeScreen} />
    <Stack.Screen name="PostJob" component={PostJobScreen} />
    <Stack.Screen name="MyListings" component={MyListingsScreen} />
    <Stack.Screen name="ApplicantDashboard" component={ApplicantDashboard} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const PostStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PostJobMain" component={PostJobScreen} />
  </Stack.Navigator>
);

const ApplicantsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllApplicants" component={ApplicantDashboard} />
    <Stack.Screen name="Conversation" component={ConversationScreen} />
  </Stack.Navigator>
);

const EmployerMessagesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Messages" component={MessagingScreen} />
    <Stack.Screen name="Conversation" component={ConversationScreen} />
  </Stack.Navigator>
);

const EmployerProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EmployerProfile" component={EmployerProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
  </Stack.Navigator>
);

const TabIcon = ({ name, focused }) => (
  <View style={[styles.tabIconWrapper, focused && styles.tabIconActive]}>
    <Ionicons name={name} size={22} color={focused ? COLORS.primary : COLORS.textMuted} />
  </View>
);

const EmployerTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom + 4 }],
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="PostTab"
        component={PostStack}
        options={{
          tabBarLabel: 'Post Job',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'add-circle' : 'add-circle-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ApplicantsTab"
        component={ApplicantsStack}
        options={{
          tabBarLabel: 'Applicants',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'people' : 'people-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="EmployerMessagesTab"
        component={EmployerMessagesStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="EmployerProfileTab"
        component={EmployerProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'business' : 'business-outline'} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
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
  tabIconActive: {
    backgroundColor: COLORS.primary + '12',
  },
});

export default EmployerTabNavigator;
