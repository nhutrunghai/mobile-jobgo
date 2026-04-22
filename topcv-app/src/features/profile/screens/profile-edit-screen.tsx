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
import { getProfileByUsername, getProfileMe, updateProfile } from '@/src/features/profile/services/profile-api';
import { ApiError } from '@/src/lib/api/api-error';
import { useAuth } from '@/src/lib/auth/auth-provider';
import { colors, radius, spacing } from '@/src/theme';

function normalizeSkillsInput(skills?: string[]) {
  return skills && skills.length > 0 ? skills.join(', ') : '';
}

function buildSkillArray(value: string) {
  return value
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill, index, items) => skill.length > 0 && items.indexOf(skill) === index);
}

export function ProfileEditScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastTone, setToastTone] = useState<'success' | 'error'>('success');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const loadProfile = async () => {
      if (!isAuthenticated) {
        if (isMounted) {
          setErrorMessage('Bạn cần đăng nhập để chỉnh sửa hồ sơ.');
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(undefined);

        const profileMeResponse = await getProfileMe();
        const username = profileMeResponse.data?.username?.trim();

        if (!username) {
          throw new ApiError('Không tìm thấy username để chỉnh sửa hồ sơ.', 400);
        }

        const profileResponse = await getProfileByUsername(username);

        if (!isMounted) {
          return;
        }

        const nextProfile = profileResponse.data;
        setFullName(nextProfile?.fullName ?? '');
        setBio(nextProfile?.bio ?? '');
        setAddress(nextProfile?.address ?? '');
        setSkillsInput(normalizeSkillsInput(nextProfile?.skills));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Không thể tải dữ liệu hồ sơ để chỉnh sửa');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [isAuthenticated]);

  const skillPreview = useMemo(() => buildSkillArray(skillsInput), [skillsInput]);

  const handleSave = async () => {
    const payload = {
      fullName: fullName.trim(),
      bio: bio.trim(),
      address: address.trim(),
      skills: buildSkillArray(skillsInput),
    };

    try {
      setIsSaving(true);
      setErrorMessage(undefined);
      await updateProfile(payload);
      showToast('Đã cập nhật hồ sơ', 'success');
      router.back();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        showToast(error.message, 'error');
      } else {
        setErrorMessage('Không thể cập nhật hồ sơ');
        showToast('Không thể cập nhật hồ sơ', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable style={styles.circleButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color={colors.text} />
            </Pressable>
            <AppText variant="heading" style={styles.headerTitle}>
              Chỉnh sửa hồ sơ
            </AppText>
            <View style={styles.headerPlaceholder} />
          </View>

          {isLoading ? (
            <View style={styles.feedbackCard}>
              <ActivityIndicator size="small" color={colors.primary} />
              <AppText variant="body" color={colors.textMuted}>
                Đang tải dữ liệu hồ sơ...
              </AppText>
            </View>
          ) : null}

          {errorMessage && !isSaving ? (
            <View style={styles.feedbackCard}>
              <AppText variant="body" color={colors.tertiary}>
                {errorMessage}
              </AppText>
            </View>
          ) : null}

          {!isLoading ? (
            <>
              <View style={styles.section}>
                <AppText variant="heading" style={styles.sectionTitle}>
                  Thông tin cơ bản
                </AppText>

                <View style={styles.fieldGroup}>
                  <AppText variant="caption" color={colors.textMuted}>
                    Họ và tên
                  </AppText>
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Nhập họ và tên"
                    placeholderTextColor="#94A39A"
                    style={styles.input}
                    maxLength={50}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <AppText variant="caption" color={colors.textMuted}>
                    Địa chỉ
                  </AppText>
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Nhập địa chỉ"
                    placeholderTextColor="#94A39A"
                    style={styles.input}
                    maxLength={100}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <AppText variant="heading" style={styles.sectionTitle}>
                  Giới thiệu
                </AppText>

                <View style={styles.fieldGroup}>
                  <AppText variant="caption" color={colors.textMuted}>
                    Mô tả ngắn
                  </AppText>
                  <TextInput
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Viết vài dòng về bản thân"
                    placeholderTextColor="#94A39A"
                    style={[styles.input, styles.multilineInput]}
                    multiline
                    textAlignVertical="top"
                    maxLength={300}
                  />
                  <AppText variant="caption" color={colors.textMuted}>
                    {bio.trim().length}/300 ký tự
                  </AppText>
                </View>
              </View>

              <View style={styles.section}>
                <AppText variant="heading" style={styles.sectionTitle}>
                  Kỹ năng
                </AppText>

                <View style={styles.fieldGroup}>
                  <AppText variant="caption" color={colors.textMuted}>
                    Nhập kỹ năng, cách nhau bằng dấu phẩy
                  </AppText>
                  <TextInput
                    value={skillsInput}
                    onChangeText={setSkillsInput}
                    placeholder="Ví dụ: React Native, TypeScript, Node.js"
                    placeholderTextColor="#94A39A"
                    style={[styles.input, styles.multilineInput]}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {skillPreview.length > 0 ? (
                  <View style={styles.skillsWrap}>
                    {skillPreview.map((skill) => (
                      <View key={skill} style={styles.skillChip}>
                        <AppText variant="caption" color={colors.primaryDark}>
                          {skill}
                        </AppText>
                      </View>
                    ))}
                  </View>
                ) : (
                  <AppText variant="body" color={colors.textMuted}>
                    Chưa có kỹ năng nào được nhập.
                  </AppText>
                )}
              </View>

              <View style={styles.footerSpace} />
            </>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && !isSaving ? styles.saveButtonPressed : null,
              isSaving ? styles.saveButtonDisabled : null,
            ]}
            onPress={() => void handleSave()}
            disabled={isSaving || isLoading}>
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Feather name="save" size={18} color={colors.white} />
            )}
            <AppText variant="bodyStrong" color={colors.white}>
              {isSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </AppText>
          </Pressable>
        </View>

        <AppToast visible={isToastVisible} message={toastMessage} tone={toastTone} bottomOffset={76} />
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
    paddingHorizontal: spacing.lg,
    paddingTop: 48,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  multilineInput: {
    minHeight: 120,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    maxWidth: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  footerSpace: {
    height: 82,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
