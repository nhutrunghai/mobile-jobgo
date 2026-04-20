import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AuthButton } from '@/src/features/auth/components/auth-button';
import { AuthHeader } from '@/src/features/auth/components/auth-header';
import { AuthInput } from '@/src/features/auth/components/auth-input';
import { AuthShell } from '@/src/features/auth/components/auth-shell';
import { radius, spacing } from '@/src/theme';

export function ForgotPasswordScreen() {
  const router = useRouter();

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
        />
        <Link href="/(auth)/reset-password" asChild>
          <AuthButton label="Tạo lại mật khẩu" style={styles.submitButton} />
        </Link>
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
    marginTop: 256,
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
