import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import AnimatedGlowBorder from '../../components/common/AnimatedGlowBorder';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ENDPOINTS } from '../../constants/endpoints';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { formatRelativeDate, getDeadlineStatus, getJobTypeBadge } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const HeroStatCard = ({ label, value, icon, onPress, styles, COLORS, SHADOWS }) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const floatY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -8, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.96, friction: 5, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity style={[styles.heroStatCard, SHADOWS.md]} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.9}>
        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.heroStatGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroStatContent}>
            <View>
              <Text style={styles.heroStatLabel}>{label}</Text>
              <Text style={styles.heroStatValue}>{value}</Text>
            </View>
            <Animated.View style={[styles.heroStatIcon, { transform: [{ translateY: floatY }] }]}>
              <Ionicons name={icon} size={32} color="#fff" />
            </Animated.View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MiniStatCard = ({ label, value, icon, color, onPress, styles, SHADOWS }) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.spring(scale, { toValue: 0.94, friction: 5, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity style={[styles.miniStatCard, SHADOWS.sm]} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.85}>
        <View style={[styles.miniStatIcon, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View>
          <Text style={styles.miniStatValue}>{value}</Text>
          <Text style={styles.miniStatLabel} numberOfLines={1}>{label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const JobListingRow = ({ job, index, onPress, onToggle, styles, COLORS, SHADOWS }) => {
  const deadline = getDeadlineStatus(job.deadline);
  const typeBadge = getJobTypeBadge(job.jobType);
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 6, useNativeDriver: true })
      ])
    ]).start();
  }, [index, opacity, translateY]);

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, friction: 5, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY }], opacity }}>
      <TouchableOpacity style={[styles.jobRow, SHADOWS.sm]} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.85}>
      <View style={styles.jobRowLeft}>
        <Text style={styles.jobRowTitle} numberOfLines={1}>{job.title}</Text>
        <View style={styles.jobRowMeta}>
          <Text style={[styles.deadlineText, { color: deadline.color }]}>{deadline.label}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.applicantsText}>{job.applicantsCount || 0} applicants</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 6, gap: 6, alignItems: 'center' }}>
          <Badge label={typeBadge.label} bg={typeBadge.bg} color={typeBadge.text} size="sm" />
          {job.location && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="location-outline" size={12} color={COLORS.textMuted} style={{ marginRight: 2 }} />
              <Text style={{ fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted }}>{job.location}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.jobRowRight}>
        <View style={[styles.statusPill, { backgroundColor: job.isActive ? COLORS.successLight : COLORS.borderLight }]}>
          <Text style={[styles.statusPillText, { color: job.isActive ? COLORS.success : COLORS.textMuted }]}>
            {job.isActive ? 'Active' : 'Paused'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onToggle(job)} style={styles.toggleBtn}>
          <Ionicons name={job.isActive ? 'pause-circle-outline' : 'play-circle-outline'} size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
};

const EmployerHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState({ totalJobs: 0, totalApplicants: 0, shortlisted: 0, offers: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, analyticsRes] = await Promise.all([
        api.get(ENDPOINTS.JOBS.MY_LISTINGS),
        api.get(ENDPOINTS.EMPLOYER.ANALYTICS),
      ]);
      setListings(jobsRes.data.data || []);
      setAnalytics(analyticsRes.data.data || analytics);
    } catch (err) {
      console.error('Employer home fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      await api.patch(ENDPOINTS.JOBS.TOGGLE_STATUS(job._id));
      setListings((prev) =>
        prev.map((j) => (j._id === job._id ? { ...j, isActive: !j.isActive } : j))
      );
    } catch (err) { console.error('Toggle status error:', err); }
  };

  const companyName = user?.companyName || 'your company';

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={COLORS.accent} />
      }
    >
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={COLORS.gradientHero} style={[styles.header, { paddingTop: insets.top + 12 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* Water ripple decorations */}
        <View style={styles.headerRipple1} />
        <View style={styles.headerRipple2} />

        {/* Brand tag */}
        <View style={styles.brandPill}>
          <Ionicons name="water" size={11} color={COLORS.accent} style={{ marginRight: 4 }} />
          <Text style={styles.brandPillText}>NileWorks</Text>
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerGreeting}>Employer Dashboard</Text>
            <Text style={styles.headerCompany}>{companyName}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EmployerProfile')}>
              <Avatar uri={user?.logo} name={companyName} size={40} borderRadius={14} showBorder borderColor="rgba(245,166,35,0.5)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Job CTA */}
        <AnimatedGlowBorder
          colors={[COLORS.accent, COLORS.accentAlt, COLORS.accent]}
          borderRadius={18}
          borderWidth={2}
          style={{ width: '100%', marginTop: SPACING.md }}
        >
          <TouchableOpacity
            style={styles.postJobCTA}
            onPress={() => navigation.navigate('PostJob')}
            activeOpacity={0.9}
          >
            <View style={styles.postJobIconBg}>
              <Ionicons name="add" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.postJobText}>Post a New Job Listing</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </AnimatedGlowBorder>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <HeroStatCard
          label="Active Job Listings"
          value={analytics.totalJobs}
          icon="briefcase"
          onPress={() => navigation.navigate('MyListings')}
          styles={styles}
          COLORS={COLORS}
          SHADOWS={SHADOWS}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.miniStatsScroll}>
          <MiniStatCard label="Total Applicants" value={analytics.totalApplicants} icon="people" color={COLORS.accent} onPress={() => navigation.navigate('ApplicantDashboard')} styles={styles} SHADOWS={SHADOWS} />
          <MiniStatCard label="Shortlisted" value={analytics.shortlisted} icon="star" color="#F59E0B" onPress={() => navigation.navigate('ApplicantDashboard', { initialFilter: 'shortlisted' })} styles={styles} SHADOWS={SHADOWS} />
          <MiniStatCard label="Offers Sent" value={analytics.offers} icon="trophy" color={COLORS.success} onPress={() => navigation.navigate('ApplicantDashboard', { initialFilter: 'offered' })} styles={styles} SHADOWS={SHADOWS} />
        </ScrollView>
      </View>

      {/* My Listings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PostJob')}>
            <Text style={styles.sectionAction}>+ Post New</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading…</Text>
        ) : listings.length === 0 ? (
          <View style={styles.emptyListings}>
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptyDesc}>Post your first job to start receiving applications from Ethiopian students.</Text>
            <Button title="Post a Job" onPress={() => navigation.navigate('PostJob')} style={{ marginTop: SPACING.base }} />
          </View>
        ) : (
          listings.slice(0, 5).map((job, index) => (
            <JobListingRow
              key={job._id}
              job={job}
              index={index}
              onPress={() => navigation.navigate('ApplicantDashboard', { jobId: job._id })}
              onToggle={handleToggleStatus}
              styles={styles}
              COLORS={COLORS}
              SHADOWS={SHADOWS}
            />
          ))
        )}

        {listings.length > 5 && (
          <TouchableOpacity style={styles.viewAll} onPress={() => navigation.navigate('MyListings')}>
            <Text style={styles.viewAllText}>View all {listings.length} listings</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  headerRipple1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.08)',
    top: -width * 0.3,
    right: -width * 0.25,
  },
  headerRipple2: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    borderWidth: 1.5,
    borderColor: 'rgba(42,82,152,0.25)',
    top: -width * 0.1,
    right: -width * 0.1,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,166,35,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  brandPillText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    zIndex: 1,
  },
  headerGreeting: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.65)', marginBottom: 2 },
  headerCompany: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xl, color: '#fff' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postJobCTA: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    padding: SPACING.base,
    gap: 10,
    zIndex: 1,
  },
  postJobIconBg: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(27,58,107,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postJobText: { flex: 1, fontFamily: FONTS.bold, fontSize: FONT_SIZES.base, color: COLORS.primaryText },
  
  statsContainer: {
    paddingVertical: SPACING.base,
  },
  heroStatCard: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroStatGradient: {
    padding: SPACING.xl,
  },
  heroStatContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStatLabel: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  heroStatValue: { fontFamily: FONTS.bold, fontSize: 36, color: '#fff' },
  heroStatIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  miniStatsScroll: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  miniStatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: 20,
    minWidth: 160,
    borderWidth: 1,
    borderColor: COLORS.border + '50',
    gap: 12,
  },
  miniStatIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniStatValue: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xl, color: COLORS.textPrimary },
  miniStatLabel: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  
  section: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.textPrimary },
  sectionAction: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.primaryText },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border + '50',
  },
  jobRowLeft: { flex: 1, marginRight: SPACING.sm },
  jobRowTitle: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.base, color: COLORS.textPrimary, marginBottom: 4 },
  jobRowMeta: { flexDirection: 'row', alignItems: 'center' },
  deadlineText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.xs },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.textMuted, marginHorizontal: 6 },
  applicantsText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  jobRowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  statusPillText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.xs },
  toggleBtn: { padding: 4 },
  loadingText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.base, color: COLORS.textMuted, textAlign: 'center', padding: SPACING.xl },
  emptyListings: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.textPrimary, marginBottom: 8 },
  emptyDesc: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  viewAll: { alignItems: 'center', paddingVertical: SPACING.sm },
  viewAllText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.primaryText },
});

export default EmployerHomeScreen;
