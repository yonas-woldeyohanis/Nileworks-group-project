import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import JobCard from '../../components/common/JobCard';
import { JobCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';

const JOB_TYPES = ['internship', 'part-time', 'full-time', 'remote'];
const CITIES = ['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle', 'Adama', 'Jimma', 'Remote'];
const SORT_OPTIONS = [
  { id: 'createdAt', label: 'Most Recent' },
  { id: 'relevance', label: 'Most Relevant' },
  { id: 'deadline', label: 'Deadline Soon' },
];

const FilterChip = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.filterChip, active && styles.filterChipActive]}
  >
    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
  </Pressable>
);

const SearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobTypes: [],
    locations: [],
    sortBy: 'createdAt',
    paidOnly: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2 || Object.values(filters).some(v => v?.length > 0)) {
        doSearch();
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, filters]);

  const doSearch = async () => {
    setLoading(true);
    try {
      const params = { q: query, ...filters };
      if (filters.jobTypes.length) params.jobType = filters.jobTypes.join(',');
      if (filters.locations.length) params.location = filters.locations.join(',');
      const res = await api.get(ENDPOINTS.JOBS.SEARCH, { params });
      setResults(res.data.data.jobs || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const activeFilterCount =
    filters.jobTypes.length + filters.locations.length + (filters.paidOnly ? 1 : 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={[styles.searchBar, SHADOWS.sm]}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search jobs, skills, companies…"
            placeholderTextColor={COLORS.textMuted}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={doSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={18} color={activeFilterCount > 0 ? '#fff' : COLORS.primary} />
          {activeFilterCount > 0 && (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      <FlatList
        data={loading ? [] : results}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <JobCard
            job={item}
            index={index}
            onPress={(job) => navigation.navigate('JobDetail', { jobId: job._id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          loading ? (
            <View>
              {[1, 2, 3].map((i) => <JobCardSkeleton key={i} />)}
            </View>
          ) : query.length < 2 ? (
            <EmptyState
              icon="search-outline"
              title="Start searching"
              message="Type a job title, skill, or company name to begin."
            />
          ) : (
            <EmptyState
              icon="briefcase-outline"
              title="No results found"
              message={`No jobs match "${query}". Try different keywords or adjust filters.`}
            />
          )
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.filterModal}>
          <View style={styles.filterModalHeader}>
            <Text style={styles.filterModalTitle}>Filter Jobs</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <Text style={styles.filterSection}>Job Type</Text>
            <View style={styles.chipRow}>
              {JOB_TYPES.map((type) => (
                <FilterChip
                  key={type}
                  label={type.replace('-', ' ')}
                  active={filters.jobTypes.includes(type)}
                  onPress={() => toggleFilter('jobTypes', type)}
                />
              ))}
            </View>

            <Text style={styles.filterSection}>Location</Text>
            <View style={styles.chipRow}>
              {CITIES.map((city) => (
                <FilterChip
                  key={city}
                  label={city}
                  active={filters.locations.includes(city)}
                  onPress={() => toggleFilter('locations', city)}
                />
              ))}
            </View>

            <Text style={styles.filterSection}>Sort By</Text>
            <View style={styles.chipRow}>
              {SORT_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.id}
                  label={opt.label}
                  active={filters.sortBy === opt.id}
                  onPress={() => setFilters((f) => ({ ...f, sortBy: opt.id }))}
                />
              ))}
            </View>

            <View style={styles.paidToggle}>
              <Text style={styles.paidLabel}>Paid positions only</Text>
              <Pressable
                onPress={() => setFilters((f) => ({ ...f, paidOnly: !f.paidOnly }))}
                style={[styles.toggle, filters.paidOnly && styles.toggleActive]}
              >
                <View style={[styles.toggleThumb, filters.paidOnly && styles.toggleThumbActive]} />
              </Pressable>
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <Button
              variant="outline"
              title="Clear All"
              onPress={() => setFilters({ jobTypes: [], locations: [], sortBy: 'createdAt', paidOnly: false })}
              fullWidth={false}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title={`Apply${activeFilterCount ? ` (${activeFilterCount})` : ''}`}
              onPress={() => setShowFilters(false)}
              fullWidth={false}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBtnActive: { backgroundColor: COLORS.primary },
  filterCount: {
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
  filterCountText: { fontFamily: FONTS.bold, fontSize: 8, color: '#fff' },
  listContent: { padding: SPACING.base, paddingBottom: 80 },
  // Filter modal
  filterModal: { flex: 1, backgroundColor: COLORS.surface, padding: SPACING.base },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.base,
  },
  filterModalTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
  },
  filterSection: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  filterChipTextActive: { color: '#fff' },
  paidToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  paidLabel: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.base, color: COLORS.textPrimary },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    ...SHADOWS.sm,
  },
  toggleThumbActive: { alignSelf: 'flex-end' },
  filterActions: {
    flexDirection: 'row',
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.xl,
  },
});

export default SearchScreen;
