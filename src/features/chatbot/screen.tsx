import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/src/components/ui/app-text';
import {
  deleteChatSession,
  getChatSession,
  getChatSessions,
  sendJobChatMessage,
} from '@/src/features/chatbot/services/chatbot-api';
import type { ChatSessionSummary, ChatTurn } from '@/src/features/chatbot/types';
import { BottomNav } from '@/src/features/home/components/bottom-nav';
import { bottomNavItems } from '@/src/features/home/data';
import { ApiError } from '@/src/lib/api/api-error';
import { useAuth } from '@/src/lib/auth/auth-provider';
import { colors, radius, spacing } from '@/src/theme';

const suggestionChips = [
  'Gợi ý việc làm hợp CV',
  'Review CV nhanh',
  'Luyện phỏng vấn HR',
  'Viết thư ứng tuyển',
];

const introMessage: ChatTurn = {
  role: 'assistant',
  content: 'Chào bạn, mình là JobBot AI. Mình có thể giúp bạn tìm việc phù hợp, tối ưu CV và chuẩn bị phỏng vấn.',
  created_at: new Date().toISOString(),
};

function formatHistoryTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Gần đây';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_#>`-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function MarkdownInline({ text, color }: { text: string; color: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <AppText variant="body" color={color} style={styles.markdownText}>
      {parts.map((part, index) => {
        const isBold = part.startsWith('**') && part.endsWith('**');
        const content = isBold ? part.slice(2, -2) : part;

        return (
          <AppText
            key={`${content}-${index}`}
            variant={isBold ? 'bodyStrong' : 'body'}
            color={color}
            style={styles.markdownText}>
            {content}
          </AppText>
        );
      })}
    </AppText>
  );
}

function MarkdownMessage({ text, color }: { text: string; color: string }) {
  const lines = text.split(/\r?\n/);

  return (
    <View style={styles.markdownWrap}>
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();

        if (!line) {
          return <View key={`space-${index}`} style={styles.markdownSpacer} />;
        }

        const heading = line.match(/^#{1,3}\s+(.+)$/);
        if (heading) {
          return (
            <AppText key={`heading-${index}`} variant="bodyStrong" color={color} style={styles.markdownHeading}>
              {heading[1]}
            </AppText>
          );
        }

        const bullet = line.match(/^[-*]\s+(.+)$/);
        if (bullet) {
          return (
            <View key={`bullet-${index}`} style={styles.markdownListRow}>
              <AppText variant="body" color={color} style={styles.markdownBullet}>
                •
              </AppText>
              <View style={styles.markdownListText}>
                <MarkdownInline text={bullet[1]} color={color} />
              </View>
            </View>
          );
        }

        const ordered = line.match(/^(\d+)[.)]\s+(.+)$/);
        if (ordered) {
          return (
            <View key={`ordered-${index}`} style={styles.markdownListRow}>
              <AppText variant="body" color={color} style={styles.markdownNumber}>
                {ordered[1]}.
              </AppText>
              <View style={styles.markdownListText}>
                <MarkdownInline text={ordered[2]} color={color} />
              </View>
            </View>
          );
        }

        return <MarkdownInline key={`text-${index}`} text={line} color={color} />;
      })}
    </View>
  );
}

