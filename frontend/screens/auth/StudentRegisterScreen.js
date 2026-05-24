import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
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

const UNIVERSITIES = [
  'Addis Ababa University',
  'Jimma University',
  'Hawassa University',
  'Bahir Dar University',
  'Mekelle University',
  'Adama Science and Technology University',
  'Haramaya University',
  'Arba Minch University',
  'Other',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'];

const StudentRegisterScreen = ({ navigation }) => {
  const { registerStudent } = useAuth();
  const { colors: COLORS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS), [COLORS]);

  const [step, setStep] = useState(1); // 2-step form
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    department: '',
    yearOfStudy: '',
  });

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!validateEmail(form.email)) errs.email = 'Enter a valid email';
    const pwErr = validatePassword(form.password);
    if (pwErr) errs.password = pwErr;
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.university) errs.university = 'Select your university';
    if (!form.department.trim()) errs.department = 'Department is required';
    if (!form.yearOfStudy) errs.yearOfStudy = 'Select your year';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await registerStudent({
        fullName: form.fullName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        university: form.university,
        department: form.department.trim(),
        yearOfStudy: form.yearOfStudy,
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
      <Header
        title="Create Student Account"
        onBack={() => (step === 2 ? setStep(1) : navigation.goBack())}
      />

      {/* Step indicator */}
      <View style={styles.stepBar}>
        {[1, 2].map((s) => (
          <View key={s} style={styles.stepTrack}>
            <View
              style={[
                styles.stepDot,
                step >= s && styles.stepDotActive,
              ]}
            >
              {step > s ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : (
                <Text style={[styles.stepNum, step >= s && { color: '#fff' }]}>{s}</Text>
              )}
            </View>
            {s < 2 && (
              <View style={[styles.stepLine, step > s && styles.stepLineActive]} />
            )}
          </View>
        ))}
        <Text style={styles.stepLabel}>Step {step} of 2</Text>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {step === 1 ? (
          <>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Input
              label="Full Name"
              value={form.fullName}
              onChangeText={(t) => update('fullName', t)}
              autoCapitalize="words"
              icon="person-outline"
              error={errors.fullName}
            />
            <Input
              label="Email Address"
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
            <Button title="Next Step" onPress={handleNext} />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Academic Details</Text>

            {/* University Picker */}
            <View style={styles.pickerLabel}>
              <Text style={styles.pickerLabelText}>University</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {UNIVERSITIES.map((uni) => (
                <Pressable
                  key={uni}
                  onPress={() => update('university', uni)}
                  style={[
                    styles.chip,
                    form.university === uni && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      form.university === uni && styles.chipTextActive,
                    ]}
                  >
                    {uni}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            {errors.university && (
              <Text style={styles.chipError}>{errors.university}</Text>
            )}

            <Input
              label="Department / Field of Study"
              value={form.department}
              onChangeText={(t) => update('department', t)}
              autoCapitalize="words"
              icon="library-outline"
              error={errors.department}
              style={{ marginTop: SPACING.base }}
            />

            {/* Year of Study */}
            <View style={styles.pickerLabel}>
              <Text style={styles.pickerLabelText}>Year of Study</Text>
            </View>
            <View style={styles.yearGrid}>
              {YEARS.map((year) => (
                <Pressable
                  key={year}
                  onPress={() => update('yearOfStudy', year)}
                  style={[
                    styles.yearChip,
                    form.yearOfStudy === year && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      form.yearOfStudy === year && styles.chipTextActive,
                    ]}
                  >
                    {year}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.yearOfStudy && (
              <Text style={styles.chipError}>{errors.yearOfStudy}</Text>
            )}

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: SPACING.xl }}
              icon={<Ionicons name="checkmark-circle-outline" size={18} color="#fff" />}
              iconPosition="right"
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Pressable import fix
import { Pressable } from 'react-native';

const makeStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepTrack: { flexDirection: 'row', alignItems: 'center' },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNum: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  stepLine: { width: 40, height: 2, backgroundColor: COLORS.border, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: COLORS.primary },
  stepLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginLeft: 'auto',
  },
  content: { padding: SPACING.base, paddingBottom: 48 },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  pickerLabel: { marginBottom: 8 },
  pickerLabelText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  chipScroll: { marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  chipTextActive: { color: '#fff' },
  chipError: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  yearChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
});

export default StudentRegisterScreen;
