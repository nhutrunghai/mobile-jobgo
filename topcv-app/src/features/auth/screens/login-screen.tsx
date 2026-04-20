import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/app-text';
import { AuthButton } from '@/src/features/auth/components/auth-button';
import { AuthDivider } from '@/src/features/auth/components/auth-divider';
import { AuthFooterLink } from '@/src/features/auth/components/auth-footer-link';
import { AuthHeader } from '@/src/features/auth/components/auth-header';
import { AuthInput, PasswordInput } from '@/src/features/auth/components/auth-input';
import { AuthShell } from '@/src/features/auth/components/auth-shell';
import { SocialLoginButtons } from '@/src/features/auth/components/social-login-buttons';
import { colors, spacing } from '@/src/theme';

export function LoginScreen() {
  const router = useRouter();

  return (
    <AuthShell>
      <AuthHeader
        title="Chào mừng bạn đến với TopCV"
        subtitle="Đăng nhập tài khoản"
        centered
      />

      <View style={styles.form}>
        <AuthInput
          leftIcon="mail"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PasswordInput leftIcon="lock" placeholder="Nhập mật khẩu" />

        <View style={styles.alignEnd}>
          <AuthFooterLink
            actionLabel="Quên mật khẩu?"
            onPress={() => router.push('/(auth)/forgot-password')}
          />
        </View>

        <Link href="/(tabs)" asChild>
          <AuthButton label="Đăng nhập" style={styles.submitButton} />
        </Link>
      </View>

      <View style={styles.section}>
        <AuthDivider label="Hoặc đăng nhập bằng" />
        <SocialLoginButtons />
      </View>

      <View style={styles.footer}>
        <AuthFooterLink
          prefix="Bạn chưa có tài khoản?"
          actionLabel="Đăng ký ngay"
          onPress={() => router.push('/(auth)/register')}
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
  alignEnd: {
    alignItems: 'flex-end',
    marginTop: -2,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  section: {
    gap: spacing.xl,
    marginTop: 56,
  },
  footer: {
    gap: spacing.xxl,
    marginTop: 72,
  },
  guestLink: {
    textAlign: 'center',
    fontWeight: '700',
  },
});
