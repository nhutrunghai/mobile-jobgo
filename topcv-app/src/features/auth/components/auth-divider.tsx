import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/app-text';
import { colors, spacing } from '@/src/theme';

type AuthDividerProps = {
  label: string;
};

export function AuthDivider({ label }: AuthDividerProps) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <AppText variant="caption" color={colors.textMuted}>
        {label}
      </AppText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outline,
  },
});
