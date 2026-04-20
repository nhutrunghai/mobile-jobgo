import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { AuthButton } from '@/src/features/auth/components/auth-button';
import { AuthCheckbox } from '@/src/features/auth/components/auth-checkbox';
import { AuthFooterLink } from '@/src/features/auth/components/auth-footer-link';
import { AuthHeader } from '@/src/features/auth/components/auth-header';
import { AuthInput, PasswordInput } from '@/src/features/auth/components/auth-input';
import { AuthShell } from '@/src/features/auth/components/auth-shell';
import { colors, spacing } from '@/src/theme';

export function RegisterScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  return (
    <AuthShell>
      <AuthHeader
        title="Chào mừng bạn đến với TopCV"
        subtitle="Đăng ký tài khoản"
        onBackPress={() => router.back()}
        centered
      />

      <View style={styles.form}>
        <AuthInput leftIcon="user" placeholder="Họ và tên" />
        <AuthInput
          leftIcon="mail"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PasswordInput leftIcon="lock" placeholder="Mật khẩu" />
        <PasswordInput leftIcon="lock" placeholder="Nhập lại mật khẩu" />
        <AuthCheckbox
          value={accepted}
          onChange={setAccepted}
        >
          <AppText variant="caption" color={colors.textMuted}>
            Tôi đã đọc và đồng ý với{' '}
            <AppText variant="caption" color={colors.primaryLink} style={styles.linkText}>
              Điều khoản dịch vụ
            </AppText>{' '}
            và{' '}
            <AppText variant="caption" color={colors.primaryLink} style={styles.linkText}>
              Chính sách bảo mật
            </AppText>{' '}
            của TopCV.
          </AppText>
        </AuthCheckbox>
        <AuthButton label="Đăng ký" style={styles.submitButton} />
      </View>

      <View style={styles.footer}>
        <AuthFooterLink
          prefix="Bạn đã có tài khoản?"
          actionLabel="Đăng nhập ngay"
          onPress={() => router.replace('/(auth)/login')}
        />
        <AppText
          variant="caption"
          color={colors.primaryLink}
          style={styles.guestLink}
          onPress={() => router.replace('/(tabs)')}>
          Trải nghiệm không cần đăng nhập
        </AppText>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  footer: {
    gap: spacing.xxl,
    marginTop: 72,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  linkText: {
    fontWeight: '700',
  },
  guestLink: {
    textAlign: 'center',
    fontWeight: '700',
  },
});
