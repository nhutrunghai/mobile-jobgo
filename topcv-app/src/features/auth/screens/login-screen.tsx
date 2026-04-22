import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
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
import { loginWithEmail } from '@/src/features/auth/services/auth-api';
import { ApiError } from '@/src/lib/api/api-error';
import { useAuth } from '@/src/lib/auth/auth-provider';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen() {
  const router = useRouter();
  const { setTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !isSubmitting;
  }, [email, isSubmitting, password]);

  const handleLogin = async () => {
    const nextEmail = email.trim().toLowerCase();
    let hasError = false;

    setEmailError(undefined);
    setPasswordError(undefined);
    setSubmitError(undefined);

    if (!nextEmail) {
      setEmailError('Vui lòng nhập email');
      hasError = true;
    } else if (!EMAIL_REGEX.test(nextEmail)) {
      setEmailError('Email không đúng định dạng');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
      hasError = true;
    } else if (password.length > 50) {
      setPasswordError('Mật khẩu không được vượt quá 50 ký tự');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await loginWithEmail({
        email: nextEmail,
        password,
      });

      await setTokens({
        accessToken: response.data.AccessToken,
        refreshToken: response.data.RefreshToken,
      });

      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Khong the ket noi den may chu');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          error={emailError}
        />
        <PasswordInput
          leftIcon="lock"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
        />

        <View style={styles.alignEnd}>
          <AuthFooterLink
            actionLabel="Quên mật khẩu?"
            onPress={() => router.push('/(auth)/forgot-password')}
          />
        </View>

        {submitError ? (
          <AppText variant="caption" color={colors.tertiary}>
            {submitError}
          </AppText>
        ) : null}

        <AuthButton
          label={isSubmitting ? 'Dang nhap...' : 'Đăng nhập'}
          style={styles.submitButton}
          onPress={handleLogin}
          disabled={!canSubmit}
        />
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
