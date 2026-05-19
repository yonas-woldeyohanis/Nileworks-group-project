import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { getStatusConfig, formatRelativeDate } from '../../utils/helpers';

const STATUSES = [
  { id: 'applied', label: 'Applied', icon: 'send-outline' },
  { id: 'viewed', label: 'Viewed', icon: 'eye-outline' },
  { id: 'shortlisted', label: 'Shortlisted', icon: 'star-outline' },
  { id: 'interview', label: 'Interview', icon: 'calendar-outline' },
  { id: 'offered', label: 'Offered', icon: 'trophy-outline' },
  { id: 'rejected', label: 'Rejected', icon: 'close-circle-outline' },
];

const ApplicationCard = ({ application, onPress, index }) => {
  const statusConfig = getStatusConfig(application.status);

  const handlePressIn = () => {};
  const handlePressOut = () => {};

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[styles.appCard, SHADOWS.card]}
      >
        {/* Status indicator line */}
        <View style={[styles.statusLine, { backgroundColor: statusConfig.color }]} />

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            {application.job?.employer?.logo ? (
              <Image source={{ uri: application.job.employer.logo }} style={styles.companyLogo} resizeMode="contain" />
            ) : (
              <Avatar name={application.job?.employer?.companyName} size={44} borderRadius={12} />
            )}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.jobTitle} numberOfLines={1}>{application.job?.title}</Text>
              <Text style={styles.companyName}>{application.job?.employer?.companyName}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
            <Text style={styles.dateText}>{formatRelativeDate(application.createdAt)}</Text>
          </View>

          {application.lastMessage && (
            <View style={styles.messagePreview}>
              <Ionicons name="chatbubble-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.messageText} numberOfLines={1}>{application.lastMessage}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ApplicationTrackerScreen = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get(ENDPOINTS.APPLICATIONS.MY_APPLICATIONS);
      setApplications(res.data.data || []);
    } catch (err) {
      console.error('Fetch applications error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filtered = selectedStatus === 'all'
    ? applications
    : applications.filter((a) => a.status === selectedStatus);

  const getCountForStatus = (statusId) =>
    applications.filter((a) => a.status === statusId).length;

  return (
    <View style={styles.container}>
      <Header title="My Applications" />

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{applications.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: COLORS.success }]}>
            {getCountForStatus('offered')}
          </Text>
          <Text style={styles.summaryLabel}>Offers</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: COLORS.warning }]}>
            {getCountForStatus('interview')}
          </Text>
          <Text style={styles.summaryLabel}>Interviews</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: COLORS.statusViewed }]}>
            {getCountForStatus('viewed')}
          </Text>
          <Text style={styles.summaryLabel}>Viewed</Text>
        </View>
      </View>

      {/* Status filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={{ paddingHorizontal: SPACING.base, gap: 8 }}
      >
        <TouchableOpacity
          style={[styles.filterPill, selectedStatus === 'all' && styles.filterPillActive]}
          onPress={() => setSelectedStatus('all')}
        >
          <Text style={[styles.filterPillText, selectedStatus === 'all' && styles.filterPillTextActive]}>
            All ({applications.length})
          </Text>
        </TouchableOpacity>
        {STATUSES.map((s) => {
          const count = getCountForStatus(s.id);
          if (count === 0) return null;
          const config = getStatusConfig(s.id);
          return (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.filterPill,
                selectedStatus === s.id && { backgroundColor: config.color, borderColor: config.color },
              ]}
              onPress={() => setSelectedStatus(s.id)}
            >
              <Text style={[
                styles.filterPillText,
                selectedStatus === s.id && { color: '#fff' },
              ]}>
                {s.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Applications list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchApplications(); }} tintColor={COLORS.accent} />
        }
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading applications…</Text>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="document-outline"
            title="No applications yet"
            message="Start applying to jobs and your applications will appear here."
            actionLabel="Browse Jobs"
            onAction={() => navigation.navigate('Home')}
          />
        ) : (
          filtered.map((app, index) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onPress={() => navigation.navigate('JobDetail', { jobId: app.job?._id })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
  },
  summaryNumber: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.primary,
  },
  summaryLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  filterScroll: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterPillText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  filterPillTextActive: { color: '#fff' },
  listContent: { padding: SPACING.base, paddingBottom: 90 },
  appCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border + '50',
    ...SHADOWS.card,
  },
  statusLine: { width: 4, minHeight: 80 },
  cardContent: { flex: 1, padding: SPACING.base },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  companyLogo: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.borderLight },
  jobTitle: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.base, color: COLORS.textPrimary },
  companyName: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginTop: 2 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.xs },
  dateText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 5,
  },
  messageText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted, flex: 1 },
  loadingText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.base, color: COLORS.textMuted, textAlign: 'center', padding: 40 },
});

export default ApplicationTrackerScreen;
