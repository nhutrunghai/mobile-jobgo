import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type AuthCheckboxProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  text?: string;
  children?: ReactNode;
};

export function AuthCheckbox({ value, onChange, text, children }: AuthCheckboxProps) {
  return (
    <Pressable style={styles.row} onPress={() => onChange(!value)}>
      <View style={[styles.box, value ? styles.boxChecked : null]}>
        {value ? <Feather name="check" size={14} color={colors.white} /> : null}
      </View>
      {children ? (
        <View style={styles.text}>{children}</View>
      ) : (
        <AppText variant="caption" color={colors.textMuted} style={styles.text}>
          {text}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  box: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    flex: 1,
  },
});
