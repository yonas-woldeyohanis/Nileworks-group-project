import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ENDPOINTS } from '../../constants/endpoints';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';

const ApplyScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const { user } = useAuth();
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1); // 1: review, 2: cover letter, 3: confirm, 4: success
  const [coverLetter, setCoverLetter] = useState('');
  const [customCV, setCustomCV] = useState(null);
  const [useCustomCV, setUseCustomCV] = useState(false);
  const [loading, setLoading] = useState(false);

  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const pickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setCustomCV(result.assets[0]);
        setUseCustomCV(true);
      }
    } catch (err) {
      console.error('Pick CV error:', err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (useCustomCV && customCV) {
        formData.append('cv', {
          uri: customCV.uri,
          name: customCV.name,
          type: 'application/pdf',
        });
      }

      await api.post(ENDPOINTS.APPLICATIONS.APPLY(job._id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Show success
      setStep(4);
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start();
    } catch (err) {
      const msg = err.response?.data?.message || 'Application failed. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const successStyle = {
    transform: [{ scale: successScale }],
    opacity: successOpacity,
  };

  // ─── Step 4: Success ──────────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <View style={styles.successContainer}>
        <Animated.View style={[styles.successContent, successStyle]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>Application Sent! 🎉</Text>
          <Text style={styles.successMessage}>
            Your application for{' '}
            <Text style={{ color: COLORS.primary, fontFamily: FONTS.semiBold }}>
              {job.title}
            </Text>{' '}
            at{' '}
            <Text style={{ color: COLORS.primary, fontFamily: FONTS.semiBold }}>
              {job.employer?.companyName}
            </Text>{' '}
            has been submitted successfully.
          </Text>
          <Text style={styles.successSub}>
            The employer will be notified. You can track your application status in the Tracker tab.
          </Text>

          <View style={styles.successActions}>
            <Button
              title="Track Application"
              onPress={() => navigation.navigate('TrackerTab', { screen: 'ApplicationTracker' })}
              style={{ marginBottom: 12 }}
            />
            <Button
              variant="outline"
              title="Back to Jobs"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        </Animated.View>
      </View>
    );
  }

  const steps = ['Profile Review', 'Cover Letter', 'Confirm & Submit'];

  return (
    <View style={styles.container}>
      <Header
        title="Apply for Job"
        onBack={() => (step > 1 ? setStep((s) => s - 1) : navigation.goBack())}
        subtitle={job.title}
      />

      {/* Progress bar */}
      <View style={styles.progressRow}>
        {steps.map((label, i) => (
          <View key={i} style={styles.progressItem}>
            <View
              style={[
                styles.progressDot,
                step > i + 1 && styles.progressDotDone,
                step === i + 1 && styles.progressDotActive,
              ]}
            >
              {step > i + 1 ? (
                <Ionicons name="checkmark" size={10} color="#fff" />
              ) : (
                <Text style={[styles.progressNum, step === i + 1 && { color: '#fff' }]}>{i + 1}</Text>
              )}
            </View>
            {i < steps.length - 1 && (
              <View style={[styles.progressLine, step > i + 1 && styles.progressLineDone]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── STEP 1: Profile Review ── */}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Review Your Profile</Text>
            <Text style={styles.stepDesc}>
              This is how your profile will appear to the employer.
            </Text>

            <View style={[styles.profileCard, SHADOWS.sm]}>
              <View style={styles.profileHeader}>
                <Avatar uri={user?.avatar} name={user?.fullName} size={56} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.profileName}>{user?.fullName}</Text>
                  <Text style={styles.profileUni}>{user?.university}</Text>
                  <Text style={styles.profileDept}>{user?.department} · {user?.yearOfStudy}</Text>
                </View>
              </View>
              {user?.bio && <Text style={styles.profileBio}>{user.bio}</Text>}
              {user?.skills?.length > 0 && (
                <View style={styles.skillsRow}>
                  {user.skills.slice(0, 5).map((skill, i) => (
                    <View key={i} style={styles.skillPill}>
                      <Text style={styles.skillPillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* CV status */}
            <View style={[styles.cvCard, SHADOWS.sm]}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cvTitle}>
                  {user?.cv ? 'CV / Resume Ready' : 'No CV uploaded yet'}
                </Text>
                <Text style={styles.cvSub}>
                  {user?.cv ? 'Your profile CV will be submitted' : 'Upload a CV to strengthen your application'}
                </Text>
              </View>
              {user?.cv && (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              )}
            </View>

            <Button
              title="Next: Cover Letter"
              onPress={() => setStep(2)}
              style={{ marginTop: SPACING.base }}
              icon={<Ionicons name="arrow-forward" size={18} color="#fff" />}
              iconPosition="right"
            />
          </View>
        )}

        {/* ── STEP 2: Cover Letter ── */}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Cover Letter</Text>
            <Text style={styles.stepDesc}>
              Optional but highly recommended. Briefly explain why you're a great fit.
            </Text>

            <View style={[styles.textAreaCard, SHADOWS.sm]}>
              <TextInput
                style={styles.textArea}
                value={coverLetter}
                onChangeText={setCoverLetter}
                multiline
                numberOfLines={10}
                placeholder={`Dear Hiring Team,\n\nI am excited to apply for the ${job.title} position at ${job.employer?.companyName}…`}
                placeholderTextColor={COLORS.textMuted}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{coverLetter.length} characters</Text>
            </View>

            {/* Custom CV */}
            <Text style={styles.sectionLabel}>Submit a different CV?</Text>
            <TouchableOpacity style={[styles.cvPicker, SHADOWS.sm]} onPress={pickCV}>
              <Ionicons
                name={customCV ? 'document-attach' : 'cloud-upload-outline'}
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.cvPickerText}>
                {customCV ? customCV.name : 'Upload a different PDF'}
              </Text>
              {customCV && (
                <TouchableOpacity onPress={() => { setCustomCV(null); setUseCustomCV(false); }}>
                  <Ionicons name="close-circle" size={18} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <Button
              title="Review & Submit"
              onPress={() => setStep(3)}
              style={{ marginTop: SPACING.base }}
              icon={<Ionicons name="arrow-forward" size={18} color="#fff" />}
              iconPosition="right"
            />
            <Button
              variant="ghost"
              title="Skip cover letter"
              onPress={() => setStep(3)}
              style={{ marginTop: 8 }}
            />
          </View>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Confirm Application</Text>
            <Text style={styles.stepDesc}>
              Review the details below before submitting.
            </Text>

            <View style={[styles.confirmCard, SHADOWS.sm]}>
              <Row label="Applying for" value={job.title} styles={styles} />
              <Row label="Company" value={job.employer?.companyName} styles={styles} />
              <Row label="Your Name" value={user?.fullName} styles={styles} />
              <Row label="Cover Letter" value={coverLetter ? `${coverLetter.length} characters` : 'None'} styles={styles} />
              <Row label="CV" value={customCV ? customCV.name : (user?.cv ? 'Profile CV' : 'None')} styles={styles} />
            </View>

            <Button
              title="Submit Application"
              onPress={handleSubmit}
              loading={loading}
              style={{ marginTop: SPACING.xl }}
              icon={<Ionicons name="send-outline" size={16} color="#fff" />}
              iconPosition="right"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const Row = ({ label, value, styles }) => (
  <View style={styles.confirmRow}>
    <Text style={styles.confirmLabel}>{label}</Text>
    <Text style={styles.confirmValue}>{value || '—'}</Text>
  </View>
);

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  progressDotDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  progressNum: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  progressLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginHorizontal: 4 },
  progressLineDone: { backgroundColor: COLORS.success },
  body: { padding: SPACING.base, paddingBottom: 48 },
  stepTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xl, color: COLORS.textPrimary, marginBottom: 6 },
  stepDesc: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginBottom: SPACING.lg, lineHeight: 20 },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
  },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  profileName: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.textPrimary },
  profileUni: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  profileDept: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  profileBio: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary + '12',
  },
  skillPillText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.xs, color: COLORS.primary },
  cvCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  cvTitle: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.base, color: COLORS.textPrimary },
  cvSub: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  textAreaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
  },
  textArea: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    minHeight: 180,
    lineHeight: 24,
  },
  charCount: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted, textAlign: 'right', marginTop: 8 },
  sectionLabel: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 8 },
  cvPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    gap: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.primary + '50',
  },
  cvPickerText: { flex: 1, fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  confirmCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    gap: 12,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  confirmLabel: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, flex: 1 },
  confirmValue: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, flex: 2, textAlign: 'right' },
  // Success
  successContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: SPACING.xl },
  successContent: { alignItems: 'center' },
  successIcon: { marginBottom: SPACING.xl },
  successTitle: { fontFamily: FONTS.displayBold, fontSize: FONT_SIZES['3xl'], color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.base },
  successMessage: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.base, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: SPACING.sm },
  successSub: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: SPACING.xl },
  successActions: { width: '100%', marginTop: SPACING.sm },
});

export default ApplyScreen;
