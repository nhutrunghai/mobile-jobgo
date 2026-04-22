import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { allHomeArticles, findHomeArticleById } from '@/src/features/home/data';
import { colors, radius, spacing } from '@/src/theme';

export function ArticleDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const article = findHomeArticleById(params.id);
  const relatedArticles = allHomeArticles
    .filter((item) => item.id !== article?.id)
    .slice(0, 3);

  if (!article) {
    return (
      <View style={styles.emptyScreen}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.text} />
        </Pressable>
        <View style={styles.emptyCard}>
          <AppText variant="heading" style={styles.emptyTitle}>
            Không tìm thấy bài viết
          </AppText>
          <AppText variant="body" color={colors.textMuted}>
            Bài viết này không còn dữ liệu để hiển thị.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image source={{ uri: article.image }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.topBar}>
            <Pressable style={styles.iconButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color={colors.text} />
            </Pressable>
            <View style={styles.categoryBadge}>
              <AppText variant="caption" color={colors.primaryDark}>
                {article.category}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.headerCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Feather name="clock" size={14} color={colors.primary} />
              <AppText variant="caption" color={colors.textMuted}>
                {article.readTime}
              </AppText>
            </View>
            <View style={styles.metaPill}>
              <Feather name="calendar" size={14} color={colors.primary} />
              <AppText variant="caption" color={colors.textMuted}>
                {article.publishedAt}
              </AppText>
            </View>
          </View>

          <AppText variant="title" style={styles.title}>
            {article.title}
          </AppText>
          <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
            {article.subtitle}
          </AppText>

          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Feather name="pen-tool" size={16} color={colors.primaryDark} />
            </View>
            <View style={styles.authorCopy}>
              <AppText variant="bodyStrong" style={styles.authorName}>
                {article.author}
              </AppText>
              <AppText variant="caption" color={colors.textMuted}>
                Biên tập nội dung nghề nghiệp
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.highlightCard}>
          <View style={styles.highlightMarker} />
          <AppText variant="bodyStrong" style={styles.highlightText}>
            {article.highlight}
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="heading" style={styles.sectionTitle}>
            Nội dung chính
          </AppText>
          <View style={styles.tocList}>
            {article.sections.map((section, index) => (
              <View key={section.heading} style={styles.tocItem}>
                <View style={styles.tocIndex}>
                  <AppText variant="caption" color={colors.primaryDark}>
                    {index + 1}
                  </AppText>
                </View>
                <AppText variant="bodyStrong" style={styles.tocText}>
                  {section.heading}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.articleBody}>
          {article.sections.map((section) => (
            <View key={section.heading} style={styles.bodyBlock}>
              <View style={styles.blockHeadingRow}>
                <View style={styles.blockMarker} />
                <AppText variant="heading" style={styles.blockTitle}>
                  {section.heading}
                </AppText>
              </View>

              {section.paragraphs.map((paragraph) => (
                <AppText key={paragraph} variant="body" style={styles.paragraph}>
                  {paragraph}
                </AppText>
              ))}

              {section.bullets?.length ? (
                <View style={styles.bulletList}>
                  {section.bullets.map((bullet) => (
                    <View key={bullet} style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <AppText variant="body" style={styles.bulletText}>
                        {bullet}
                      </AppText>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.relatedSection}>
          <AppText variant="heading" style={styles.sectionTitle}>
            Đọc tiếp
          </AppText>
          <View style={styles.relatedList}>
            {relatedArticles.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.relatedCard,
                  pressed ? styles.relatedCardPressed : null,
                ]}
                onPress={() =>
                  router.replace({
                    pathname: '/article/[id]',
                    params: { id: item.id },
                  })
                }>
                <Image source={{ uri: item.image }} style={styles.relatedImage} contentFit="cover" />
                <View style={styles.relatedContent}>
                  <AppText variant="caption" color={colors.primaryDark}>
                    {item.category}
                  </AppText>
                  <AppText variant="bodyStrong" numberOfLines={2} style={styles.relatedTitle}>
                    {item.title}
                  </AppText>
                  <AppText variant="caption" color={colors.textMuted} numberOfLines={2}>
                    {item.subtitle}
                  </AppText>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  hero: {
    height: 260,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 30, 18, 0.28)',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerCard: {
    marginTop: -34,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  authorRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  authorAvatar: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorCopy: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    color: colors.text,
  },
  highlightCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: '#102A1A',
    borderRadius: 22,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  highlightMarker: {
    width: 42,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#74E39F',
  },
  highlightText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 25,
  },
  sectionCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
  },
  tocList: {
    gap: spacing.sm,
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 4,
  },
  tocIndex: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tocText: {
    flex: 1,
    color: colors.text,
  },
  articleBody: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  bodyBlock: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: spacing.xl,
    gap: spacing.md,
  },
  blockHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  blockMarker: {
    width: 4,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  blockTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    lineHeight: 24,
  },
  paragraph: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  bulletList: {
    gap: spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    color: colors.text,
    lineHeight: 23,
  },
  relatedSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    gap: spacing.md,
  },
  relatedList: {
    gap: spacing.md,
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.05)',
  },
  relatedCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  relatedImage: {
    width: 108,
    height: '100%',
    minHeight: 112,
  },
  relatedContent: {
    flex: 1,
    padding: spacing.md,
    gap: 6,
  },
  relatedTitle: {
    color: colors.text,
  },
  emptyScreen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
  },
});
