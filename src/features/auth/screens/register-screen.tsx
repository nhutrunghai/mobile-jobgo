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
import { registerWithEmail } from '@/src/features/auth/services/auth-api';
import { ApiError } from '@/src/lib/api/api-error';
import { useAuth } from '@/src/lib/auth/auth-provider';
import { colors, spacing } from '@/src/theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterScreen() {
  const router = useRouter();
  const { setTokens } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [fullNameError, setFullNameError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();
  const [acceptedError, setAcceptedError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    const nextFullName = fullName.trim();
    const nextEmail = email.trim().toLowerCase();
    let hasError = false;

    setFullNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);
    setAcceptedError(undefined);
    setSubmitError(undefined);

    if (!nextFullName) {
      setFullNameError('Vui lòng nhập họ và tên');
      hasError = true;
    } else if (nextFullName.length < 2) {
      setFullNameError('Họ và tên phải có ít nhất 2 ký tự');
      hasError = true;
    } else if (nextFullName.length > 100) {
      setFullNameError('Họ và tên không được vượt quá 100 ký tự');
      hasError = true;
    }

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

    if (!confirmPassword) {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Mật khẩu xác nhận không trùng khớp');
      hasError = true;
    }

    if (!accepted) {
      setAcceptedError('Bạn cần đồng ý điều khoản để tiếp tục');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await registerWithEmail({
        fullName: nextFullName,
        email: nextEmail,
        password,
        confirmPassword,
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
        subtitle="Đăng ký tài khoản"
        onBackPress={() => router.back()}
        centered
      />

      <View style={styles.form}>
        <AuthInput
          leftIcon="user"
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
          error={fullNameError}
        />
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
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
        />
        <PasswordInput
          leftIcon="lock"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={confirmPasswordError}
        />
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
        {acceptedError ? (
          <AppText variant="caption" color={colors.tertiary}>
            {acceptedError}
          </AppText>
        ) : null}
        {submitError ? (
          <AppText variant="caption" color={colors.tertiary}>
            {submitError}
          </AppText>
        ) : null}
        <AuthButton
          label={isSubmitting ? 'Dang ky...' : 'Đăng ký'}
          style={styles.submitButton}
          onPress={handleRegister}
          disabled={isSubmitting}
        />
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
