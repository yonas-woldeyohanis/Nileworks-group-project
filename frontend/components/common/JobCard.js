import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Badge from './Badge';
import Avatar from './Avatar';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { BORDER_RADIUS, SPACING } from '../../constants/layout';
import { getJobTypeBadge, getDeadlineStatus, truncateText } from '../../utils/helpers';

const JobCard = ({ job, onPress, onSave, index = 0, compact = false }) => {
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  const typeBadge = getJobTypeBadge(job.jobType);
  const deadline = getDeadlineStatus(job.deadline);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => onPress?.(job)}
        activeOpacity={0.92}
        style={[styles.card, SHADOWS.card]}
      >
        {/* Featured banner */}
        {job.isFeatured && (
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.featuredBanner}
          >
            <Ionicons name="star" size={10} color="#fff" />
            <Text style={styles.featuredText}>Featured</Text>
          </LinearGradient>
        )}

        <View style={styles.header}>
          {/* Company Logo */}
          <View style={styles.logoContainer}>
            {job.employer?.logo ? (
              <Image
                source={{ uri: job.employer.logo }}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <Avatar
                name={job.employer?.companyName || 'Co'}
                size={48}
                borderRadius={14}
              />
            )}
          </View>

          <View style={styles.headerText}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={styles.companyName} numberOfLines={1}>
              {job.employer?.companyName}
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, job.isSaved && styles.saveBtnActive]}
            onPress={() => onSave?.(job)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={job.isSaved ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={job.isSaved ? COLORS.accent : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Location row */}
        <View style={styles.locationRow}>
          <View style={styles.locationIconBg}>
            <Ionicons name="location-outline" size={11} color={COLORS.primary} />
          </View>
          <Text style={styles.locationText}>{job.location || 'Remote'}</Text>
          {job.salary && (
            <>
              <View style={styles.dot} />
              <Ionicons name="cash-outline" size={11} color={COLORS.success} style={{ marginRight: 3 }} />
              <Text style={styles.salaryText}>{job.salary}</Text>
            </>
          )}
        </View>

        {!compact && (
          <Text style={styles.description} numberOfLines={2}>
            {truncateText(job.description, 100)}
          </Text>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.badges}>
            <Badge label={typeBadge.label} bg={typeBadge.bg} color={typeBadge.text} />
            {job.skills?.slice(0, 2).map((skill, i) => (
              <Badge
                key={i}
                label={skill}
                bg={COLORS.borderLight}
                color={COLORS.textSecondary}
                style={{ marginLeft: 6 }}
              />
            ))}
          </View>
          <View style={[styles.deadlineBadge, { backgroundColor: deadline.color + '15' }]}>
            {deadline.urgent && (
              <Ionicons name="time-outline" size={11} color={deadline.color} style={{ marginRight: 3 }} />
            )}
            <Text style={[styles.deadlineText, { color: deadline.color }]}>
              {deadline.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.base,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border + '60',
  },
  featuredBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomLeftRadius: 14,
  },
  featuredText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
    color: '#fff',
    marginLeft: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.borderLight,
  },
  headerText: { flex: 1 },
  jobTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  companyName: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnActive: {
    backgroundColor: COLORS.accent + '15',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationIconBg: {
    width: 18,
    height: 18,
    borderRadius: 6,
    backgroundColor: COLORS.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  locationText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: 8,
  },
  salaryText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border + '50',
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badges: { flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap' },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  deadlineText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
  },
});

export default JobCard;
