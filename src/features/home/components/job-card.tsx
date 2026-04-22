import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type JobCardProps = {
  id?: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  image: string;
  favorite?: boolean;
  highlighted?: boolean;
  badge?: 'bolt';
  onPress?: () => void;
  onFavoritePress?: () => void;
};

export function JobCard({
  title,
  company,
  salary,
  location,
  image,
  favorite,
  highlighted,
  badge,
  onPress,
  onFavoritePress,
}: JobCardProps) {
  return (
    <View style={[styles.card, highlighted ? styles.cardHighlighted : null]}>
      {badge === 'bolt' ? (
        <View style={styles.badge}>
          <Feather name="zap" size={14} color={colors.white} />
        </View>
      ) : null}
      <Pressable onPress={onPress} style={styles.contentPressable}>
        <View style={styles.contentRow}>
          <View style={styles.logoWrap}>
            <Image source={{ uri: image }} style={styles.logo} contentFit="contain" />
          </View>
          <View style={styles.textWrap}>
            <AppText variant="bodyStrong" style={styles.title} numberOfLines={2}>
              {title}
            </AppText>
            <AppText variant="caption" color={colors.textMuted} style={styles.company} numberOfLines={1}>
              {company}
            </AppText>
          </View>
        </View>
      </Pressable>
      <View style={styles.footer}>
        <View style={styles.tags}>
          <View style={[styles.tag, styles.salaryTag]}>
            <AppText variant="caption" color={highlighted ? colors.text : colors.primaryDark} style={styles.tagText} numberOfLines={1}>
              {salary}
            </AppText>
          </View>
          <View style={styles.tag}>
            <AppText variant="caption" color={colors.text} numberOfLines={1}>
              {location}
            </AppText>
          </View>
        </View>
        <Pressable style={styles.favorite} hitSlop={8} onPress={onFavoritePress}>
          {favorite ? (
            <MaterialIcons name="favorite" size={18} color="#D9487C" />
          ) : (
            <Feather
              name="heart"
              size={18}
              color={highlighted ? colors.primary : '#98A2B3'}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FFFA',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 177, 79, 0.28)',
    padding: 14,
    gap: spacing.md,
    overflow: 'hidden',
  },
  contentPressable: {
    gap: spacing.md,
  },
  cardHighlighted: {
    borderColor: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24,
    height: 24,
    borderBottomRightRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  logoWrap: {
    width: 68,
    height: 68,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.06)',
    overflow: 'hidden',
    padding: 6,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textWrap: {
    flex: 1,
    gap: 4,
    minHeight: 68,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
  },
  company: {
    textTransform: 'uppercase',
    fontSize: 11,
    lineHeight: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
  },
  tag: {
    backgroundColor: '#EEF2F5',
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    maxWidth: 118,
  },
  salaryTag: {
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: 'rgba(0, 177, 79, 0.24)',
  },
  tagText: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 14,
  },
  favorite: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(0, 177, 79, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});
