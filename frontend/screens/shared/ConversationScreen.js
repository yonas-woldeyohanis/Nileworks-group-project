import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import Header from '../../components/common/Header';
import Avatar from '../../components/common/Avatar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ENDPOINTS, BASE_URL } from '../../constants/endpoints';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { formatDate } from '../../utils/helpers';

const MessageBubble = ({ message, isOwn }) => (
  <View style={[styles.bubbleRow, isOwn && styles.bubbleRowOwn]}>
    <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
      <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>{message.content}</Text>
      <Text style={[styles.bubbleTime, isOwn && { color: 'rgba(255,255,255,0.6)' }]}>
        {formatDate(message.createdAt, 'HH:mm')}
      </Text>
    </View>
  </View>
);

const ConversationScreen = ({ route, navigation }) => {
  const { conversationId } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    initSocket();
    return () => { socketRef.current?.disconnect(); };
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get(ENDPOINTS.MESSAGES.CONVERSATION(conversationId));
      const data = res.data.data;
      setMessages(data.messages || []);
      const other = data.participants?.find((p) => p._id !== user._id);
      setOtherUser(other);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  const initSocket = async () => {
    const token = await SecureStore.getItemAsync('accessToken');
    const socket = io(BASE_URL.replace('/api/v1', ''), {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('join_conversation', conversationId);
    });

    socket.on('new_message', (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    socketRef.current = socket;
  };

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSending(true);

    // Optimistic update
    const tempMsg = {
      _id: `temp_${Date.now()}`,
      content: text,
      sender: { _id: user._id },
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const res = await api.post(ENDPOINTS.MESSAGES.SEND(conversationId), { content: text });
      setMessages((prev) => {
        // If message was already received via socket, just remove the temp message
        if (prev.some((m) => m._id === res.data.data._id)) {
          return prev.filter((m) => m._id !== tempMsg._id);
        }
        // Otherwise replace temp with real message
        return prev.map((m) => (m._id === tempMsg._id ? res.data.data : m));
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempMsg._id));
      setInputText(text);
    } finally {
      setSending(false);
    }
  };

  const otherName = otherUser?.fullName || otherUser?.companyName || 'Conversation';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Header
        title={otherName}
        onBack={() => navigation.goBack()}
        rightAction={
          <Avatar uri={otherUser?.avatar} name={otherName} size={34} />
        }
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isOwn={item.sender?._id === user._id || item.sender === user._id}
          />
        )}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <View style={[styles.inputWrapper, SHADOWS.sm]}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  messageList: { padding: SPACING.base, paddingBottom: 20 },
  bubbleRow: { marginBottom: SPACING.sm, alignItems: 'flex-start' },
  bubbleRowOwn: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bubbleOwn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: { borderBottomLeftRadius: 4 },
  bubbleText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  bubbleTextOwn: { color: '#fff' },
  bubbleTime: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputBar: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    maxHeight: 120,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.border },
});

export default ConversationScreen;
