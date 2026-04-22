import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type SimilarJobCardProps = {
  title: string;
  company: string;
  salary: string;
  location: string;
  image: string;
  onPress?: () => void;
};

export function SimilarJobCard({
  title,
  company,
  salary,
  location,
  image,
  onPress,
}: SimilarJobCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <AppText variant="bodyStrong" style={styles.title} numberOfLines={2}>
          {title}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
          {company}
        </AppText>
        <View style={styles.tags}>
          <View style={[styles.tag, styles.salaryTag]}>
            <AppText variant="caption" color={colors.primaryDark} numberOfLines={1}>
              {salary}
            </AppText>
          </View>
          <View style={styles.tag}>
            <AppText variant="caption" numberOfLines={1}>
              {location}
            </AppText>
          </View>
        </View>
      </View>
      <Feather name="heart" size={18} color="#98A2B3" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.05)',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: '#EEF2F5',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    maxWidth: 110,
  },
  salaryTag: {
    backgroundColor: '#ECFDF3',
  },
});
