import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { AuthButton } from '@/src/features/auth/components/auth-button';
import { AuthHeader } from '@/src/features/auth/components/auth-header';
import { AuthInput, PasswordInput } from '@/src/features/auth/components/auth-input';
import { AuthShell } from '@/src/features/auth/components/auth-shell';
import { resetPasswordWithToken } from '@/src/features/auth/services/auth-api';
import { ApiError } from '@/src/lib/api/api-error';
import { colors, spacing } from '@/src/theme';

function extractResetToken(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  if (!trimmedValue.includes('://') && !trimmedValue.includes('?')) {
    return trimmedValue;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    return parsedUrl.searchParams.get('forgot_password_token')?.trim() ?? '';
  } catch {
    const matchedToken = trimmedValue.match(/[?&]forgot_password_token=([^&]+)/i);
    return matchedToken?.[1] ? decodeURIComponent(matchedToken[1]).trim() : '';
  }
}

export function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email?: string;
    forgot_password_token?: string;
  }>();
  const [tokenInput, setTokenInput] = useState(params.forgot_password_token ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenError, setTokenError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailText = useMemo(() => {
    if (typeof params.email === 'string' && params.email.trim()) {
      return params.email.trim();
    }

    return 'email cua ban';
  }, [params.email]);

  const handleResetPassword = async () => {
    const parsedToken = extractResetToken(tokenInput);
    let hasError = false;

    setTokenError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);
    setSubmitError(undefined);
    setSuccessMessage(undefined);

    if (!parsedToken) {
      setTokenError('Vui lòng dán link hoặc token đặt lại mật khẩu');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu mới');
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

    if (hasError) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await resetPasswordWithToken({
        password,
        confirmPassword,
        forgot_password_token: parsedToken,
      });

      setSuccessMessage(response.message);

      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 700);
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
    <AuthShell
      footer={
        <View style={styles.footerActions}>
          <AuthButton
            label="Quay lại"
            variant="secondary"
            style={styles.secondaryButton}
            onPress={() => router.back()}
          />
          <AuthButton
            label={isSubmitting ? 'Dang cap nhat...' : 'Cập nhật mật khẩu'}
            style={styles.primaryButton}
            onPress={handleResetPassword}
            disabled={isSubmitting}
          />
        </View>
      }>
      <AuthHeader
        title="Đặt lại mật khẩu"
        subtitle={`Chúng tôi đã gửi hướng dẫn tới ${emailText}. Hãy mở email, sao chép liên kết hoặc token đặt lại mật khẩu, sau đó dán vào đây.`}
        onBackPress={() => router.back()}
      />

      <View style={styles.form}>
        <View style={styles.field}>
          <AppText variant="bodyStrong" style={styles.fieldLabel}>
            Link hoặc token đặt lại mật khẩu <AppText variant="bodyStrong" color={colors.tertiary}>*</AppText>
          </AppText>
          <AuthInput
            placeholder="Dán link email hoặc token"
            autoCapitalize="none"
            autoCorrect={false}
            value={tokenInput}
            onChangeText={setTokenInput}
            error={tokenError}
          />
        </View>

        <View style={styles.field}>
          <AppText variant="bodyStrong" style={styles.fieldLabel}>
            Mật khẩu mới <AppText variant="bodyStrong" color={colors.tertiary}>*</AppText>
          </AppText>
          <PasswordInput
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
          />
        </View>

        <View style={styles.field}>
          <AppText variant="bodyStrong" style={styles.fieldLabel}>
            Nhập lại mật khẩu <AppText variant="bodyStrong" color={colors.tertiary}>*</AppText>
          </AppText>
          <PasswordInput
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
          />
        </View>
      </View>

      {submitError ? (
        <AppText variant="body" color={colors.tertiary} style={styles.helper}>
          {submitError}
        </AppText>
      ) : null}
      {successMessage ? (
        <AppText variant="body" color={colors.primary} style={styles.helper}>
          {successMessage}
        </AppText>
      ) : null}
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.xxl,
    marginTop: spacing.xl,
  },
  field: {
    gap: spacing.md,
  },
  fieldLabel: {
    color: colors.text,
  },
  helper: {
    marginTop: 56,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 20,
    minHeight: 60,
  },
  primaryButton: {
    flex: 1.4,
    borderRadius: 20,
    minHeight: 60,
  },
});
