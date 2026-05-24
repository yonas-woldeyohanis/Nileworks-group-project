import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Header from '../../components/common/Header';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { formatRelativeDate, truncateText } from '../../utils/helpers';

const ConversationItem = ({ conversation, onPress, styles, COLORS, SHADOWS }) => {
  const other = conversation.participants?.find((p) => p._id !== conversation.currentUserId);
  const unread = conversation.unreadCount > 0;

  return (
    <TouchableOpacity style={[styles.convoItem, SHADOWS.sm]} onPress={onPress} activeOpacity={0.8}>
      <Avatar uri={other?.avatar} name={other?.name || other?.companyName} size={50} />
      {unread && <View style={styles.unreadDot} />}
      <View style={styles.convoText}>
        <View style={styles.convoHeader}>
          <Text style={[styles.convoName, unread && { fontFamily: FONTS.bold }]} numberOfLines={1}>
            {other?.name || other?.companyName || 'Unknown'}
          </Text>
          <Text style={styles.convoTime}>{formatRelativeDate(conversation.lastMessageAt)}</Text>
        </View>
        <Text
          style={[styles.convoPreview, unread && { color: COLORS.textPrimary, fontFamily: FONTS.medium }]}
          numberOfLines={1}
        >
          {truncateText(conversation.lastMessage, 60)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MessagingScreen = ({ navigation }) => {
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchConversations(); }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get(ENDPOINTS.MESSAGES.CONVERSATIONS);
      setConversations(res.data.data || []);
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Messages" />
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => navigation.navigate('Conversation', { conversationId: item._id, conversation: item })}
            styles={styles}
            COLORS={COLORS}
            SHADOWS={SHADOWS}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="chatbubbles-outline"
              title="No messages yet"
              message="When an employer contacts you or you start a conversation, it'll appear here."
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchConversations(); }}
            tintColor={COLORS.accent}
          />
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.base, paddingBottom: 90 },
  convoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 54,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.surface,
    zIndex: 1,
  },
  convoText: { flex: 1, marginLeft: 12 },
  convoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  convoName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  convoTime: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  convoPreview: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  separator: { height: SPACING.sm },
});

export default MessagingScreen;
