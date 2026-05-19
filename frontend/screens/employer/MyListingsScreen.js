import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { getDeadlineStatus } from '../../utils/helpers';

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

const MyListingsScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get(ENDPOINTS.JOBS.MY_LISTINGS);
      setListings(res.data.data || []);
    } catch (err) {
      console.error('Fetch my listings error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      await api.patch(ENDPOINTS.JOBS.TOGGLE_STATUS(job._id));
      setListings(prev => prev.map(j => j._id === job._id ? { ...j, isActive: !j.isActive } : j));
    } catch (err) { console.error('Toggle status error:', err); }
  };

  return (
    <View style={styles.container}>
      <Header title="My Listings" onBack={() => navigation.goBack()} />
      <FlatList
        data={listings}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <JobListingRow
            job={item}
            onPress={() => navigation.navigate('ApplicantDashboard', { jobId: item._id })}
            onToggle={handleToggleStatus}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={COLORS.accent} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="briefcase-outline"
              title="No listings yet"
              message="Post your first job to start receiving applications."
            />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.base, paddingBottom: 80 },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
  },
  jobRowLeft: { flex: 1, marginRight: SPACING.sm },
  jobRowTitle: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.base, color: COLORS.textPrimary, marginBottom: 4 },
  jobRowMeta: { flexDirection: 'row', alignItems: 'center' },
  deadlineText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.xs },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.textMuted, marginHorizontal: 6 },
  applicantsText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  jobRowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },
  statusPillText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.xs },
  toggleBtn: { padding: 4 },
});

export default MyListingsScreen;
