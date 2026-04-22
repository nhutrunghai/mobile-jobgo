import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { AppText } from '@/src/components/ui/app-text';
import { AppToast } from '@/src/components/ui/app-toast';
import { profileHeader } from '@/src/features/profile/data';
import { getProfileByUsername, getProfileMe, updateProfileAvatar } from '@/src/features/profile/services/profile-api';
import type { ProfileMe, ProfilePublic } from '@/src/features/profile/types';
import { ApiError } from '@/src/lib/api/api-error';
import { getAccessToken } from '@/src/lib/auth/token-store';
import { useAuth } from '@/src/lib/auth/auth-provider';
import { uploadFiles } from '@/src/lib/uploadthing';
import { colors, radius, spacing } from '@/src/theme';

function getDisplayValue(value?: string, fallback?: string) {
  if (!value) {
    return fallback ?? 'Chưa cập nhật';
  }

  const trimmedValue = value.trim();

  return trimmedValue || fallback || 'Chưa cập nhật';
}

function formatJoinedDate(value?: string) {
  if (!value) {
    return 'Chưa có thông tin ngày tham gia';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Chưa có thông tin ngày tham gia';
  }

  return `Tham gia từ ${new Intl.DateTimeFormat('vi-VN').format(date)}`;
}

function getAvatarFileName(asset: ImagePicker.ImagePickerAsset) {
  const fileName = asset.fileName?.trim();

  if (fileName) {
    return fileName;
  }

  const uriParts = asset.uri.split('/');
  const lastSegment = uriParts[uriParts.length - 1]?.trim();

  if (lastSegment) {
    return lastSegment;
  }

  return `avatar-${Date.now()}.jpg`;
}

