import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { AuthButton } from '@/src/features/auth/components/auth-button';
import { detailJob, similarJobs } from '@/src/features/job-detail/data';
import { DetailInfoChip } from '@/src/features/job-detail/components/detail-info-chip';
import { GeneralInfoCard } from '@/src/features/job-detail/components/general-info-card';
import { SimilarJobCard } from '@/src/features/job-detail/components/similar-job-card';
import { colors, radius, spacing } from '@/src/theme';

export function JobDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const job = detailJob;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: job.heroImage }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.topBar}>
            <View style={styles.circleButton}>
              <Feather name="arrow-left" size={20} color={colors.text} onPress={() => router.back()} />
            </View>
            <View style={styles.circleButton}>
              <Feather name="more-horizontal" size={20} color={colors.text} />
            </View>
          </View>
        </View>

        <View style={styles.headerCard}>
          <View style={styles.logoCard}>
            <Image source={{ uri: job.logoImage }} style={styles.logoImage} contentFit="cover" />
          </View>
          <AppText variant="title" style={styles.jobTitle}>
            {job.title}
          </AppText>
          <AppText
            variant="caption"
            color={colors.textMuted}
            style={styles.company}
            numberOfLines={1}>
            {job.company}
          </AppText>

          <View style={styles.infoRow}>
            <DetailInfoChip icon="dollar-sign" label="Mức lương" value={job.salary} />
            <View style={styles.infoDivider} />
            <DetailInfoChip icon="map-pin" label="Địa điểm" value={job.location} />
            <View style={styles.infoDivider} />
            <DetailInfoChip icon="briefcase" label="Kinh nghiệm" value={job.experience} />
          </View>
        </View>

        <View style={styles.tabs}>
          <AppText variant="bodyStrong" color={colors.primary} style={styles.activeTab}>
            Thông tin
          </AppText>
          <AppText variant="body" color={colors.textMuted}>
            Công ty
          </AppText>
          <AppText variant="body" color={colors.textMuted}>
            Mức độ cạnh tranh
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.tagWrap}>
            {job.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <AppText variant="caption" color={colors.textMuted}>
                  {tag}
                </AppText>
              </View>
            ))}
          </View>

          <View style={styles.block}>
            <View style={styles.blockTitleRow}>
              <View style={styles.blockMarker} />
              <AppText variant="heading" style={styles.blockTitle}>
                Mô tả công việc
              </AppText>
            </View>
            <View style={styles.paragraphs}>
              {job.description.map((line) => (
                <AppText key={line} variant="body" style={styles.paragraph}>
                  {line}
                </AppText>
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <View style={styles.blockTitleRow}>
              <View style={styles.blockMarker} />
              <AppText variant="heading" style={styles.blockTitle}>
                Kỹ năng cần có
              </AppText>
            </View>
            <View style={styles.skillWrap}>
              {job.skills.map((skill) => (
                <View key={skill} style={styles.skillChip}>
                  <AppText variant="caption" color={colors.textMuted}>
                    {skill}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          <GeneralInfoCard items={job.generalInfo} />
        </View>

        <View style={styles.similarSection}>
          <View style={styles.sectionHeader}>
            <AppText variant="heading" style={styles.sectionTitle}>
              Việc làm tương tự
            </AppText>
            <AppText variant="bodyStrong" color={colors.primaryLink}>
              Tất cả
            </AppText>
          </View>
          <View style={styles.similarList}>
            {similarJobs.map((item) => (
              <SimilarJobCard
                key={item.id}
                {...item}
                onPress={() =>
                  router.replace({
                    pathname: '/job/[id]',
                    params: { id: params.id ?? item.id },
                  })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.saveButton}>
          <Feather name="heart" size={20} color="#98A2B3" />
        </View>
        <Link
          href={{
            pathname: '/job/[id]/apply',
            params: { id: params.id ?? job.id },
          }}
          asChild>
          <AuthButton label="Ứng tuyển ngay" style={styles.applyButton} />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 102,
  },
  hero: {
    height: 196,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 177, 79, 0.26)',
  },
  topBar: {
    position: 'absolute',
    top: 48,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    marginTop: -64,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: 42,
    paddingBottom: spacing.md,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  logoCard: {
    position: 'absolute',
    top: -48,
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.04)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  jobTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  company: {
    marginTop: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
    maxWidth: '92%',
    fontSize: 11,
    lineHeight: 16,
  },
  infoRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  infoDivider: {
    width: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.08)',
    marginVertical: 6,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 24, 39, 0.06)',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: spacing.sm,
  },
  sectionCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xl,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: '#F2F4F7',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  block: {
    gap: spacing.md,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  blockMarker: {
    width: 4,
    height: 18,
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  blockTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  paragraphs: {
    gap: spacing.sm,
  },
  paragraph: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    backgroundColor: '#F5F7FB',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  similarSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  similarList: {
    gap: spacing.md,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(17, 24, 39, 0.06)',
  },
  saveButton: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  applyButton: {
    flex: 1,
    borderRadius: radius.md,
  },
});
