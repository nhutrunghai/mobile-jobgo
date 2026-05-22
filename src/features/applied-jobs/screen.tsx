import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { BottomNav } from '@/src/features/home/components/bottom-nav';
import { bottomNavItems, homeHeader } from '@/src/features/home/data';
import { useAuth } from '@/src/lib/auth/auth-provider';
import { ApiError } from '@/src/lib/api/api-error';
import { getMyAppliedJobs } from '@/src/features/applied-jobs/services/applied-jobs-api';
import type { AppliedJobCardViewModel, AppliedJobsResponse } from '@/src/features/applied-jobs/types';
import { colors, radius, spacing } from '@/src/theme';

function resolveLogo(url?: string) {
  if (!url) {
    return homeHeader.profileImage;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return homeHeader.profileImage;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.hostname === 'example.com' || parsedUrl.hostname.endsWith('.example.com')) {
      return homeHeader.profileImage;
    }

    return trimmedUrl;
  } catch {
    return homeHeader.profileImage;
  }
}

function formatCompactMoney(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return Number.isInteger(millions) ? `${millions} triệu` : `${millions.toFixed(1)} triệu`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} nghìn`;
  }

  return `${value}`;
}

function formatSalary(item: AppliedJobsResponse['data']['applications'][number]['job']['salary']) {
  if (item?.is_negotiable) {
    return 'Thỏa thuận';
  }

  if (item?.min && item?.max) {
    return `${formatCompactMoney(item.min)} - ${formatCompactMoney(item.max)}`;
  }

  if (item?.min) {
    return `Từ ${formatCompactMoney(item.min)}`;
  }

  if (item?.max) {
    return `Đến ${formatCompactMoney(item.max)}`;
  }

  return 'Thỏa thuận';
}

function mapStatus(status?: string): Pick<AppliedJobCardViewModel, 'statusLabel' | 'statusTone'> {
  switch (status) {
    case 'reviewing':
      return { statusLabel: 'Đang xem xét', statusTone: 'blue' };
    case 'shortlisted':
      return { statusLabel: 'Vào shortlist', statusTone: 'amber' };
    case 'interviewing':
      return { statusLabel: 'Đang phỏng vấn', statusTone: 'amber' };
    case 'rejected':
      return { statusLabel: 'Đã từ chối', statusTone: 'red' };
    case 'hired':
      return { statusLabel: 'Đã trúng tuyển', statusTone: 'green' };
    case 'withdrawn':
      return { statusLabel: 'Đã rút hồ sơ', statusTone: 'slate' };
    case 'submitted':
    default:
      return { statusLabel: 'Đã ứng tuyển', statusTone: 'green' };
  }
}

function formatAppliedAt(value?: string) {
  if (!value) {
    return 'Cập nhật gần đây';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Cập nhật gần đây';
  }

  return `Nộp ngày ${new Intl.DateTimeFormat('vi-VN').format(date)}`;
}

function mapApplicationToCard(
  item: AppliedJobsResponse['data']['applications'][number]
): AppliedJobCardViewModel {
  const { statusLabel, statusTone } = mapStatus(item.status);

  return {
    id: item.job._id,
    applicationId: item._id,
    title: item.job.title,
    company: item.company.company_name,
    logo: resolveLogo(item.company.logo),
    location: item.job.location,
    salary: formatSalary(item.job.salary),
    statusLabel,
    statusTone,
    appliedAtLabel: formatAppliedAt(item.applied_at),
  };
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: AppliedJobCardViewModel['statusTone'];
}) {
  return (
    <View
      style={[
        styles.statusPill,
        tone === 'green'
          ? styles.statusGreen
          : tone === 'amber'
            ? styles.statusAmber
            : tone === 'blue'
              ? styles.statusBlue
              : tone === 'red'
                ? styles.statusRed
                : styles.statusSlate,
      ]}>
      <AppText
        variant="caption"
        style={[
          styles.statusText,
          tone === 'green'
            ? styles.statusTextGreen
            : tone === 'amber'
              ? styles.statusTextAmber
              : tone === 'blue'
                ? styles.statusTextBlue
                : tone === 'red'
                  ? styles.statusTextRed
                  : styles.statusTextSlate,
        ]}>
        {label}
      </AppText>
    </View>
  );
}

export function AppliedJobsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<AppliedJobCardViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    const loadAppliedJobs = async () => {
      if (!isAuthenticated) {
        if (isMounted) {
          setItems([]);
          setErrorMessage(undefined);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(undefined);
        const response = await getMyAppliedJobs();

        if (!isMounted) {
          return;
        }

        setItems(response.data.applications.map(mapApplicationToCard));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Không thể tải danh sách việc đã ứng tuyển');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAppliedJobs();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const activeCount = useMemo(
    () => items.filter((item) => item.statusTone !== 'slate' && item.statusTone !== 'red').length,
    [items]
  );

  const emptyTitle = !isAuthenticated ? 'Đăng nhập để xem hồ sơ đã ứng tuyển' : 'Bạn chưa ứng tuyển công việc nào';
  const emptyDescription = !isAuthenticated
    ? 'Danh sách việc làm đã nộp sẽ xuất hiện tại đây sau khi bạn đăng nhập và ứng tuyển.'
    : 'Khi bạn nộp hồ sơ, trạng thái xử lý sẽ được cập nhật tại đây để theo dõi nhanh.';

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <AppText variant="caption" color="rgba(255,255,255,0.82)">
                Bảng theo dõi hồ sơ
              </AppText>
              <AppText variant="title" style={styles.heroTitle}>
                Việc đã ứng tuyển
              </AppText>
            </View>
            <View style={styles.heroIcon}>
              <Feather name="briefcase" size={24} color={colors.white} />
            </View>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStatCard}>
              <AppText variant="caption" color="rgba(255,255,255,0.82)">
                Tổng hồ sơ
              </AppText>
              <AppText variant="heading" style={styles.heroStatValue}>
                {items.length}
              </AppText>
            </View>
            <View style={styles.heroStatCard}>
              <AppText variant="caption" color="rgba(255,255,255,0.82)">
                Đang xử lý
              </AppText>
              <AppText variant="heading" style={styles.heroStatValue}>
                {activeCount}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {isLoading ? (
            <View style={styles.feedbackCard}>
              <AppText variant="body" color={colors.textMuted}>
                Đang tải danh sách ứng tuyển...
              </AppText>
            </View>
          ) : null}

          {errorMessage ? (
            <View style={styles.feedbackCard}>
              <AppText variant="body" color={colors.tertiary}>
                {errorMessage}
              </AppText>
            </View>
          ) : null}

          {!isLoading && !errorMessage && items.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <Feather name={isAuthenticated ? 'inbox' : 'lock'} size={28} color={colors.primary} />
              </View>
              <View style={styles.emptyCopy}>
                <AppText variant="heading" style={styles.emptyTitle}>
                  {emptyTitle}
                </AppText>
                <AppText variant="body" color={colors.textMuted} style={styles.emptyDescription}>
                  {emptyDescription}
                </AppText>
              </View>
              <Pressable
                style={styles.emptyButton}
                onPress={() => router.push(isAuthenticated ? '/search' : '/(auth)/login')}>
                <Feather name={isAuthenticated ? 'search' : 'log-in'} size={16} color={colors.white} />
                <AppText variant="bodyStrong" color={colors.white}>
                  {isAuthenticated ? 'Tìm việc phù hợp' : 'Đăng nhập'}
                </AppText>
              </Pressable>
            </View>
          ) : null}

          {!isLoading && items.length > 0 ? (
            <View style={styles.list}>
              {items.map((item) => (
                <Pressable
                  key={item.applicationId}
                  style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
                  onPress={() =>
                    router.push({
                      pathname: '/job/[id]',
                      params: { id: item.id },
                    })
                  }>
                  <View style={styles.cardHeader}>
                    <View style={styles.logoWrap}>
                      <Image source={{ uri: item.logo }} style={styles.logo} contentFit="cover" />
                    </View>
                    <View style={styles.cardMeta}>
                      <AppText variant="bodyStrong" style={styles.cardTitle} numberOfLines={2}>
                        {item.title}
                      </AppText>
                      <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
                        {item.company}
                      </AppText>
                    </View>
                    <StatusPill label={item.statusLabel} tone={item.statusTone} />
                  </View>

                  <View style={styles.cardInfoRow}>
                    <View style={styles.infoBadge}>
                      <Feather name="map-pin" size={14} color={colors.primaryDark} />
                      <AppText variant="caption" color={colors.primaryDark}>
                        {item.location}
                      </AppText>
                    </View>
                    <View style={styles.infoBadge}>
                      <Feather name="dollar-sign" size={14} color={colors.primaryDark} />
                      <AppText variant="caption" color={colors.primaryDark}>
                        {item.salary}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.timelineBadge}>
                      <Feather name="clock" size={14} color="#5E6E61" />
                      <AppText variant="caption" color={colors.textMuted}>
                        {item.appliedAtLabel}
                      </AppText>
                    </View>
                    <View style={styles.openLink}>
                      <AppText variant="caption" color={colors.primary}>
                        Xem chi tiết
                      </AppText>
                      <Feather name="arrow-right" size={14} color={colors.primary} />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <BottomNav items={navItems} activeKey="cv" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6F5',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 46,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: spacing.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  heroTitle: {
    color: colors.white,
    marginTop: spacing.xs,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroStatCard: {
    flex: 1,
    minHeight: 88,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
  },
  heroStatValue: {
    color: colors.white,
  },
  body: {
    marginTop: -22,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.lg,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCopy: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
  },
  emptyButton: {
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.993 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  logoWrap: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceStrong,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  cardMeta: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    color: colors.text,
  },
  statusPill: {
    minHeight: 26,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    lineHeight: 14,
  },
  statusGreen: {
    backgroundColor: '#E8F8EE',
  },
  statusTextGreen: {
    color: '#0B8F4B',
  },
  statusAmber: {
    backgroundColor: '#FFF3DD',
  },
  statusTextAmber: {
    color: '#B76E00',
  },
  statusBlue: {
    backgroundColor: '#EAF2FF',
  },
  statusTextBlue: {
    color: '#2563EB',
  },
  statusRed: {
    backgroundColor: '#FDECEE',
  },
  statusTextRed: {
    color: '#C93B55',
  },
  statusSlate: {
    backgroundColor: '#EEF1F0',
  },
  statusTextSlate: {
    color: '#5E6E61',
  },
  cardInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  infoBadge: {
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  timelineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  openLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
