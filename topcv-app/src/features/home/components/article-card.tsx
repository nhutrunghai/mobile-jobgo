import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type ArticleCardProps = {
  title: string;
  subtitle?: string;
  image: string;
};

export function ArticleCard({ title, subtitle, image }: ArticleCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <AppText variant="bodyStrong" style={styles.title} numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textMuted} numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.05)',
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 102,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
});
