import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/app-text';
import { AuthButton } from '@/src/features/auth/components/auth-button';
import { AuthHeader } from '@/src/features/auth/components/auth-header';
import { AuthInput } from '@/src/features/auth/components/auth-input';
import { AuthShell } from '@/src/features/auth/components/auth-shell';
import { requestPasswordReset } from '@/src/features/auth/services/auth-api';
import { ApiError } from '@/src/lib/api/api-error';
import { colors, radius, spacing } from '@/src/theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async () => {
    const nextEmail = email.trim().toLowerCase();

    setEmailError(undefined);
    setSubmitError(undefined);
    setSuccessMessage(undefined);

    if (!nextEmail) {
      setEmailError('Vui lòng nhập email');
      return;
    }

    if (!EMAIL_REGEX.test(nextEmail)) {
      setEmailError('Email không đúng định dạng');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await requestPasswordReset({ email: nextEmail });
      setSuccessMessage(response.message);
      router.push({
        pathname: '/(auth)/reset-password',
        params: {
          email: nextEmail,
        },
      });
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
    <AuthShell scrollEnabled={false} contentContainerStyle={styles.content}>
      <AuthHeader
        title="Quên mật khẩu"
        subtitle="Vui lòng nhập email đăng ký của bạn. Chúng tôi sẽ gửi hướng dẫn đổi mật khẩu tới email này."
        onBackPress={() => router.back()}
      />

      <View style={styles.form}>
        <AuthInput
          label="Email"
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          error={emailError}
        />
        {submitError ? (
          <AppText variant="caption" color={colors.tertiary}>
            {submitError}
          </AppText>
        ) : null}
        {successMessage ? (
          <AppText variant="caption" color={colors.primary}>
            {successMessage}
          </AppText>
        ) : null}
        <AuthButton
          label={isSubmitting ? 'Dang xu ly...' : 'Tạo lại mật khẩu'}
          style={styles.submitButton}
          onPress={handleForgotPassword}
          disabled={isSubmitting}
        />
      </View>

      <View style={styles.illustration}>
        <View pointerEvents="none" style={styles.glow} />
        <View style={styles.illustrationCircle}>
          <Feather name="rotate-ccw" size={86} color="rgba(19, 34, 24, 0.08)" />
          <View style={styles.lockBadge}>
            <Feather name="lock" size={32} color="rgba(19, 34, 24, 0.1)" />
          </View>
        </View>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  form: {
    gap: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginTop: 24,
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 220,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(0, 177, 79, 0.05)',
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(19, 34, 24, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