export function ChatbotScreen() {
  const { isAuthenticated } = useAuth();
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>();
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([introMessage]);
  const [messageText, setMessageText] = useState('');
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingSessionDetail, setIsLoadingSessionDetail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const navItems = bottomNavItems.map((item) => ({
    ...item,
    href:
      item.key === 'home'
        ? ('/(tabs)' as const)
        : item.key === 'cv'
          ? ('/(tabs)/applications' as const)
          : item.key === 'match'
            ? ('/(tabs)/chatbot' as const)
            : item.key === 'notice'
              ? ('/(tabs)/explore' as const)
              : item.key === 'profile'
                ? ('/(tabs)/profile' as const)
                : undefined,
  }));

  const closeChat = useCallback(() => {
    setHasStartedChat(false);
  }, []);

  const swipeBackResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dx > 18 && Math.abs(gestureState.dy) < 24,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 80 && Math.abs(gestureState.dy) < 70) {
          closeChat();
        }
      },
    })
  ).current;

  const loadSessions = useCallback(async () => {
    if (!isAuthenticated) {
      setSessions([]);
      setIsLoadingSessions(false);
      return;
    }

    try {
      setIsLoadingSessions(true);
      const response = await getChatSessions();
      setSessions(response.data.sessions);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Không thể tải lịch sử chat');
      }
    } finally {
      setIsLoadingSessions(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const openNewChat = (initialMessage = '') => {
    setActiveSessionId(undefined);
    setChatTurns([introMessage]);
    setMessageText(initialMessage);
    setErrorMessage(undefined);
    setHasStartedChat(true);
  };

  const openSession = async (sessionId: string) => {
    try {
      setIsLoadingSessionDetail(true);
      setErrorMessage(undefined);
      const response = await getChatSession(sessionId);
      setActiveSessionId(response.data.session_id);
      setChatTurns(response.data.turns.length > 0 ? response.data.turns : [introMessage]);
      setMessageText('');
      setHasStartedChat(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Không thể mở lịch sử chat');
      }
    } finally {
      setIsLoadingSessionDetail(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert('Xóa đoạn chat?', 'Lịch sử của đoạn chat này sẽ bị xóa.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          void deleteSession(sessionId);
        },
      },
    ]);
  };

  const deleteSession = async (sessionId: string) => {
    try {
      setDeletingSessionId(sessionId);
      setErrorMessage(undefined);
      await deleteChatSession(sessionId);
      setSessions((currentSessions) => currentSessions.filter((session) => session.session_id !== sessionId));

      if (activeSessionId === sessionId) {
        setActiveSessionId(undefined);
        setChatTurns([introMessage]);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Không thể xóa đoạn chat');
      }
    } finally {
      setDeletingSessionId(undefined);
    }
  };

  const sendMessage = async () => {
    const normalizedMessage = messageText.trim();

    if (!normalizedMessage || isSending) {
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage('Bạn cần đăng nhập để sử dụng chatbot.');
      return;
    }

    const userTurn: ChatTurn = {
      role: 'user',
      content: normalizedMessage,
      created_at: new Date().toISOString(),
    };

    try {
      setIsSending(true);
      setErrorMessage(undefined);
      setChatTurns((currentTurns) => [...currentTurns, userTurn]);
      setMessageText('');

      const response = await sendJobChatMessage({
        message: normalizedMessage,
        session_id: activeSessionId,
      });

      setActiveSessionId(response.data.session_id);
      setChatTurns((currentTurns) => [
        ...currentTurns,
        {
          role: 'assistant',
          content: response.data.answer,
          created_at: new Date().toISOString(),
        },
      ]);
      void loadSessions();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Không thể gửi tin nhắn');
      }
    } finally {
      setIsSending(false);
    }
  };

  if (hasStartedChat) {
    return (
      <View style={styles.chatScreen} {...swipeBackResponder.panHandlers}>
        <View style={styles.chatHeader}>
          <View style={styles.brandBlock}>
            <Pressable style={styles.backButton} onPress={closeChat}>
              <Feather name="arrow-left" size={22} color={colors.white} />
            </Pressable>
            <View>
              <AppText variant="heading" style={styles.headerTitle}>
                JobBot AI
              </AppText>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <AppText variant="caption" color="rgba(255,255,255,0.86)">
                  Trợ lý nghề nghiệp realtime
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.chatKeyboardArea}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}>
          <ScrollView
            style={styles.fullChatCard}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled">
            {chatTurns.map((message, index) => {
              const isUser = message.role === 'user';
              const textColor = isUser ? colors.white : colors.text;

              return (
                <View
                  key={`${message.role}-${message.created_at}-${index}`}
                  style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
                  {!isUser ? (
                    <View style={styles.assistantAvatar}>
                      <Feather name="cpu" size={16} color={colors.primaryDark} />
                    </View>
                  ) : null}
                  <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                    {isUser ? (
                      <AppText variant="body" color={textColor} style={styles.bubbleText}>
                        {message.content}
                      </AppText>
                    ) : (
                      <MarkdownMessage text={message.content} color={textColor} />
                    )}
                  </View>
                </View>
              );
            })}

            {isSending ? (
              <View style={[styles.messageRow, styles.messageRowAssistant]}>
                <View style={styles.assistantAvatar}>
                  <Feather name="cpu" size={16} color={colors.primaryDark} />
                </View>
                <View style={[styles.bubble, styles.assistantBubble]}>
                  <AppText variant="body" color={colors.textMuted}>
                    JobBot đang trả lời...
                  </AppText>
                </View>
              </View>
            ) : null}

            {errorMessage ? (
              <AppText variant="caption" color={colors.tertiary}>
                {errorMessage}
              </AppText>
            ) : null}
          </ScrollView>

          <View style={styles.fullComposerShell}>
            <View style={styles.composer}>
              <Pressable style={styles.composerIcon}>
                <Feather name="paperclip" size={18} color="#7B8A7F" />
              </Pressable>
              <TextInput
                value={messageText}
                onChangeText={setMessageText}
                editable={!isSending && isAuthenticated}
                placeholder="Hỏi JobBot AI về việc làm, CV, phỏng vấn..."
                placeholderTextColor="#8A978D"
                style={styles.input}
              />
              <Pressable
                style={[
                  styles.sendButton,
                  !messageText.trim() || isSending || !isAuthenticated ? styles.sendButtonDisabled : null,
                ]}
                onPress={sendMessage}
                disabled={!messageText.trim() || isSending || !isAuthenticated}>
                {isSending ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Feather name="send" size={16} color={colors.white} />
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brandBlock}>
            <View style={styles.brandIcon}>
              <Feather name="message-circle" size={22} color={colors.white} />
            </View>
            <View>
              <View style={styles.titleRow}>
                <AppText variant="heading" style={styles.headerTitle}>
                  JobBot AI
                </AppText>
                <View style={styles.newBadge}>
                  <AppText variant="caption" style={styles.newBadgeText}>
                    New
                  </AppText>
                </View>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <AppText variant="caption" color="rgba(255,255,255,0.86)">
                  Trợ lý nghề nghiệp realtime
                </AppText>
              </View>
            </View>
          </View>

          <Pressable style={styles.sparkButton}>
            <Feather name="zap" size={18} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <AppText variant="bodyStrong" style={styles.heroTitle}>
            Trợ lý AI cho hành trình ứng tuyển
          </AppText>
          <AppText variant="body" color={colors.textMuted}>
            Tìm job phù hợp, hỏi đáp JD, luyện phỏng vấn và tối ưu CV ngay trong một màn chat.
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <View style={styles.suggestionWrap}>
          {suggestionChips.map((item) => (
            <Pressable key={item} style={styles.suggestionChip} onPress={() => openNewChat(item)}>
              <Feather name="corner-down-right" size={14} color={colors.primaryDark} />
              <AppText variant="caption" color={colors.primaryDark}>
                {item}
              </AppText>
            </Pressable>
          ))}
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <AppText variant="bodyStrong" style={styles.historyTitle}>
              Lịch sử chat
            </AppText>
            {isLoadingSessions || isLoadingSessionDetail ? <ActivityIndicator size="small" color={colors.primary} /> : null}
          </View>

          {!isAuthenticated ? (
            <View style={styles.feedbackCard}>
              <AppText variant="body" color={colors.textMuted}>
                Đăng nhập để xem và tiếp tục lịch sử chat.
              </AppText>
            </View>
          ) : null}

          {isAuthenticated && !isLoadingSessions && sessions.length === 0 ? (
            <View style={styles.feedbackCard}>
              <AppText variant="body" color={colors.textMuted}>
                Chưa có lịch sử chat. Bấm bắt đầu để tạo đoạn chat mới.
              </AppText>
            </View>
          ) : null}

          {errorMessage && !hasStartedChat ? (
            <AppText variant="caption" color={colors.tertiary}>
              {errorMessage}
            </AppText>
          ) : null}

          {sessions.map((session) => (
            <Pressable
              key={session.session_id}
              style={({ pressed }) => [styles.historyCard, pressed ? styles.historyCardPressed : null]}
              onPress={() => void openSession(session.session_id)}>
              <View style={styles.historyIcon}>
                <Feather name="message-square" size={16} color={colors.primaryDark} />
              </View>
              <View style={styles.historyCopy}>
                <AppText variant="bodyStrong" style={styles.historyItemTitle} numberOfLines={1}>
                  {session.title || 'Đoạn chat'}
                </AppText>
                <AppText variant="caption" color={colors.textMuted} numberOfLines={2}>
                  {stripMarkdown(session.last_message) || 'Tiếp tục đoạn chat này'}
                </AppText>
              </View>
              <View style={styles.historyMeta}>
                <AppText variant="caption" color={colors.textMuted}>
                  {formatHistoryTime(session.updated_at)}
                </AppText>
                <Pressable
                  style={styles.deleteHistoryButton}
                  onPress={(event) => {
                    event.stopPropagation();
                    handleDeleteSession(session.session_id);
                  }}
                  disabled={deletingSessionId === session.session_id}>
                  {deletingSessionId === session.session_id ? (
                    <ActivityIndicator size="small" color={colors.tertiary} />
                  ) : (
                    <Feather name="trash-2" size={16} color={colors.tertiary} />
                  )}
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.startButtonShell}>
        <Pressable style={styles.startButton} onPress={() => openNewChat()}>
          <Feather name="message-circle" size={18} color={colors.white} />
          <AppText variant="bodyStrong" color={colors.white}>
            Bắt đầu
          </AppText>
        </Pressable>
      </View>

      <BottomNav items={navItems} activeKey="match" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F6F3',
  },
  chatScreen: {
    flex: 1,
    backgroundColor: '#F3F6F3',
  },
  chatHeader: {
    backgroundColor: colors.primary,
    paddingTop: 46,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  chatKeyboardArea: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 46,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    gap: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    color: colors.white,
  },
  newBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#9BFFD1',
  },
  sparkButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroTitle: {
    color: colors.text,
  },
  body: {
    marginTop: -20,
    paddingHorizontal: spacing.lg,
    flex: 1,
  },
  bodyContent: {
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 140,
  },
  suggestionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  suggestionChip: {
    borderRadius: radius.pill,
    backgroundColor: '#EDF8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  historySection: {
    gap: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyTitle: {
    color: colors.text,
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  historyCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.993 }],
  },
  historyIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCopy: {
    flex: 1,
    gap: 3,
  },
  historyItemTitle: {
    color: colors.text,
  },
  historyMeta: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  deleteHistoryButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: '#FDECEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullChatCard: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  chatContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  messageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '86%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  assistantBubble: {
    backgroundColor: '#F3F7F4',
    borderTopLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 6,
  },
  bubbleText: {
    lineHeight: 21,
  },
  markdownWrap: {
    gap: spacing.xs,
  },
  markdownText: {
    lineHeight: 21,
  },
  markdownHeading: {
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  markdownSpacer: {
    height: spacing.xs,
  },
  markdownListRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  markdownBullet: {
    width: 14,
    lineHeight: 21,
  },
  markdownNumber: {
    minWidth: 20,
    lineHeight: 21,
  },
  markdownListText: {
    flex: 1,
  },
  fullComposerShell: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  startButtonShell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 62,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  startButton: {
    minHeight: 56,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  composer: {
    minHeight: 62,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(19, 34, 24, 0.08)',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  composerIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 40,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
});
