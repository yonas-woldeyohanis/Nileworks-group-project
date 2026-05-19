import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { validateEmail, validatePassword } from '../../utils/helpers';

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  const handleSendOTP = async () => {
    if (!validateEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email: email.toLowerCase().trim() });
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (!value && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await api.post(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp: code });
      setStep(3);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const pwErr = validatePassword(newPassword);
    if (pwErr) { setError(pwErr); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        email,
        otp: otp.join(''),
        newPassword,
      });
      Alert.alert('Success', 'Your password has been reset. Please sign in.', [
        { text: 'Sign In', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Forgot Password', 'Verify Your Email', 'New Password'];
  const stepIcons = ['mail-outline', 'keypad-outline', 'lock-closed-outline'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header
        title={stepTitles[step - 1]}
        onBack={() => (step > 1 ? setStep((s) => s - 1) : navigation.goBack())}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, SHADOWS.md]}>
          {/* Icon */}
          <View style={styles.iconWrapper}>
            <Ionicons name={stepIcons[step - 1]} size={28} color={COLORS.primary} />
          </View>

          {step === 1 && (
            <>
              <Text style={styles.description}>
                Enter your registered email address and we'll send you a 6-digit verification code.
              </Text>
              <Input
                label="Email Address"
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoComplete="email"
                icon="mail-outline"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button title="Send Code" onPress={handleSendOTP} loading={loading} />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.description}>
                We sent a 6-digit code to{' '}
                <Text style={styles.emailHighlight}>{email}</Text>.
                {'\n'}Enter it below within 10 minutes.
              </Text>

              {/* OTP inputs */}
              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (otpRefs.current[index] = ref)}
                    style={[styles.otpInput, digit && styles.otpInputFilled]}
                    value={digit}
                    onChangeText={(v) => handleOtpChange(v.replace(/[^0-9]/g, ''), index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectionColor={COLORS.primary}
                  />
                ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button title="Verify Code" onPress={handleVerifyOTP} loading={loading} />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.description}>
                Choose a strong new password for your account.
              </Text>
              <Input
                label="New Password"
                value={newPassword}
                onChangeText={(t) => { setNewPassword(t); setError(''); }}
                secureTextEntry
                icon="lock-closed-outline"
              />
              <Input
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                secureTextEntry
                icon="lock-closed-outline"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button title="Reset Password" onPress={handleResetPassword} loading={loading} />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.base, paddingTop: SPACING.xl, paddingBottom: 48 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emailHighlight: {
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  otpInput: {
    width: 46,
    height: 54,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.textPrimary,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
});

export default ForgotPasswordScreen;
