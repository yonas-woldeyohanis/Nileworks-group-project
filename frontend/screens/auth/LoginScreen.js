import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AnimatedGlowBorder from '../../components/common/AnimatedGlowBorder';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { BORDER_RADIUS, SPACING } from '../../constants/layout';
import { validateEmail } from '../../utils/helpers';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const floatY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -6, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [floatY]);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!validateEmail(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.toLowerCase().trim(), password);
      // Navigation handled by RootNavigator based on auth state
    } catch (err) {
      let message = err.response?.data?.message || 'Login failed. Please try again.';
      if (err.message === 'Network Error' || err.message?.includes('timeout')) {
        message = 'Server is waking up, this might take a moment. Please try again.';
      }
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />

      {/* Top hero */}
      <LinearGradient colors={COLORS.gradientHero} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Animated.View style={[styles.logoMark, { transform: [{ translateY: floatY }] }]}>
          <Ionicons name="water" size={28} color="#fff" />
        </Animated.View>
        <Text style={styles.heroTitle}>Sign In</Text>
        <Text style={styles.heroSub}>Welcome back to NileWorks</Text>
      </LinearGradient>

      {/* Form card */}
      <ScrollView
        contentContainerStyle={styles.formWrapper}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.formCard, SHADOWS.lg]}>
          <Input
            label="Email address"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: null })); }}
            keyboardType="email-address"
            autoComplete="email"
            icon="mail-outline"
            error={errors.email}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: null })); }}
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={styles.forgotLink}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: SPACING.xs }}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('RoleSelection')}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerBold}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: SPACING.base,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: SPACING.base,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  heroTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES['3xl'],
    color: '#fff',
    marginBottom: 4,
  },
  heroSub: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.65)',
  },
  formWrapper: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 40,
    marginTop: -24,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
  },
  forgotLink: { alignSelf: 'flex-end', marginTop: -8, marginBottom: SPACING.base },
  forgotText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryText,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginHorizontal: 12,
  },
  registerLink: { alignItems: 'center' },
  registerText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  registerBold: {
    fontFamily: FONTS.bold,
    color: COLORS.primaryText,
  },
});

export default LoginScreen;
