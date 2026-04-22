import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type SearchJobCardProps = {
  title: string;
  company: string;
  salary: string;
  location: string;
  image: string;
  highlighted?: boolean;
  favorite?: boolean;
  onPress?: () => void;
};

export function SearchJobCard({
  title,
  company,
  salary,
  location,
  image,
  highlighted,
  favorite,
  onPress,
}: SearchJobCardProps) {
  return (
    <Pressable style={[styles.card, highlighted ? styles.cardHighlighted : null]} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Image source={{ uri: image }} style={styles.logo} contentFit="cover" />
        </View>

        <View style={styles.textWrap}>
          <AppText variant="bodyStrong" style={styles.title} numberOfLines={2}>
            {title}
          </AppText>
          <AppText variant="caption" color={colors.textMuted} numberOfLines={1} style={styles.company}>
            {company}
          </AppText>
          <View style={styles.tags}>
            <View style={[styles.tag, styles.salaryTag]}>
              <AppText variant="caption" color={colors.primary} style={styles.tagText} numberOfLines={1}>
                {salary}
              </AppText>
            </View>
            <View style={styles.tag}>
              <AppText variant="caption" style={styles.tagText} numberOfLines={1}>
                {location}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.favoriteWrap}>
          {favorite ? (
            <MaterialIcons name="favorite" size={20} color="#D9487C" style={styles.favoriteFilled} />
          ) : (
            <Feather
              name="heart"
              size={20}
              color="#7DCB93"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#F1DCC9',
    backgroundColor: colors.surface,
    padding: 10,
  },
  cardHighlighted: {
    borderColor: '#86D99B',
    backgroundColor: '#F7FFF8',
  },
  content: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: '#ECEFEC',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#25322B',
    fontSize: 14,
    lineHeight: 18,
  },
  company: {
    textTransform: 'uppercase',
    fontSize: 10,
    lineHeight: 14,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  tag: {
    minHeight: 24,
    borderRadius: radius.pill,
    backgroundColor: '#EFF1F0',
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    maxWidth: 112,
  },
  salaryTag: {
    backgroundColor: '#EEFBEF',
    borderWidth: 1,
    borderColor: '#A6E1B4',
  },
  tagText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  favoriteWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A6E1B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteFilled: {
    transform: [{ scale: 1.02 }],
  },
});
