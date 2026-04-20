import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/app-text';
import { colors, spacing } from '@/src/theme';

type AuthFooterLinkProps = {
  prefix?: string;
  actionLabel: string;
  onPress?: () => void;
};

export function AuthFooterLink({ prefix, actionLabel, onPress }: AuthFooterLinkProps) {
  return (
    <View style={styles.row}>
      {prefix ? (
        <AppText variant="caption" color={colors.textMuted}>
          {prefix}
        </AppText>
      ) : null}
      <Pressable onPress={onPress}>
        <AppText variant="caption" color={colors.primaryLink} style={styles.action}>
          {actionLabel}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  action: {
    fontWeight: '700',
  },
});
