import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import { JobCardSkeleton } from '../../components/common/SkeletonLoader';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { getJobTypeBadge, getDeadlineStatus, formatDate } from '../../utils/helpers';

const JobDetailScreen = ({ route, navigation }) => {
  const { jobId, isApplied } = route.params;
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  const insets = useSafeAreaInsets();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const bookmarkScale = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await api.get(ENDPOINTS.JOBS.DETAIL(jobId));
      setJob(res.data.data);
      setSaved(res.data.data.isSaved);
    } catch (err) {
      Alert.alert('Error', 'Could not load job details.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Spring pop animation
    Animated.sequence([
      Animated.spring(bookmarkScale, { toValue: 1.4, friction: 5, useNativeDriver: true }),
      Animated.spring(bookmarkScale, { toValue: 1, friction: 5, useNativeDriver: true })
    ]).start();
    
    try {
      if (saved) {
        await api.delete(ENDPOINTS.JOBS.UNSAVE(jobId));
      } else {
        await api.post(ENDPOINTS.JOBS.SAVE(jobId));
      }
      setSaved(!saved);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const bookmarkStyle = {
    transform: [{ scale: bookmarkScale }],
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingHeader} />
        <View style={{ padding: SPACING.base }}>
          <JobCardSkeleton />
        </View>
      </View>
    );
  }

  if (!job) return null;

  const typeBadge = getJobTypeBadge(job.jobType);
  const deadline = getDeadlineStatus(job.deadline);

  return (
    <View style={styles.container}>
      {/* Hero header */}
      <LinearGradient colors={COLORS.gradientHero} style={[styles.hero, { paddingTop: insets.top + 12 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.heroNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Animated.View style={bookmarkStyle}>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={saved ? COLORS.accent : '#fff'}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Company identity */}
        <View style={styles.companySection}>
          {job.employer?.logo ? (
            <Image source={{ uri: job.employer.logo }} style={styles.companyLogo} resizeMode="contain" />
          ) : (
            <Avatar name={job.employer?.companyName} size={64} borderRadius={16} />
          )}
          <Text style={styles.heroJobTitle}>{job.title}</Text>
          <Text style={styles.heroCompany}>{job.employer?.companyName}</Text>
          <View style={styles.heroMeta}>
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.heroMetaText}>{job.location}</Text>
            {job.salary && (
              <>
                <View style={styles.heroDot} />
                <Ionicons name="cash-outline" size={13} color="rgba(255,255,255,0.7)" />
                <Text style={styles.heroMetaText}>{job.salary}</Text>
              </>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Floating stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, SHADOWS.sm]}>
          <Text style={styles.statValue}>{job.openings || 1}</Text>
          <Text style={styles.statLabel}>Openings</Text>
        </View>
        <View style={[styles.statCard, SHADOWS.sm]}>
          <Text style={[styles.statValue, { color: deadline.color }]}>{deadline.label}</Text>
          <Text style={styles.statLabel}>Deadline</Text>
        </View>
        <View style={[styles.statCard, SHADOWS.sm]}>
          <Text style={styles.statValue}>{job.applicantsCount || 0}</Text>
          <Text style={styles.statLabel}>Applicants</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
      >
        {/* Badges */}
        <View style={styles.badgeRow}>
          <Badge label={typeBadge.label} bg={typeBadge.bg} color={typeBadge.text} size="md" />
          {job.industry && (
            <Badge label={job.industry} bg={COLORS.borderLight} color={COLORS.textSecondary} size="md" style={{ marginLeft: 8 }} />
          )}
          {job.isPaid === false && (
            <Badge label="Unpaid" bg={COLORS.warningLight} color={COLORS.warning} size="md" style={{ marginLeft: 8 }} />
          )}
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>About the Role</Text>
        <Text style={styles.description}>{job.description}</Text>

        {/* Required Skills */}
        {job.skills?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Required Skills</Text>
            <View style={styles.skillsWrap}>
              {job.skills.map((skill, i) => (
                <View key={i} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Posted date */}
        <Text style={styles.postedDate}>
          Posted {formatDate(job.createdAt, 'MMMM dd, yyyy')}
        </Text>

        {/* Bottom padding for button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Apply button */}
      <View style={[styles.applyBar, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          title={isApplied ? "Already Applied" : "Apply Now"}
          onPress={() => navigation.navigate('Apply', { job })}
          icon={<Ionicons name={isApplied ? "checkmark-circle" : "send-outline"} size={16} color="#fff" />}
          iconPosition="right"
          disabled={isApplied}
        />
      </View>
    </View>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingHeader: { height: 220, backgroundColor: COLORS.primary },
  hero: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 30,
  },
  heroNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companySection: { alignItems: 'center' },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  heroJobTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES['2xl'],
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  heroCompany: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 10,
  },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  heroDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.base,
    marginTop: -20,
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border + '50',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  body: { paddingHorizontal: SPACING.base },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.lg },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.base,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary + '12',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  skillText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
  postedDate: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },
  applyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
});

export default JobDetailScreen;
