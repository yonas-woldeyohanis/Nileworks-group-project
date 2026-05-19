import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import StudentTabNavigator from './StudentTabNavigator';
import EmployerTabNavigator from './EmployerTabNavigator';
import AuthNavigator from './AuthNavigator';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
    <ActivityIndicator color={COLORS.accent} size="large" />
  </View>
);

const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === 'employer' ? (
        <EmployerTabNavigator />
      ) : (
        <StudentTabNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
