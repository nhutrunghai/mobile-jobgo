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
  requestVerificationEmail,
  updateProfileSetting,
} from '@/src/features/profile/services/profile-api';
import type { ProfileSetting } from '@/src/features/profile/types';
import { ApiError } from '@/src/lib/api/api-error';
import { colors, radius, spacing } from '@/src/theme';

const VIETNAM_PHONE_REGEX = /^(0[3|5|7|8|9])([0-9]{8})$/;

function maskEmail(value?: string) {
  const email = value?.trim();

  if (!email || !email.includes('@')) {
    return 'Chưa có email';
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

export function SettingsScreen() {
  const router = useRouter();
  const [setting, setSetting] = useState<ProfileSetting | null>(null);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [phoneError, setPhoneError] = useState<string>();
  const [screenError, setScreenError] = useState<string>();
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
        setIsLoading(true);
        setScreenError(undefined);
        const response = await getProfileSetting();

        if (!isMounted) {
          return;
        }

        setSetting(response.data);
        setPhone(response.data?.phone ?? '');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setScreenError(error.message);
        } else {
          setScreenError('Không thể tải cài đặt tài khoản');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
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

  const verificationLabel = setting?.is_verified ? 'Đã xác minh email' : 'Chưa xác minh email';
  const maskedEmail = useMemo(() => maskEmail(setting?.email), [setting?.email]);
  const hasPhoneChanged = phone.trim() !== (setting?.phone ?? '').trim();

  const handleSaveSetting = async () => {
    const normalizedPhone = phone.trim();

    setPhoneError(undefined);
    setScreenError(undefined);

    if (!normalizedPhone) {
      setPhoneError('Vui lòng nhập số điện thoại');
      return;
    }

    if (!VIETNAM_PHONE_REGEX.test(normalizedPhone)) {
      setPhoneError('Số điện thoại không đúng định dạng Việt Nam');
      return;
    }

    if (!hasPhoneChanged) {
      showToast('Không có thay đổi nào để lưu', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateProfileSetting({ phone: normalizedPhone });
      setSetting((current) => ({
        ...(current ?? {}),
        phone: normalizedPhone,
      }));
      showToast(response.message || 'Đã cập nhật cài đặt', 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Không thể cập nhật cài đặt';
      setScreenError(message);
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsSendingVerification(true);
      setScreenError(undefined);
      const response = await requestVerificationEmail();
      showToast(response.message || 'Đã gửi lại email xác minh', 'success');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Không thể gửi lại email xác minh';
      setScreenError(message);
      showToast(message, 'error');
    } finally {
      setIsSendingVerification(false);
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
                Tùy chỉnh tài khoản
              </AppText>
              <AppText variant="title" style={styles.heroTitle}>
                Cài đặt
              </AppText>
              <AppText variant="body" color="rgba(255,255,255,0.82)">
                Quản lý thông tin liên hệ, xác minh email và các luồng bảo mật của tài khoản.
              </AppText>
            </View>
          </View>

          <View style={styles.body}>
            {isLoading ? (
              <View style={styles.feedbackCard}>
                <ActivityIndicator size="small" color={colors.primary} />
                <AppText variant="body" color={colors.textMuted}>
                  Đang tải cài đặt tài khoản...
                </AppText>
              </View>
            ) : null}

            {!isLoading ? (
              <>
                <View style={styles.section}>
                  <AppText variant="heading" style={styles.sectionTitle}>
                    Thông tin tài khoản
                  </AppText>

                  <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                      <AppText variant="caption" color={colors.textMuted}>
                        Username
                      </AppText>
                      <AppText variant="bodyStrong" style={styles.infoValue}>
                        {setting?.username || 'Chưa có username'}
                      </AppText>
                    </View>
                    <View style={styles.infoCard}>
                      <AppText variant="caption" color={colors.textMuted}>
                        Email
                      </AppText>
                      <AppText variant="bodyStrong" style={styles.infoValue} numberOfLines={1}>
                        {maskedEmail}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.infoCard}>
                    <AppText variant="caption" color={colors.textMuted}>
                      Số điện thoại hiện tại
                    </AppText>
                    <AppText variant="bodyStrong" style={styles.infoValue}>
                      {setting?.phone || 'Chưa cập nhật số điện thoại'}
                    </AppText>
                  </View>

                  <View
                    style={[
                      styles.statusRow,
                      setting?.is_verified ? styles.statusVerified : styles.statusPending,
                    ]}>
                    <Feather
                      name={setting?.is_verified ? 'check-circle' : 'alert-circle'}
                      size={16}
                      color={setting?.is_verified ? colors.primaryDark : '#B76E00'}
                    />
                    <AppText
                      variant="caption"
                      color={setting?.is_verified ? colors.primaryDark : '#B76E00'}>
                      {verificationLabel}
                    </AppText>
                  </View>
                </View>

                <View style={styles.section}>
                  <AppText variant="heading" style={styles.sectionTitle}>
                    Cập nhật liên hệ
                  </AppText>

                  <View style={styles.fieldGroup}>
                    <AppText variant="caption" color={colors.textMuted}>
                      Số điện thoại
                    </AppText>
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Nhập số điện thoại Việt Nam"
                      placeholderTextColor="#94A39A"
                      style={[styles.input, phoneError ? styles.inputError : null]}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                    {phoneError ? (
                      <AppText variant="caption" color={colors.tertiary}>
                        {phoneError}
                      </AppText>
                    ) : null}
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.primaryAction,
                      pressed && !isSaving ? styles.actionPressed : null,
                      isSaving ? styles.actionDisabled : null,
                    ]}
                    onPress={() => void handleSaveSetting()}
                    disabled={isSaving}>
                    {isSaving ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Feather name="save" size={17} color={colors.white} />
                    )}
                    <AppText variant="bodyStrong" color={colors.white}>
                      {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
                    </AppText>
                  </Pressable>
                </View>

                <View style={styles.section}>
                  <AppText variant="heading" style={styles.sectionTitle}>
                    Bảo mật và xác minh
                  </AppText>

                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryAction,
                      pressed && !isSendingVerification ? styles.actionPressed : null,
                      isSendingVerification || setting?.is_verified ? styles.actionDisabled : null,
                    ]}
                    onPress={() => void handleResendVerification()}
                    disabled={isSendingVerification || setting?.is_verified}>
                    {isSendingVerification ? (
                      <ActivityIndicator size="small" color={colors.primaryDark} />
                    ) : (
                      <Feather name="mail" size={17} color={colors.primaryDark} />
                    )}
                    <AppText variant="bodyStrong" color={colors.primaryDark}>
                      {setting?.is_verified
                        ? 'Email đã xác minh'
                        : isSendingVerification
                          ? 'Đang gửi lại email...'
                          : 'Gửi lại email xác minh'}
                    </AppText>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [styles.inlineActionRow, pressed ? styles.actionPressed : null]}
                    onPress={() => router.push('/profile/change-password')}>
                    <View style={styles.inlineActionLeft}>
                      <View style={styles.inlineIconWrap}>
                        <Feather name="shield" size={18} color={colors.primary} />
                      </View>
                      <View style={styles.inlineCopy}>
                        <AppText variant="bodyStrong" style={styles.inlineTitle}>
                          Đổi mật khẩu
                        </AppText>
                        <AppText variant="caption" color={colors.textMuted}>
                          Dùng OTP gửi qua email để cập nhật mật khẩu mới
                        </AppText>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={18} color="#A0AEC0" />
                  </Pressable>
                </View>

                {screenError ? (
                  <View style={styles.feedbackCard}>
                    <AppText variant="body" color={colors.tertiary}>
                      {screenError}
                    </AppText>
                  </View>
                ) : null}

                <View style={styles.footerSpace} />
              </>
            ) : null}
          </View>
        </ScrollView>

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
    paddingBottom: 92,
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
  body: {
    marginTop: -18,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
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
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
  },
  infoValue: {
    color: colors.text,
  },
  statusRow: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusVerified: {
    backgroundColor: colors.primarySoft,
  },
  statusPending: {
    backgroundColor: '#FFF3DD',
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
  primaryAction: {
    minHeight: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  secondaryAction: {
    minHeight: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  inlineActionRow: {
    minHeight: 72,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  inlineActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  inlineIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineCopy: {
    flex: 1,
    gap: 2,
  },
  inlineTitle: {
    color: colors.text,
  },
  actionPressed: {
    opacity: 0.92,
  },
  actionDisabled: {
    opacity: 0.7,
  },
  footerSpace: {
    height: 28,
  },
});
