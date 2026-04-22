import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, spacing } from '@/src/theme';

type KeywordListProps = {
  keywords: readonly string[];
  onSelect: (value: string) => void;
};

export function KeywordList({ keywords, onSelect }: KeywordListProps) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="heading" style={styles.title}>
        Từ khóa phổ biến
      </AppText>

      <View style={styles.list}>
        {keywords.map((keyword) => (
          <Pressable key={keyword} style={styles.row} onPress={() => onSelect(keyword)}>
            <AppText variant="body" color={colors.textMuted}>
              {keyword}
            </AppText>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.moreButton}>
        <AppText variant="bodyStrong" color={colors.primaryDark}>
          Xem thêm
        </AppText>
        <Feather name="chevron-down" size={18} color={colors.primaryDark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
  },
  list: {
    borderTopWidth: 0,
  },
  row: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EE',
    justifyContent: 'center',
  },
  moreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingVertical: spacing.sm,
  },
});
