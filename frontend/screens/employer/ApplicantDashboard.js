import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { formatRelativeDate, getStatusConfig } from '../../utils/helpers';

const STATUS_ACTIONS = [
  { id: 'viewed', label: 'Mark Viewed', color: '#8B5CF6' },
  { id: 'shortlisted', label: 'Shortlist', color: '#F59E0B' },
  { id: 'interview', label: 'Interview', color: '#F59E0B' },
  { id: 'offered', label: 'Send Offer', color: '#10B981' },
  { id: 'rejected', label: 'Reject', color: '#EF4444' },
];

const handleViewCV = async (cvUrl) => {
  if (!cvUrl) return;
  try {
    const canOpen = await Linking.canOpenURL(cvUrl);
    if (canOpen) {
      await Linking.openURL(cvUrl);
    } else {
      Alert.alert('Cannot Open File', 'Unable to open the CV. Please try again later.');
    }
  } catch (err) {
    Alert.alert('Error', 'Could not open the CV file.');
  }
};

const ApplicantCard = ({ application, onStatusChange, onMessage, styles, COLORS, SHADOWS }) => {
  const student = application.student;
  const statusConfig = getStatusConfig(application.status);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, SHADOWS.card]}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.85}>
        <View style={styles.cardHeader}>
          <Avatar uri={student?.avatar} name={student?.fullName} size={48} />
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student?.fullName}</Text>
            <Text style={styles.studentUni} numberOfLines={1}>
              {student?.university} · {student?.department}
            </Text>
            <Text style={styles.studentYear}>{student?.yearOfStudy}</Text>
          </View>
          <View style={styles.cardRight}>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
            </View>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={COLORS.textMuted}
              style={{ marginTop: 4 }}
            />
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          {/* Skills */}
          {student?.skills?.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.expandLabel}>Skills</Text>
              <View style={styles.skillsWrap}>
                {student.skills.slice(0, 6).map((s, i) => (
                  <View key={i} style={styles.skillPill}>
                    <Text style={styles.skillText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Cover letter */}
          {application.coverLetter && (
            <View style={styles.coverSection}>
              <Text style={styles.expandLabel}>Cover Letter</Text>
              <Text style={styles.coverText} numberOfLines={4}>{application.coverLetter}</Text>
            </View>
          )}

          {/* CV */}
          {application.cv && (
            <TouchableOpacity style={styles.cvRow} onPress={() => handleViewCV(application.cv)}>
              <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
              <Text style={styles.cvLink}>View CV / Resume</Text>
              <Ionicons name="open-outline" size={14} color={COLORS.primary} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          )}

          <Text style={styles.appliedDate}>Applied {formatRelativeDate(application.createdAt)}</Text>

          {/* Actions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsScroll}>
            {STATUS_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionBtn,
                  { borderColor: action.color },
                  application.status === action.id && { backgroundColor: action.color },
                ]}
                onPress={() => onStatusChange(application._id, action.id)}
              >
                <Text
                  style={[
                    styles.actionBtnText,
                    { color: application.status === action.id ? '#fff' : action.color },
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Message */}
          <TouchableOpacity style={styles.messageBtn} onPress={() => onMessage(student)}>
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.primary} />
            <Text style={styles.messageBtnText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const ApplicantDashboard = ({ route, navigation }) => {
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  const { jobId, initialFilter } = route.params || {};
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(initialFilter || 'all');

  useEffect(() => { fetchApplications(); }, [jobId]);

  const fetchApplications = async () => {
    try {
      const url = jobId ? ENDPOINTS.APPLICATIONS.JOB_APPLICANTS(jobId) : ENDPOINTS.APPLICATIONS.EMPLOYER_APPLICANTS;
      const res = await api.get(url);
      setApplications(res.data.data || []);
    } catch (err) {
      console.error('Fetch applicants error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.patch(ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId), { status: newStatus });
      setApplications(prev =>
        prev.map(a => a._id === applicationId ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      Alert.alert('Error', 'Could not update status.');
    }
  };

  const handleMessage = async (student) => {
    try {
      const res = await api.post(ENDPOINTS.MESSAGES.START, { recipientId: student._id });
      navigation.navigate('Conversation', { conversationId: res.data.data._id });
    } catch (err) {
      Alert.alert('Error', 'Could not start conversation.');
    }
  };

  const filtered = filterStatus === 'all'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const statusCounts = STATUS_ACTIONS.reduce((acc, s) => {
    acc[s.id] = applications.filter(a => a.status === s.id).length;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Header title="Applicants" onBack={() => navigation.goBack()} subtitle={jobId ? undefined : 'All Jobs'} />

      {/* Filter bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={{ paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm, gap: 8, alignItems: 'center' }}
      >
        <TouchableOpacity
          style={[styles.filterPill, filterStatus === 'all' && styles.filterPillActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
            All ({applications.length})
          </Text>
        </TouchableOpacity>
        {STATUS_ACTIONS.map(s => {
          const count = statusCounts[s.id];
          if (!count) return null;
          const cfg = getStatusConfig(s.id);
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.filterPill, filterStatus === s.id && { backgroundColor: cfg.color, borderColor: cfg.color }]}
              onPress={() => setFilterStatus(s.id)}
            >
              <Text style={[styles.filterText, filterStatus === s.id && { color: '#fff' }]}>
                {cfg.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ApplicantCard
            application={item}
            onStatusChange={handleStatusChange}
            onMessage={handleMessage}
            styles={styles}
            COLORS={COLORS}
            SHADOWS={SHADOWS}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="people-outline"
              title="No applicants yet"
              message="Share your job listing to attract more candidates."
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
      />
    </View>
  );
};


const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  filterBar: { flexGrow: 0, flexShrink: 0, minHeight: 64, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  filterTextActive: { color: '#fff' },
  list: { padding: SPACING.base, paddingBottom: 90 },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base, gap: 12 },
  studentInfo: { flex: 1 },
  studentName: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.base, color: COLORS.textPrimary },
  studentUni: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginTop: 2 },
  studentYear: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  cardRight: { alignItems: 'flex-end' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },
  statusText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.xs },
  expandedContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  expandLabel: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 8 },
  skillsSection: { marginBottom: SPACING.sm },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.primary + '12' },
  skillText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.xs, color: COLORS.primaryText },
  coverSection: { marginBottom: SPACING.sm },
  coverText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  cvRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
  cvLink: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.primaryText },
  appliedDate: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginBottom: SPACING.sm },
  actionsScroll: { marginBottom: SPACING.sm },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: BORDER_RADIUS.full, borderWidth: 1.5, marginRight: 8 },
  actionBtnText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.xs },
  messageBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.borderLight, marginTop: 4 },
  messageBtnText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.primaryText },
});

export default ApplicantDashboard;
