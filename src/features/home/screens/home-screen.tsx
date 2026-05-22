import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { ArticleCard } from '@/src/features/home/components/article-card';
import { BottomNav } from '@/src/features/home/components/bottom-nav';
import { JobCard } from '@/src/features/home/components/job-card';
import { QuickActionItem } from '@/src/features/home/components/quick-action-item';
import { SectionHeader } from '@/src/features/home/components/section-header';
import { useFavorites } from '@/src/features/favorites/hooks/use-favorites';
import { getFeaturedHomeJobs, getLatestHomeJobs } from '@/src/features/home/services/home-api';
import type { HomeJobCardItem } from '@/src/features/home/types';
import { mapHomeJobToCard } from '@/src/features/home/utils/job-card-mapper';
import {
  bestJobs,
  bottomNavItems,
  cvGuides,
  homeHeader,
  quickActions,
  successArticles,
  suggestedJobs,
} from '@/src/features/home/data';
import { ApiError } from '@/src/lib/api/api-error';
import { colors, radius, spacing } from '@/src/theme';

export function HomeScreen() {
  const router = useRouter();
  const placeholderSuffixes = useMemo(
    () => ['công ty', 'địa điểm', 'vị trí', 'ngành nghề'],
    []
  );
  const [placeholderWordIndex, setPlaceholderWordIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState<HomeJobCardItem[]>([]);
  const [latestJobs, setLatestJobs] = useState<HomeJobCardItem[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string>();
  const { isFavorited, toggleFavorite } = useFavorites();
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
    const currentWord = placeholderSuffixes[placeholderWordIndex];
    const finishedTyping = typedText === currentWord;
    const finishedDeleting = typedText.length === 0;

    let timeoutMs = isDeleting ? 45 : 85;

    if (!isDeleting && finishedTyping) {
      timeoutMs = 1100;
    } else if (isDeleting && finishedDeleting) {
      timeoutMs = 220;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && finishedTyping) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && finishedDeleting) {
        setIsDeleting(false);
        setPlaceholderWordIndex((value) => (value + 1) % placeholderSuffixes.length);
        return;
      }

      setTypedText((value) =>
        isDeleting
          ? currentWord.slice(0, Math.max(value.length - 1, 0))
          : currentWord.slice(0, value.length + 1)
      );
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [isDeleting, placeholderSuffixes, placeholderWordIndex, typedText]);

  useEffect(() => {
    let isMounted = true;

    const loadHomeJobs = async () => {
      try {
        setIsLoadingJobs(true);
        setJobsError(undefined);

        const [featuredResponse, latestResponse] = await Promise.all([
          getFeaturedHomeJobs(4),
          getLatestHomeJobs(4),
        ]);

        if (!isMounted) {
          return;
        }

        setFeaturedJobs(featuredResponse.data.items.map(mapHomeJobToCard));
        setLatestJobs(latestResponse.data.items.map(mapHomeJobToCard));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setJobsError(error.message);
        } else {
          setJobsError('Không thể tải danh sách việc làm');
        }

        setFeaturedJobs([]);
        setLatestJobs([]);
      } finally {
        if (isMounted) {
          setIsLoadingJobs(false);
        }
      }
    };

    void loadHomeJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandRow}>
              <View style={styles.botWrap}>
                <Image source={{ uri: homeHeader.botImage }} style={styles.botImage} contentFit="cover" />
              </View>
              <AppText variant="bodyStrong" style={styles.brandText}>
                TopCV
              </AppText>
            </View>
            <Feather name="bell" size={20} color={colors.white} />
          </View>

          <Pressable style={styles.searchWrap} onPress={() => router.push('/search')}>
            <Feather name="search" size={20} color={colors.primary} />
            <AppText variant="body" color="#7C8B7F" style={styles.searchText}>
              Tìm kiếm theo {typedText}
              <AppText variant="body" color="#9AA6A0" style={styles.cursor}>
                |
              </AppText>
            </AppText>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActions}>
          {quickActions.map((item) => (
            <QuickActionItem key={item.label} {...item} />
          ))}
        </ScrollView>

        <View style={styles.sectionWrap}>
          <View style={styles.nearbyButton}>
            <Feather name="map-pin" size={18} color={colors.primary} />
            <AppText variant="bodyStrong" color={colors.primary}>
              Khám phá việc làm gần bạn
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Gợi ý việc làm phù hợp"
            onActionPress={() =>
              router.push({
                pathname: '/search',
                params: {
                  mode: 'results',
                  source: 'suggested',
                  query: 'Việc làm phù hợp',
                },
              })
            }
          />
          <View style={styles.infoBox}>
            <View style={styles.infoContent}>
              <Feather name="info" size={16} color="#3B82F6" />
              <AppText variant="caption" color="#2563EB">
                Vuốt trái để bỏ việc làm không phù hợp
              </AppText>
            </View>
            <Feather name="x" size={16} color="#60A5FA" />
          </View>
          <View style={styles.cards}>
            {featuredJobs.length > 0
              ? featuredJobs.map((job) => (
              <JobCard
                key={`suggested-${job.id}`}
                {...job}
                favorite={isFavorited(job.id)}
                onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
                onFavoritePress={() => void toggleFavorite(job.id)}
              />
                ))
              : suggestedJobs.map((job) => (
              <JobCard
                key={`suggested-${job.title}`}
                {...job}
                onPress={() => router.push({ pathname: '/job/[id]', params: { id: 'chief-accountant' } })}
              />
                ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Việc làm tốt nhất"
            onActionPress={() =>
              router.push({
                pathname: '/search',
                params: {
                  mode: 'results',
                  source: 'best',
                  query: 'Việc làm tốt nhất',
                },
              })
            }
          />
          {jobsError ? (
            <AppText variant="caption" color={colors.tertiary}>
              {jobsError}
            </AppText>
          ) : null}
          <View style={styles.cards}>
            {latestJobs.length > 0
              ? latestJobs.map((job) => (
              <JobCard
                key={`best-${job.id}`}
                {...job}
                favorite={isFavorited(job.id)}
                onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
                onFavoritePress={() => void toggleFavorite(job.id)}
              />
                ))
              : bestJobs.map((job) => (
              <JobCard
                key={`best-${job.title}`}
                {...job}
                onPress={() => router.push({ pathname: '/job/[id]', params: { id: 'chief-accountant' } })}
              />
                ))}
          </View>
          {isLoadingJobs ? (
            <AppText variant="caption" color={colors.textMuted}>
              Đang tải việc làm...
            </AppText>
          ) : null}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Kinh nghiệm thành công" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}>
            {successArticles.map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                onPress={() =>
                  router.push({
                    pathname: '/article/[id]',
                    params: { id: article.id },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Hướng dẫn viết CV" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}>
            {cvGuides.map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                onPress={() =>
                  router.push({
                    pathname: '/article/[id]',
                    params: { id: article.id },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomCtaWrap}>
          <View style={styles.bottomCta}>
            <Feather name="map-pin" size={16} color={colors.primary} />
            <AppText variant="bodyStrong">Việc làm gần bạn</AppText>
          </View>
        </View>
      </ScrollView>

      <BottomNav items={navItems} activeKey="home" />
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
    paddingBottom: 24,
  },
  header: {
    paddingTop: 46,
    paddingHorizontal: spacing.lg,
    paddingBottom: 26,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  botWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  botImage: {
    width: '100%',
    height: '100%',
  },
  brandText: {
    color: colors.white,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    minHeight: 52,
    gap: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  cursor: {
    fontSize: 15,
    lineHeight: 20,
  },
  quickActions: {
    paddingHorizontal: spacing.lg,
    paddingTop: 18,
    gap: 14,
  },
  sectionWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: 20,
  },
  nearbyButton: {
    minHeight: 50,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: 28,
    gap: 14,
  },
  infoBox: {
    backgroundColor: '#EEF5FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cards: {
    gap: 14,
  },
  horizontalList: {
    gap: spacing.lg,
    paddingRight: spacing.lg,
  },
  bottomCtaWrap: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: spacing.xl,
  },
  bottomCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
});
