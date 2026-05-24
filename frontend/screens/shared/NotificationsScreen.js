import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { formatRelativeDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const NOTIF_ICONS = {
  application_viewed: { icon: 'eye-outline', color: '#8B5CF6', bg: '#F5F3FF' },
  shortlisted: { icon: 'star-outline', color: '#F59E0B', bg: '#FFFBEB' },
  interview: { icon: 'calendar-outline', color: '#F59E0B', bg: '#FFFBEB' },
  offer: { icon: 'trophy-outline', color: '#10B981', bg: '#ECFDF5' },
  rejected: { icon: 'close-circle-outline', color: '#EF4444', bg: '#FEF2F2' },
  message: { icon: 'chatbubble-outline', color: '#3B82F6', bg: '#EFF6FF' },
  job_match: { icon: 'briefcase-outline', color: '#1B3A6B', bg: '#EFF4FF' },
};

const NotificationItem = ({ notif, onPress, styles, COLORS, SHADOWS }) => {
  const iconConfig = NOTIF_ICONS[notif.type] || { icon: 'notifications-outline', color: COLORS.primary, bg: COLORS.primary + '15' };

  return (
    <TouchableOpacity
      style={[styles.notifCard, !notif.isRead && styles.notifCardUnread, SHADOWS.sm]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.notifIcon, { backgroundColor: iconConfig.bg }]}>
        <Ionicons name={iconConfig.icon} size={20} color={iconConfig.color} />
      </View>
      <View style={styles.notifBody}>
        <Text style={[styles.notifTitle, !notif.isRead && { fontFamily: FONTS.bold }]}>
          {notif.title}
        </Text>
        <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
        <Text style={styles.notifTime}>{formatRelativeDate(notif.createdAt)}</Text>
      </View>
      {!notif.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  const isEmployer = user?.role === 'employer';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(ENDPOINTS.NOTIFICATIONS.LIST);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (_) {}
  };

  const markAllRead = async () => {
    try {
      await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (_) {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItem
            notif={item}
            onPress={() => {
              markRead(item._id);
              if (item.type === 'message') {
                const tab = isEmployer ? 'EmployerMessagesTab' : 'MessagesTab';
                navigation.navigate(tab, { screen: 'Messages' });
              } else if (item.applicationId) {
                if (isEmployer) {
                  navigation.navigate('ApplicantsTab', { screen: 'AllApplicants' });
                } else {
                  navigation.navigate('TrackerTab', { screen: 'ApplicationTracker' });
                }
              }
            }}
            styles={styles}
            COLORS={COLORS}
            SHADOWS={SHADOWS}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="notifications-outline"
              title="All caught up!"
              message="You have no notifications. Apply to jobs to start receiving updates."
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchNotifications(); }}
            tintColor={COLORS.accent}
          />
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
      />
    </View>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.base, paddingBottom: 90 },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  notifCardUnread: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  notifBody: { flex: 1 },
  notifTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  notifMessage: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 6,
  },
  notifTime: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginTop: 4,
    flexShrink: 0,
  },
  markAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
});

export default NotificationsScreen;
