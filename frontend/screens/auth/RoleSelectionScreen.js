import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/common/Button';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { BORDER_RADIUS, SPACING } from '../../constants/layout';

const { width } = Dimensions.get('window');

const ROLES = [
  {
    id: 'student',
    title: "I'm a Student",
    subtitle: 'Find internships, part-time & full-time jobs',
    icon: 'school-outline',
    accentIcon: 'briefcase-outline',
    gradient: [COLORS.primary, COLORS.primaryLight],
    features: ['Browse 100s of listings', 'Track applications', 'Get matched to jobs'],
  },
  {
    id: 'employer',
    title: "I'm an Employer",
    subtitle: 'Post jobs and find qualified Ethiopian talent',
    icon: 'business-outline',
    accentIcon: 'people-outline',
    gradient: ['#1A1A2E', '#2D3561'],
    features: ['Post job listings', 'Review applicants', 'Manage pipeline'],
  },
];

const RoleCard = ({ role, selected, onSelect, index }) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(40)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 150),
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, friction: 6, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true })
      ])
    ]).start();
  }, [index, translateY, opacity]);

  const animatedStyle = {
    transform: [{ translateY }, { scale }],
    opacity,
  };

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, friction: 5, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={() => onSelect(role.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.card,
          SHADOWS.md,
          selected && styles.cardSelected,
        ]}
      >
        {selected && (
          <View style={styles.selectedCheck}>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.accent} />
          </View>
        )}

        <LinearGradient
          colors={role.gradient}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={role.icon} size={28} color="#fff" />
        </LinearGradient>

        <Text style={styles.roleTitle}>{role.title}</Text>
        <Text style={styles.roleSubtitle}>{role.subtitle}</Text>

        <View style={styles.featuresContainer}>
          {role.features.map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    navigation.navigate(selectedRole === 'student' ? 'StudentRegister' : 'EmployerRegister');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoMini}>
          <Ionicons name="water" size={24} color="#fff" />
        </View>
        <View>
          <Text style={styles.headline}>Welcome to NileWorks</Text>
          <Text style={styles.subHeadline}>How will you use the platform?</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ROLES.map((role, index) => (
          <RoleCard
            key={role.id}
            role={role}
            index={index}
            selected={selectedRole === role.id}
            onSelect={setSelectedRole}
          />
        ))}

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          style={{ marginTop: SPACING.lg }}
          icon={<Ionicons name="arrow-forward" size={18} color="#fff" />}
          iconPosition="right"
        />

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginBold}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    gap: 14,
  },
  logoMini: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headline: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.textPrimary,
  },
  subHeadline: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scrollContent: { paddingHorizontal: SPACING.base, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.base,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F4FF',
  },
  selectedCheck: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  roleTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  roleSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
    lineHeight: 20,
  },
  featuresContainer: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginRight: 10,
  },
  featureText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  loginLink: { alignItems: 'center', marginTop: SPACING.xl },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  loginBold: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});

export default RoleSelectionScreen;
