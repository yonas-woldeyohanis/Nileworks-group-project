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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ENDPOINTS } from '../../constants/endpoints';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { formatRelativeDate, getDeadlineStatus } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const StatCard = ({ label, value, icon, color, onPress }) => (
  <TouchableOpacity style={[styles.statCard, SHADOWS.sm]} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>
);

const JobListingRow = ({ job, onPress, onToggle }) => {
  const deadline = getDeadlineStatus(job.deadline);
  return (
    <TouchableOpacity style={[styles.jobRow, SHADOWS.sm]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.jobRowLeft}>
        <Text style={styles.jobRowTitle} numberOfLines={1}>{job.title}</Text>
        <View style={styles.jobRowMeta}>
          <Text style={[styles.deadlineText, { color: deadline.color }]}>{deadline.label}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.applicantsText}>{job.applicantsCount || 0} applicants</Text>
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
  );
};

const EmployerHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
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
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatCard label="Active Jobs" value={analytics.totalJobs} icon="briefcase-outline" color={COLORS.primary} onPress={() => navigation.navigate('MyListings')} />
        <StatCard label="Total Applicants" value={analytics.totalApplicants} icon="people-outline" color={COLORS.accent} onPress={() => navigation.navigate('ApplicantDashboard')} />
        <StatCard label="Shortlisted" value={analytics.shortlisted} icon="star-outline" color="#F59E0B" onPress={() => navigation.navigate('ApplicantDashboard')} />
        <StatCard label="Offers Sent" value={analytics.offers} icon="trophy-outline" color={COLORS.success} />
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
          listings.slice(0, 5).map((job) => (
            <JobListingRow
              key={job._id}
              job={job}
              onPress={() => navigation.navigate('ApplicantDashboard', { jobId: job._id })}
              onToggle={handleToggleStatus}
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

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 18,
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
  postJobText: { flex: 1, fontFamily: FONTS.bold, fontSize: FONT_SIZES.base, color: COLORS.primary },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.base,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border + '50',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: { fontFamily: FONTS.bold, fontSize: FONT_SIZES['2xl'], color: COLORS.textPrimary },
  statLabel: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
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
  sectionAction: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.primary },
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
  viewAllText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.primary },
});

export default EmployerHomeScreen;
