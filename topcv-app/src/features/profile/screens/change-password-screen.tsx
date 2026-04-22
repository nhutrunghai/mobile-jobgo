import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { AppToast } from '@/src/components/ui/app-toast';
import { BottomNav } from '@/src/features/home/components/bottom-nav';
import { bottomNavItems } from '@/src/features/home/data';
import {
  getProfileSetting,
  requestChangePasswordOtp,
  submitNewPassword,
} from '@/src/features/profile/services/profile-api';
import { ApiError } from '@/src/lib/api/api-error';
import { colors, radius, spacing } from '@/src/theme';

function maskEmail(value?: string) {
  const email = value?.trim();

  if (!email || !email.includes('@')) {
    return 'email tài khoản của bạn';
  }

  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return email;
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? '*'}*@${domain}`;
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
}

export function ChangePasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>();
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpError, setOtpError] = useState<string>();
  const [newPasswordError, setNewPasswordError] = useState<string>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [infoMessage, setInfoMessage] = useState<string>();
  const [isLoadingSetting, setIsLoadingSetting] = useState(true);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastTone, setToastTone] = useState<'success' | 'error'>('success');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = bottomNavItems.map((item) => ({
    ...item,
    href:
      item.key === 'home'
        ? ('/(tabs)' as const)
        : item.key === 'cv'
          ? ('/(tabs)/applications' as const)
          : item.key === 'match'
            ? ('/(tabs)/assistant' as const)
            : item.key === 'notice'
              ? ('/(tabs)/explore' as const)
              : item.key === 'profile'
                ? ('/(tabs)/profile' as const)
                : undefined,
  }));

  const showToast = (message: string, tone: 'success' | 'error') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(message);
    setToastTone(tone);
    setIsToastVisible(true);

    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2600);
  };

  useEffect(() => {
    let isMounted = true;

    const loadSetting = async () => {
      try {
        setIsLoadingSetting(true);
        const response = await getProfileSetting();

        if (!isMounted) {
          return;
        }

        setEmail(response.data?.email);
      } catch {
        if (!isMounted) {
          return;
        }

        setEmail(undefined);
      } finally {
        if (isMounted) {
          setIsLoadingSetting(false);
        }
      }
    };

    void loadSetting();

    return () => {
      isMounted = false;

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const emailLabel = useMemo(() => maskEmail(email), [email]);

  const handleRequestOtp = async () => {
    try {
      setIsRequestingOtp(true);
      setSubmitError(undefined);
      const response = await requestChangePasswordOtp();
      setInfoMessage(response.message || 'Mã OTP đã được gửi về email của bạn.');
      showToast(response.message || 'Đã gửi mã OTP', 'success');
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Không thể gửi mã OTP đổi mật khẩu';
      setSubmitError(message);
      showToast(message, 'error');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleSubmit = async () => {
    let hasError = false;

    setOtpError(undefined);
    setNewPasswordError(undefined);
    setConfirmPasswordError(undefined);
    setSubmitError(undefined);

    if (!otpCode.trim()) {
      setOtpError('Vui lòng nhập mã OTP từ email');
      hasError = true;
    }

    if (!newPassword) {
      setNewPasswordError('Vui lòng nhập mật khẩu mới');
      hasError = true;
    } else if (newPassword.length < 8) {
      setNewPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
      hasError = true;
    } else if (newPassword.length > 50) {
      setNewPasswordError('Mật khẩu không được vượt quá 50 ký tự');
      hasError = true;
    }

    if (!confirmNewPassword) {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu mới');
      hasError = true;
    } else if (confirmNewPassword !== newPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không trùng khớp');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await submitNewPassword({
        OtpCode: otpCode.trim(),
        newPassword,
        confirmNewPassword,
      });

      setInfoMessage(response.message || 'Đổi mật khẩu thành công');
      showToast(response.message || 'Đổi mật khẩu thành công', 'success');
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Không thể đổi mật khẩu';
      setSubmitError(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.topBar}>
              <Pressable style={styles.circleButton} onPress={() => router.back()}>
                <Feather name="arrow-left" size={20} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.heroCopy}>
              <AppText variant="caption" color="rgba(255,255,255,0.82)">
                Bảo mật tài khoản
              </AppText>
              <AppText variant="title" style={styles.heroTitle}>
                Đổi mật khẩu
              </AppText>
              <AppText variant="body" color="rgba(255,255,255,0.82)">
                Mã OTP sẽ được gửi về {emailLabel}.
              </AppText>
            </View>

            <View style={styles.heroActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.otpButton,
                  pressed && !isRequestingOtp ? styles.otpButtonPressed : null,
                  isRequestingOtp ? styles.otpButtonDisabled : null,
                ]}
                onPress={() => void handleRequestOtp()}
                disabled={isRequestingOtp || isSubmitting || isLoadingSetting}>
                {isRequestingOtp ? (
                  <ActivityIndicator size="small" color={colors.primaryDark} />
                ) : (
                  <Feather name="mail" size={16} color={colors.primaryDark} />
                )}
                <AppText variant="bodyStrong" color={colors.primaryDark}>
                  {isRequestingOtp ? 'Đang gửi mã...' : 'Gửi mã OTP'}
                </AppText>
              </Pressable>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.section}>
              <AppText variant="heading" style={styles.sectionTitle}>
                Xác thực thay đổi
              </AppText>

              <View style={styles.fieldGroup}>
                <AppText variant="caption" color={colors.textMuted}>
                  Mã OTP
                </AppText>
                <TextInput
                  value={otpCode}
                  onChangeText={setOtpCode}
                  placeholder={isLoadingSetting ? 'Đang tải email nhận mã...' : 'Nhập mã OTP từ email'}
                  placeholderTextColor="#94A39A"
                  style={[styles.input, otpError ? styles.inputError : null]}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                {otpError ? (
                  <AppText variant="caption" color={colors.tertiary}>
                    {otpError}
                  </AppText>
                ) : null}
              </View>
            </View>

            <View style={styles.section}>
              <AppText variant="heading" style={styles.sectionTitle}>
                Mật khẩu mới
              </AppText>

              <View style={styles.fieldGroup}>
                <AppText variant="caption" color={colors.textMuted}>
                  Mật khẩu mới
                </AppText>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor="#94A39A"
                  style={[styles.input, newPasswordError ? styles.inputError : null]}
                  secureTextEntry
                />
                {newPasswordError ? (
                  <AppText variant="caption" color={colors.tertiary}>
                    {newPasswordError}
                  </AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <AppText variant="caption" color={colors.textMuted}>
                  Nhập lại mật khẩu mới
                </AppText>
                <TextInput
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor="#94A39A"
                  style={[styles.input, confirmPasswordError ? styles.inputError : null]}
                  secureTextEntry
                />
                {confirmPasswordError ? (
                  <AppText variant="caption" color={colors.tertiary}>
                    {confirmPasswordError}
                  </AppText>
                ) : null}
              </View>
            </View>

            {submitError ? (
              <View style={styles.feedbackCard}>
                <AppText variant="body" color={colors.tertiary}>
                  {submitError}
                </AppText>
              </View>
            ) : null}

            {infoMessage ? (
              <View style={styles.feedbackCard}>
                <AppText variant="body" color={colors.primary}>
                  {infoMessage}
                </AppText>
              </View>
            ) : null}

            <View style={styles.footerSpace} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && !isSubmitting ? styles.saveButtonPressed : null,
              isSubmitting ? styles.saveButtonDisabled : null,
            ]}
            onPress={() => void handleSubmit()}
            disabled={isSubmitting || isRequestingOtp || isLoadingSetting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Feather name="shield" size={18} color={colors.white} />
            )}
            <AppText variant="bodyStrong" color={colors.white}>
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </AppText>
          </Pressable>
        </View>

        <BottomNav items={navItems} activeKey="profile" />
        <AppToast visible={isToastVisible} message={toastMessage} tone={toastTone} bottomOffset={74} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6F5',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 180,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    gap: spacing.xs,
  },
  heroTitle: {
    color: colors.white,
  },
  heroActions: {
    paddingTop: spacing.xs,
  },
  otpButton: {
    minHeight: 46,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  otpButtonPressed: {
    opacity: 0.92,
  },
  otpButtonDisabled: {
    opacity: 0.7,
  },
  body: {
    marginTop: -18,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  sectionTitle: {
    color: colors.text,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 50,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  inputError: {
    borderColor: colors.tertiary,
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  footerSpace: {
    height: 82,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 54,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(17, 24, 39, 0.06)',
  },
  saveButton: {
    minHeight: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  saveButtonPressed: {
    opacity: 0.92,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
});
