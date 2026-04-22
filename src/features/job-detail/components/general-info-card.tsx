import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type GeneralInfoItem = {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
};

type GeneralInfoCardProps = {
  items: GeneralInfoItem[];
};

export function GeneralInfoCard({ items }: GeneralInfoCardProps) {
  return (
    <View style={styles.card}>
      <AppText variant="bodyStrong" style={styles.title}>
        Thông tin chung
      </AppText>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={styles.item}>
            <Feather name={item.icon} size={18} color={colors.primary} />
            <View style={styles.textWrap}>
              <AppText variant="caption" color={colors.textMuted}>
                {item.label}
              </AppText>
              <AppText variant="caption" style={styles.value} numberOfLines={2}>
                {item.value}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FBFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#EEF4FF',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.lg,
  },
  item: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  value: {
    color: colors.text,
    fontWeight: '700',
  },
});
