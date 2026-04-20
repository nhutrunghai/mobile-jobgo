import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { AuthButton } from '@/src/features/auth/components/auth-button';
import { AuthHeader } from '@/src/features/auth/components/auth-header';
import { AuthInput, PasswordInput } from '@/src/features/auth/components/auth-input';
import { AuthShell } from '@/src/features/auth/components/auth-shell';
import { colors, spacing } from '@/src/theme';

export function ResetPasswordScreen() {
  const router = useRouter();

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
          <AuthButton label="Cập nhật mật khẩu" style={styles.primaryButton} />
        </View>
      }>
      <AuthHeader
        title="Nhập mã xác nhận"
        subtitle="Chúng tôi đã gửi mã xác nhận tới địa chỉ nhuthifc@gmail.com. Vui lòng kiểm tra hòm thư hoặc hòm thư spam để lấy mã và nhập vào bên dưới."
        onBackPress={() => router.back()}
      />

      <View style={styles.form}>
        <View style={styles.field}>
          <AppText variant="bodyStrong" style={styles.fieldLabel}>
            Mã xác nhận <AppText variant="bodyStrong" color={colors.tertiary}>*</AppText>
          </AppText>
          <AuthInput placeholder="Nhập mã xác nhận" keyboardType="number-pad" />
        </View>

        <View style={styles.field}>
          <AppText variant="bodyStrong" style={styles.fieldLabel}>
            Mật khẩu mới <AppText variant="bodyStrong" color={colors.tertiary}>*</AppText>
          </AppText>
          <PasswordInput placeholder="Nhập mật khẩu mới" />
        </View>

        <View style={styles.field}>
          <AppText variant="bodyStrong" style={styles.fieldLabel}>
            Nhập lại mật khẩu <AppText variant="bodyStrong" color={colors.tertiary}>*</AppText>
          </AppText>
          <PasswordInput placeholder="Nhập lại mật khẩu mới" />
        </View>
      </View>

      <AppText variant="body" color={colors.textMuted} style={styles.helper}>
        Mã xác nhận hết hạn sau 1 giờ kể từ khi bạn nhận được mã.{' '}
        <AppText variant="bodyStrong" color={colors.primaryLink}>
          Gửi lại mã
        </AppText>
      </AppText>
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
