import { ComponentProps, ReactNode, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type BaseProps = {
  label?: string;
  leftIcon?: ComponentProps<typeof Feather>['name'];
  rightSlot?: ReactNode;
  error?: string;
};

type AuthInputProps = BaseProps & TextInputProps;

export function AuthInput({
  label,
  leftIcon,
  rightSlot,
  error,
  style,
  ...props
}: AuthInputProps) {
  return (
    <View style={styles.field}>
      {label ? (
        <AppText variant="label" color={colors.textMuted}>
          {label}
        </AppText>
      ) : null}

      <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
        {leftIcon ? <Feather name={leftIcon} size={18} color={colors.textMuted} /> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          {...props}
        />
        {rightSlot}
      </View>

      {error ? (
        <AppText variant="caption" color={colors.tertiary}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

type PasswordInputProps = Omit<AuthInputProps, 'secureTextEntry' | 'rightSlot'>;

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthInput
      {...props}
      secureTextEntry={!visible}
      rightSlot={
        <Pressable onPress={() => setVisible((value) => !value)} hitSlop={8}>
          <Feather
            name={visible ? 'eye' : 'eye-off'}
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputWrapError: {
    borderColor: colors.tertiary,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: spacing.md,
  },
});
