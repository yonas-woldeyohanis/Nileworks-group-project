import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { ENDPOINTS } from '../constants/endpoints';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ─── Bootstrap: check stored token on app launch ──────────────────────────
  useEffect(() => {
    bootstrapAuth();
  }, []);

  const bootstrapAuth = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const userData = await SecureStore.getItemAsync('userData');
      if (accessToken && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Bootstrap auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Register Student ─────────────────────────────────────────────────────
  const registerStudent = async (data) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER_STUDENT, data);
    await persistSession(response.data.data);
    return response.data;
  };

  // ─── Register Employer ────────────────────────────────────────────────────
  const registerEmployer = async (data) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER_EMPLOYER, data);
    await persistSession(response.data.data);
    return response.data;
  };

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    await persistSession(response.data.data);
    return response.data;
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (_) {}
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userData');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ─── Update user in state + storage ──────────────────────────────────────
  const updateUser = async (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    await SecureStore.setItemAsync('userData', JSON.stringify(merged));
  };

  // ─── Persist session to secure storage ───────────────────────────────────
  const persistSession = async ({ accessToken, refreshToken, user: userData }) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        registerStudent,
        registerEmployer,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
