import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { validateEmail, validatePassword } from '../../utils/helpers';

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Education',
  'Manufacturing', 'Agriculture', 'NGO / Non-profit', 'Government',
  'Hospitality', 'Retail', 'Media & Communications', 'Consulting', 'Other',
];

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

const EmployerRegisterScreen = ({ navigation }) => {
  const { registerEmployer } = useAuth();
  const { colors: COLORS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS), [COLORS]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    companyName: '',
    contactPersonName: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: '',
    companySize: '',
    website: '',
  });

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.companyName.trim()) errs.companyName = 'Company name is required';
    if (!form.contactPersonName.trim()) errs.contactPersonName = 'Contact person name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Enter a valid email';
    const pwErr = validatePassword(form.password);
    if (pwErr) errs.password = pwErr;
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.industry) errs.industry = 'Please select an industry';
    if (!form.companySize) errs.companySize = 'Please select company size';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerEmployer({
        companyName: form.companyName.trim(),
        contactPersonName: form.contactPersonName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        industry: form.industry,
        companySize: form.companySize,
        website: form.website.trim(),
      });
    } catch (err) {
      let message = err.response?.data?.message || 'Registration failed. Please try again.';
      if (err.message === 'Network Error' || err.message?.includes('timeout')) {
        message = 'Server is waking up, this might take a moment. Please try again.';
      }
      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Create Employer Account" onBack={() => navigation.goBack()} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Company Details</Text>

        <Input
          label="Company Name"
          value={form.companyName}
          onChangeText={(t) => update('companyName', t)}
          autoCapitalize="words"
          icon="business-outline"
          error={errors.companyName}
        />
        <Input
          label="Contact Person Name"
          value={form.contactPersonName}
          onChangeText={(t) => update('contactPersonName', t)}
          autoCapitalize="words"
          icon="person-outline"
          error={errors.contactPersonName}
        />
        <Input
          label="Work Email"
          value={form.email}
          onChangeText={(t) => update('email', t)}
          keyboardType="email-address"
          autoComplete="email"
          icon="mail-outline"
          error={errors.email}
        />
        <Input
          label="Password"
          value={form.password}
          onChangeText={(t) => update('password', t)}
          secureTextEntry
          icon="lock-closed-outline"
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          value={form.confirmPassword}
          onChangeText={(t) => update('confirmPassword', t)}
          secureTextEntry
          icon="lock-closed-outline"
          error={errors.confirmPassword}
        />
        <Input
          label="Website (optional)"
          value={form.website}
          onChangeText={(t) => update('website', t)}
          keyboardType="url"
          autoCapitalize="none"
          icon="globe-outline"
        />

        {/* Industry */}
        <Text style={styles.pickerLabel}>Industry</Text>
        <View style={styles.chipGrid}>
          {INDUSTRIES.map((ind) => (
            <Pressable
              key={ind}
              onPress={() => update('industry', ind)}
              style={[styles.chip, form.industry === ind && styles.chipActive]}
            >
              <Text style={[styles.chipText, form.industry === ind && styles.chipTextActive]}>
                {ind}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.industry && <Text style={styles.chipError}>{errors.industry}</Text>}

        {/* Company Size */}
        <Text style={[styles.pickerLabel, { marginTop: SPACING.lg }]}>Company Size (employees)</Text>
        <View style={styles.sizeRow}>
          {COMPANY_SIZES.map((size) => (
            <Pressable
              key={size}
              onPress={() => update('companySize', size)}
              style={[styles.sizeChip, form.companySize === size && styles.chipActive]}
            >
              <Text style={[styles.chipText, form.companySize === size && styles.chipTextActive]}>
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.companySize && <Text style={styles.chipError}>{errors.companySize}</Text>}

        <Button
          title="Create Employer Account"
          onPress={handleRegister}
          loading={loading}
          style={{ marginTop: SPACING.xl }}
          icon={<Ionicons name="checkmark-circle-outline" size={18} color="#fff" />}
          iconPosition="right"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.base, paddingBottom: 48 },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  pickerLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  sizeRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  sizeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    flex: 1,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  chipTextActive: { color: '#fff' },
  chipError: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default EmployerRegisterScreen;
