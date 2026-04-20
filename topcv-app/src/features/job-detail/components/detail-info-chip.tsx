import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors } from '@/src/theme';

type DetailInfoChipProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
};

export function DetailInfoChip({ icon, label, value }: DetailInfoChipProps) {
  return (
    <View style={styles.item}>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <AppText variant="caption" color={colors.textMuted} style={styles.label}>
        {label}
      </AppText>
      <AppText variant="bodyStrong" style={styles.value} numberOfLines={2}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
  value: {
    color: colors.primaryDark,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
});
