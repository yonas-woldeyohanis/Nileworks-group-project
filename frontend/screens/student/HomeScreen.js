import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import JobCard from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import Avatar from '../../components/common/Avatar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ENDPOINTS } from '../../constants/endpoints';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All Jobs', icon: 'apps-outline' },
  { id: 'internship', label: 'Internship', icon: 'school-outline' },
  { id: 'part-time', label: 'Part-time', icon: 'time-outline' },
  { id: 'full-time', label: 'Full-time', icon: 'briefcase-outline' },
  { id: 'remote', label: 'Remote', icon: 'wifi-outline' },
];

// Wave bottom divider using pure React Native
const NileWave = ({ colors }) => (
  <View style={{
    position: 'absolute',
    bottom: 0,
    left: -width * 0.1,
    right: -width * 0.1,
    height: 48,
    backgroundColor: colors.background,
    borderTopLeftRadius: width * 0.6,
    borderTopRightRadius: width * 0.5,
  }} />
);

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);
  
  const insets = useSafeAreaInsets();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [notifCount, setNotifCount] = useState(0);

  // Wave animation
  const waveAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
    ).start();
  }, []);

  const fetchJobs = useCallback(async (categoryFilter = selectedCategory, pageNum = 1, append = false) => {
    try {
      const params = { page: pageNum, limit: 10 };
      if (categoryFilter !== 'all') params.jobType = categoryFilter;

      const res = await api.get(ENDPOINTS.JOBS.LIST, { params });
      const newJobs = res.data.data.jobs;

      if (append) {
        setJobs((prev) => [...prev, ...newJobs]);
      } else {
        setJobs(newJobs);
      }
      setHasMore(res.data.data.hasMore);
    } catch (err) {
      console.error('Fetch jobs error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      fetchJobs(selectedCategory, 1, false);
    }, [selectedCategory])
  );

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchJobs(selectedCategory, 1, false);
  }, [selectedCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchJobs(selectedCategory, 1, false);

    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      { iterations: 2 }
    ).start(() => spinAnim.setValue(0));
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchJobs(selectedCategory, next, true);
  };

  const handleSave = async (job) => {
    try {
      if (job.isSaved) {
        await api.delete(ENDPOINTS.JOBS.UNSAVE(job._id));
      } else {
        await api.post(ENDPOINTS.JOBS.SAVE(job._id));
      }
      setJobs((prev) =>
        prev.map((j) => (j._id === job._id ? { ...j, isSaved: !j.isSaved } : j))
      );
    } catch (err) {
      console.error('Save job error:', err);
    }
  };

  const firstName = user?.fullName?.split(' ')[0] || user?.contactPersonName?.split(' ')[0] || 'there';

  const [greeting, setGreeting] = useState('Good morning 🌊');

  useFocusEffect(
    React.useCallback(() => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning 🌊');
      else if (hour < 17) setGreeting('Good afternoon ☀️');
      else setGreeting('Good evening 🌙');
    }, [])
  );

  const renderHeader = () => (
    <View>
      {/* Top greeting hero with wave */}
      <LinearGradient
        colors={COLORS.gradientHero}
        style={[styles.greetingBar, { paddingTop: insets.top + 16 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative water ripple circles */}
        <View style={styles.ripple1} />
        <View style={styles.ripple2} />
        <View style={styles.ripple3} />

        {/* Floating droplet accent */}
        <View style={styles.dropletAccent}>
          <Ionicons name="water" size={16} color="rgba(245,166,35,0.6)" />
        </View>

        <View style={styles.greetingContent}>
          <View style={styles.greetingLeft}>
            <View style={styles.greetingTextRow}>
              <Text style={styles.greetingSmall}>{greeting}</Text>
            </View>
            <Text style={styles.greetingName}>Hello, {firstName}</Text>
            <View style={styles.brandRow}>
              <Ionicons name="water" size={12} color={COLORS.accent} style={{ marginRight: 4 }} />
              <Text style={styles.brandTag}>NileWorks</Text>
            </View>
          </View>
          <View style={styles.greetingRight}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {notifCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifCount}>{notifCount > 9 ? '9+' : notifCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Avatar uri={user?.avatar} name={user?.fullName} size={40} showBorder borderColor="rgba(245,166,35,0.5)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nile wave bottom */}
        <NileWave colors={COLORS} />
      </LinearGradient>

      {/* Search bar floating over wave */}
      <View style={styles.searchBarWrapper}>
        <TouchableOpacity
          style={[styles.searchBar, SHADOWS.md]}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.85}
        >
          <View style={styles.searchIconBg}>
            <Ionicons name="search-outline" size={16} color={COLORS.primaryText} />
          </View>
          <Text style={styles.searchPlaceholder}>Search jobs, companies, skills…</Text>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color={COLORS.primaryText} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={{ paddingHorizontal: SPACING.base, paddingBottom: SPACING.sm }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && styles.categoryChipActive,
            ]}
          >
            <Ionicons
              name={cat.icon}
              size={14}
              color={selectedCategory === cat.id ? '#fff' : COLORS.textMuted}
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Latest Opportunities' : `${CATEGORIES.find(c => c.id === selectedCategory)?.label} Jobs`}
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.sectionCount}>{jobs.length} found</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList
        data={loading ? [] : jobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: SPACING.base }}>
            <JobCard
              job={item}
              index={index}
              onPress={(job) => navigation.navigate('JobDetail', { jobId: job._id })}
              onSave={handleSave}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletons}>
              {[1, 2, 3, 4].map((i) => <JobCardSkeleton key={i} />)}
            </View>
          ) : (
            <View style={{ paddingHorizontal: SPACING.base }}>
              <EmptyState
                icon="briefcase-outline"
                title="No jobs found"
                message="Try a different category or check back later."
              />
            </View>
          )
        }
        ListFooterComponent={
          hasMore && !loading ? (
            <TouchableOpacity style={styles.loadMore} onPress={handleLoadMore}>
              <View style={styles.loadMoreInner}>
                <Ionicons name="chevron-down" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.loadMoreText}>Load more</Text>
              </View>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  greetingBar: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 50,
    overflow: 'hidden',
    position: 'relative',
  },
  // Water ripple decorative elements
  ripple1: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.08)',
    top: -width * 0.3,
    right: -width * 0.35,
  },
  ripple2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    borderWidth: 1.5,
    borderColor: 'rgba(42,82,152,0.3)',
    top: -width * 0.15,
    right: -width * 0.2,
  },
  ripple3: {
    position: 'absolute',
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    backgroundColor: 'rgba(42,82,152,0.12)',
    bottom: 20,
    left: -width * 0.08,
  },
  dropletAccent: {
    position: 'absolute',
    top: 60,
    left: '50%',
    marginLeft: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(245,166,35,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    zIndex: 1,
  },
  greetingLeft: {},
  greetingTextRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  greetingSmall: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.65)',
  },
  greetingName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: '#fff',
    marginBottom: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,166,35,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  brandTag: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  greetingRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { position: 'relative' },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifCount: { fontFamily: FONTS.bold, fontSize: 8, color: '#fff' },
  searchBarWrapper: {
    paddingHorizontal: SPACING.base,
    marginTop: -22,
    marginBottom: SPACING.sm,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingHorizontal: SPACING.sm,
    paddingRight: SPACING.base,
    height: 54,
    gap: 10,
  },
  searchIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  categoryScroll: { marginBottom: SPACING.xs },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    ...SHADOWS.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  categoryTextActive: { color: '#fff' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
  },
  countBadge: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sectionCount: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
  },
  listContent: { paddingBottom: 90 },
  skeletons: { paddingHorizontal: SPACING.base },
  loadMore: {
    alignItems: 'center',
    paddingVertical: SPACING.base,
    marginBottom: 20,
  },
  loadMoreInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.primary + '30',
    backgroundColor: COLORS.surface,
  },
  loadMoreText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
});

export default HomeScreen;