export function ProfileDetailScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [profileMe, setProfileMe] = useState<ProfileMe | null>(null);
  const [profile, setProfile] = useState<ProfilePublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfileMe(null);
      setProfile(null);
      setErrorMessage('Bạn cần đăng nhập để xem hồ sơ.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(undefined);

      const profileMeResponse = await getProfileMe();
      const currentUser = profileMeResponse.data;
      setProfileMe(currentUser);

      const username = currentUser?.username?.trim();

      if (!username) {
        setProfile(null);
        setErrorMessage('Không tìm thấy username để tải hồ sơ.');
        return;
      }

      const profileResponse = await getProfileByUsername(username);
      setProfile(profileResponse.data);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Không thể tải hồ sơ');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();

      return () => {
        if (toastTimeoutRef.current) {
          clearTimeout(toastTimeoutRef.current);
        }
      };
    }, [loadProfile])
  );

  const handleChangeAvatar = async () => {
    if (!isAuthenticated) {
      showToast('Bạn cần đăng nhập để đổi ảnh đại diện', 'error');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setErrorMessage(undefined);

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showToast('Bạn cần cấp quyền thư viện ảnh để đổi avatar', 'error');
        return;
      }

      const pickedImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (pickedImage.canceled || !pickedImage.assets.length) {
        return;
      }

      const selectedAsset = pickedImage.assets[0];

      if (!selectedAsset) {
        showToast('Không tìm thấy ảnh đã chọn', 'error');
        return;
      }

      const imageBlob = await fetch(selectedAsset.uri).then((response) => response.blob());
      const imageFile = Object.assign(
        new File([imageBlob], getAvatarFileName(selectedAsset), {
          type: selectedAsset.mimeType ?? 'image/jpeg',
        }),
        {
          uri: selectedAsset.uri,
        }
      );

      const accessToken = getAccessToken();
      const uploadedFiles = await uploadFiles('userAvatar', {
        files: [imageFile],
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      const uploadedAvatar = uploadedFiles[0];

      if (!uploadedAvatar?.url || !uploadedAvatar.key) {
        throw new Error('Không thể tải ảnh đại diện lên');
      }

      await updateProfileAvatar({
        avatar: uploadedAvatar.url,
        avatar_file_key: uploadedAvatar.key,
      });

      await loadProfile();
      showToast('Đã cập nhật ảnh đại diện', 'success');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Không thể cập nhật ảnh đại diện';
      setErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const profileSummary = useMemo(
    () => ({
      avatar: profile?.avatar || profileMe?.avatar || profileHeader.avatar,
      fullName: getDisplayValue(profile?.fullName || profileMe?.fullName, profileHeader.name),
      username: getDisplayValue(profile?.username || profileMe?.username),
      id: getDisplayValue(profile?._id || profileMe?._id, profileHeader.candidateId),
      bio: getDisplayValue(profile?.bio, 'Chưa có mô tả hồ sơ'),
      address: getDisplayValue(profile?.address),
      skills: profile?.skills?.filter((skill) => skill.trim().length > 0) ?? [],
      joinedAt: formatJoinedDate(profile?.created_at),
    }),
    [profile, profileMe]
  );

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.topBar}>
            <Pressable style={styles.circleButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color={colors.text} />
            </Pressable>
            <Pressable style={styles.editButton} onPress={() => router.push('/profile/edit')}>
              <Feather name="edit-2" size={16} color={colors.primaryDark} />
              <AppText variant="caption" color={colors.primaryDark}>
                Chỉnh sửa hồ sơ
              </AppText>
            </Pressable>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.avatarShell}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: profileSummary.avatar }} style={styles.avatar} contentFit="cover" />
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.avatarEditButton,
                  pressed && !isUploadingAvatar ? styles.avatarEditButtonPressed : null,
                  isUploadingAvatar ? styles.avatarEditButtonDisabled : null,
                ]}
                onPress={() => void handleChangeAvatar()}
                disabled={isUploadingAvatar}>
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Feather name="camera" size={15} color={colors.white} />
                )}
              </Pressable>
            </View>
            <View style={styles.heroCopy}>
              <AppText variant="caption" color="rgba(255,255,255,0.86)">
                Hồ sơ công khai
              </AppText>
              <AppText variant="title" style={styles.heroTitle}>
                {profileSummary.fullName}
              </AppText>
              <AppText variant="body" color="rgba(255,255,255,0.82)">
                @{profileSummary.username}
              </AppText>
            </View>
          </View>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaCard}>
              <AppText variant="caption" color="rgba(255,255,255,0.82)">
                Mã hồ sơ
              </AppText>
              <AppText variant="bodyStrong" color={colors.white} numberOfLines={1}>
                {profileSummary.id}
              </AppText>
            </View>
            <View style={styles.heroMetaCard}>
              <AppText variant="caption" color="rgba(255,255,255,0.82)">
                Trạng thái
              </AppText>
              <AppText variant="bodyStrong" color={colors.white} numberOfLines={1}>
                Công khai
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {isLoading ? (
            <View style={styles.feedbackCard}>
              <AppText variant="body" color={colors.textMuted}>
                Đang tải hồ sơ...
              </AppText>
            </View>
          ) : null}

          {errorMessage ? (
            <View style={styles.feedbackCard}>
              <AppText variant="body" color={colors.tertiary}>
                {errorMessage}
              </AppText>
            </View>
          ) : null}

          {!isLoading && !errorMessage ? (
            <>
              <View style={styles.section}>
                <AppText variant="heading" style={styles.sectionTitle}>
                  Giới thiệu
                </AppText>
                <AppText variant="body" color={colors.textMuted} style={styles.sectionBody}>
                  {profileSummary.bio}
                </AppText>
              </View>

              <View style={styles.section}>
                <AppText variant="heading" style={styles.sectionTitle}>
                  Thông tin hồ sơ
                </AppText>

                <View style={styles.infoList}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Feather name="user" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoCopy}>
                      <AppText variant="caption" color={colors.textMuted}>
                        Họ và tên
                      </AppText>
                      <AppText variant="bodyStrong" style={styles.infoValue}>
                        {profileSummary.fullName}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Feather name="map-pin" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoCopy}>
                      <AppText variant="caption" color={colors.textMuted}>
                        Địa chỉ
                      </AppText>
                      <AppText variant="bodyStrong" style={styles.infoValue}>
                        {profileSummary.address}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Feather name="calendar" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoCopy}>
                      <AppText variant="caption" color={colors.textMuted}>
                        Ngày tham gia
                      </AppText>
                      <AppText variant="bodyStrong" style={styles.infoValue}>
                        {profileSummary.joinedAt}
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <AppText variant="heading" style={styles.sectionTitle}>
                  Kỹ năng
                </AppText>

                {profileSummary.skills.length > 0 ? (
                  <View style={styles.skillsWrap}>
                    {profileSummary.skills.map((skill) => (
                      <View key={skill} style={styles.skillChip}>
                        <AppText variant="caption" color={colors.primaryDark} numberOfLines={1}>
                          {skill}
                        </AppText>
                      </View>
                    ))}
                  </View>
                ) : (
                  <AppText variant="body" color={colors.textMuted}>
                    Chưa cập nhật kỹ năng.
                  </AppText>
                )}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      <AppToast visible={isToastVisible} message={toastMessage} tone={toastTone} bottomOffset={22} />
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
    paddingBottom: spacing.xxxl,
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
  editButton: {
    minHeight: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatarShell: {
    position: 'relative',
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.32)',
    backgroundColor: colors.surface,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarEditButton: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditButtonPressed: {
    opacity: 0.92,
  },
  avatarEditButtonDisabled: {
    opacity: 0.76,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  heroTitle: {
    color: colors.white,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroMetaCard: {
    flex: 1,
    minHeight: 72,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
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
  sectionBody: {
    lineHeight: 23,
  },
  infoList: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCopy: {
    flex: 1,
    gap: 2,
  },
  infoValue: {
    color: colors.text,
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
});
