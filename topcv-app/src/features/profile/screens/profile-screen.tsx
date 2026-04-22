import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';

import { AppText } from '@/src/components/ui/app-text';
import { bottomNavItems } from '@/src/features/home/data';
import { BottomNav } from '@/src/features/home/components/bottom-nav';
import {
  accountSettings,
  appVersion,
  cvActions,
  jobManagementItems,
  profileHeader,
  profileToggles,
  supportItems,
} from '@/src/features/profile/data';
import { logoutCurrentUser } from '@/src/features/auth/services/auth-api';
import { createResume, deleteResume, getMyResumes } from '@/src/features/job-application/services/job-application-api';
import type { ResumeItem } from '@/src/features/job-application/types';
import { getProfileMe } from '@/src/features/profile/services/profile-api';
import type { ProfileMe } from '@/src/features/profile/types';
import { getFavoriteJobs, removeFavoriteJob } from '@/src/features/favorites/services/favorite-api';
import type { FavoriteJobsResponse } from '@/src/features/favorites/types';
import { ApiError } from '@/src/lib/api/api-error';
import { useAuth } from '@/src/lib/auth/auth-provider';
import { getAccessToken } from '@/src/lib/auth/token-store';
import { uploadFiles } from '@/src/lib/uploadthing';
import { colors, radius, spacing } from '@/src/theme';

type SettingRowProps = {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  destructive?: boolean;
  onPress?: () => void;
};

function SettingRow({ title, icon, destructive, onPress }: SettingRowProps) {
  const textColor = destructive ? '#FF4D4F' : colors.text;
  const iconColor = destructive ? '#FF4D4F' : '#748197';

  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingLeft}>
        {icon ? <Feather name={icon} size={19} color={iconColor} /> : null}
        <AppText variant="body" color={textColor} style={styles.settingText}>
          {title}
        </AppText>
      </View>
      <Feather name="chevron-right" size={20} color="#A0AEC0" />
    </Pressable>
  );
}

function formatResumeUpdatedAt(value?: string) {
  if (!value) {
    return 'Cập nhật gần đây';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Cập nhật gần đây';
  }

  return `Cập nhật lần cuối: ${new Intl.DateTimeFormat('vi-VN').format(date)}`;
}

function getResumeTitleFromFileName(fileName: string) {
  const normalizedName = fileName.trim();

  if (!normalizedName) {
    return 'CV mới tải lên';
  }

  return normalizedName.replace(/\.[^/.]+$/, '') || normalizedName;
}

function resolveCompanyLogo(logo?: string) {
  if (!logo) {
    return profileHeader.avatar;
  }

  const trimmedLogo = logo.trim();

  if (!trimmedLogo) {
    return profileHeader.avatar;
  }

  try {
    const parsedUrl = new URL(trimmedLogo);

    if (parsedUrl.hostname === 'example.com' || parsedUrl.hostname.endsWith('.example.com')) {
      return profileHeader.avatar;
    }

    return trimmedLogo;
  } catch {
    return profileHeader.avatar;
  }
}

function formatCompactMoney(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return Number.isInteger(millions) ? `${millions} triệu` : `${millions.toFixed(1)} triệu`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} nghìn`;
  }

  return `${value}`;
}

function formatFavoriteJobSalary(item: FavoriteJobsResponse['data']['jobs'][number]) {
  const salary = item.job.salary ?? {};

  if (salary.is_negotiable) {
    return 'Thỏa thuận';
  }

  if (salary.min && salary.max) {
    return `${formatCompactMoney(salary.min)} - ${formatCompactMoney(salary.max)}`;
  }

  if (salary.min) {
    return `Từ ${formatCompactMoney(salary.min)}`;
  }

  if (salary.max) {
    return `Đến ${formatCompactMoney(salary.max)}`;
  }

  return 'Thỏa thuận';
}

function formatFavoriteSavedAt(value?: string) {
  if (!value) {
    return 'Lưu gần đây';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Lưu gần đây';
  }

  return `Lưu ngày ${new Intl.DateTimeFormat('vi-VN').format(date)}`;
}

function withAvatarVersion(uri: string, version: number) {
  if (!uri.trim()) {
    return uri;
  }

  try {
    const url = new URL(uri);
    url.searchParams.set('avatar_v', String(version));
    return url.toString();
  } catch {
    const separator = uri.includes('?') ? '&' : '?';
    return `${uri}${separator}avatar_v=${version}`;
  }
}

export function ProfileScreen() {
  const router = useRouter();
  const { clearTokens, isAuthenticated } = useAuth();
  const [jobSearchEnabled, setJobSearchEnabled] = useState<boolean>(profileToggles[0].enabled);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileMe, setProfileMe] = useState<ProfileMe | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string>();
  const [cvModalVisible, setCvModalVisible] = useState(false);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [deletingResumeId, setDeletingResumeId] = useState<string>();
  const [resumeError, setResumeError] = useState<string>();
  const [savedJobsModalVisible, setSavedJobsModalVisible] = useState(false);
  const [savedJobs, setSavedJobs] = useState<FavoriteJobsResponse['data']['jobs']>([]);
  const [isLoadingSavedJobs, setIsLoadingSavedJobs] = useState(false);
  const [savedJobsError, setSavedJobsError] = useState<string>();
  const [removingSavedJobId, setRemovingSavedJobId] = useState<string>();
  const [avatarVersion, setAvatarVersion] = useState(() => Date.now());

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

  const loadProfileMe = useCallback(async () => {
    if (!isAuthenticated) {
      setProfileMe(null);
      setProfileError(undefined);
      return;
    }

    try {
      setIsLoadingProfile(true);
      setProfileError(undefined);
      const response = await getProfileMe();
      setProfileMe(response.data);
      setAvatarVersion(Date.now());
    } catch (error) {
      if (error instanceof ApiError) {
        setProfileError(error.message);
      } else {
        setProfileError('Không thể tải thông tin tài khoản');
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void loadProfileMe();
  }, [loadProfileMe]);

  useFocusEffect(
    useCallback(() => {
      void loadProfileMe();
    }, [loadProfileMe])
  );

  const displayName = profileMe?.fullName || profileHeader.name;
  const displayId = profileMe?.username || profileMe?._id || profileHeader.candidateId;
  const avatarUri = withAvatarVersion(profileMe?.avatar || profileHeader.avatar, avatarVersion);

  const loadResumes = async () => {
    if (!isAuthenticated) {
      setResumes([]);
      setResumeError('Bạn cần đăng nhập để xem danh sách CV.');
      return;
    }

    try {
      setIsLoadingResumes(true);
      setResumeError(undefined);
      const response = await getMyResumes();
      setResumes(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        setResumeError(error.message);
      } else {
        setResumeError('Không thể tải danh sách CV');
      }
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const openUploadedCvList = () => {
    setCvModalVisible(true);
    void loadResumes();
  };

  const loadSavedJobs = async () => {
    if (!isAuthenticated) {
      setSavedJobs([]);
      setSavedJobsError('Bạn cần đăng nhập để xem việc làm đã lưu.');
      return;
    }

    try {
      setIsLoadingSavedJobs(true);
      setSavedJobsError(undefined);
      const response = await getFavoriteJobs(100);
      setSavedJobs(response.data.jobs);
    } catch (error) {
      if (error instanceof ApiError) {
        setSavedJobsError(error.message);
      } else {
        setSavedJobsError('Không thể tải danh sách việc làm đã lưu');
      }
    } finally {
      setIsLoadingSavedJobs(false);
    }
  };

  const openSavedJobsList = () => {
    setSavedJobsModalVisible(true);
    void loadSavedJobs();
  };

  const handleUploadResume = async () => {
    if (!isAuthenticated) {
      setCvModalVisible(true);
      setResumeError('Bạn cần đăng nhập để tải CV lên.');
      return;
    }

    try {
      setCvModalVisible(true);
      setResumeError(undefined);
      setIsUploadingResume(true);

      const pickedDocument = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
      });

      if (pickedDocument.canceled) {
        return;
      }

      const selectedAsset = pickedDocument.assets[0];

      if (!selectedAsset) {
        setResumeError('Không tìm thấy file CV đã chọn');
        return;
      }

      const fileBlob = await fetch(selectedAsset.uri).then((response) => response.blob());
      const pickedFile = Object.assign(
        new File([fileBlob], selectedAsset.name, {
          type: selectedAsset.mimeType ?? 'application/octet-stream',
        }),
        {
          uri: selectedAsset.uri,
        },
      );

      const accessToken = getAccessToken();
      const uploadedFiles = await uploadFiles('userResume', {
        files: [pickedFile],
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      const uploadedResume = uploadedFiles[0];

      if (!uploadedResume) {
        setResumeError('Không thể tải CV lên');
        return;
      }

      const createdResume = await createResume({
        title: getResumeTitleFromFileName(uploadedResume.name),
        cv_url: uploadedResume.url,
        resume_file_key: uploadedResume.key,
        is_default: resumes.length === 0,
      });

      setResumes((currentResumes) => [createdResume.data, ...currentResumes]);
      setResumeError(undefined);
    } catch (error) {
      if (error instanceof ApiError) {
        setResumeError(error.message);
      } else if (error instanceof Error) {
        setResumeError(error.message);
      } else {
        setResumeError('Không thể tải CV từ thiết bị lên');
      }
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleDeleteResume = (resumeId: string) => {
    Alert.alert('Xóa CV?', 'CV này sẽ bị xóa khỏi tài khoản của bạn.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          void removeResume(resumeId);
        },
      },
    ]);
  };

  const removeResume = async (resumeId: string) => {
    try {
      setDeletingResumeId(resumeId);
      setResumeError(undefined);
      await deleteResume(resumeId);
      setResumes((currentResumes) => currentResumes.filter((resume) => resume._id !== resumeId));
    } catch (error) {
      if (error instanceof ApiError) {
        setResumeError(error.message);
      } else {
        setResumeError('Không thể xóa CV');
      }
    } finally {
      setDeletingResumeId(undefined);
    }
  };

  const handleOpenManagementItem = (itemKey: string) => {
    if (itemKey === 'profile-detail') {
      router.push('/profile/me');
      return;
    }

    if (itemKey === 'settings-hub') {
      router.push('/profile/settings');
      return;
    }

    if (itemKey === 'saved-jobs') {
      openSavedJobsList();
      return;
    }

    if (itemKey === 'applied-jobs') {
      router.push('/(tabs)/applications');
    }
  };

  const handleRemoveSavedJob = async (jobId: string) => {
    try {
      setRemovingSavedJobId(jobId);
      setSavedJobsError(undefined);
      await removeFavoriteJob(jobId);
      setSavedJobs((currentSavedJobs) => currentSavedJobs.filter((item) => item.job_id !== jobId));
    } catch (error) {
      if (error instanceof ApiError) {
        setSavedJobsError(error.message);
      } else {
        setSavedJobsError('Không thể bỏ lưu việc làm');
      }
    } finally {
      setRemovingSavedJobId(undefined);
    }
  };

  const handleOpenAccountSetting = (itemKey: string) => {
    if (itemKey === 'password') {
      router.push('/profile/change-password');
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <View style={styles.profileIdentity}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
              </View>
              <View style={styles.identityText}>
                <AppText variant="heading" style={styles.name}>
                  {isLoadingProfile ? 'Đang tải...' : displayName}
                </AppText>
                <AppText variant="body" color="rgba(255,255,255,0.82)">
                  ID: {displayId}
                </AppText>
                {profileError ? (
                  <AppText variant="caption" color="rgba(255,255,255,0.86)" numberOfLines={1}>
                    {profileError}
                  </AppText>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.panel}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <View style={styles.toggleIconWrap}>
                  <Feather name={profileToggles[0].icon} size={18} color={colors.primary} />
                </View>
                <AppText variant="bodyStrong" style={styles.toggleLabel}>
                  {profileToggles[0].title}
                </AppText>
              </View>
              <Switch
                value={jobSearchEnabled}
                onValueChange={setJobSearchEnabled}
                trackColor={{ false: '#DDE4F0', true: colors.primary }}
                thumbColor={colors.white}
                ios_backgroundColor="#DDE4F0"
              />
            </View>
          </View>

          <View style={styles.panel}>
            <AppText variant="bodyStrong" style={styles.sectionTitle}>
              CV của tôi
            </AppText>
            <View style={styles.cvActionRow}>
              {cvActions.map((item, index) => (
                <Pressable
                  key={item.key}
                  style={({ pressed }) => [
                    styles.cvActionItem,
                    index < cvActions.length - 1 ? styles.cvDivider : null,
                    pressed ? styles.cvActionPressed : null,
                  ]}
                  onPress={item.key === 'uploaded-cv' ? openUploadedCvList : handleUploadResume}>
                  <Feather name={item.icon} size={18} color={colors.primary} />
                  <AppText variant="caption" style={styles.cvActionLabel}>
                    {item.title}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.managementGrid}>
            {jobManagementItems.map((item) => (
              <Pressable
                key={item.key}
                style={styles.managementCard}
                onPress={() => handleOpenManagementItem(item.key)}>
                <Feather name={item.icon} size={24} color={colors.primary} />
                <AppText variant="body" style={styles.managementLabel}>
                  {item.title}
                </AppText>
              </Pressable>
            ))}
          </View>

          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Feather name="map-pin" size={20} color={colors.white} />
              </View>
              <View style={styles.bannerTextWrap}>
                <AppText variant="bodyStrong" color={colors.white}>
                  Khám phá việc làm gần bạn
                </AppText>
                <AppText variant="caption" color="rgba(255,255,255,0.82)">
                  Nhận gợi ý việc làm phù hợp
                </AppText>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={colors.white} />
          </View>

          <View style={styles.listBlock}>
            {accountSettings.map((item, index) => (
              <View key={item.key}>
                <SettingRow
                  title={item.title}
                  icon={item.icon}
                  destructive={item.destructive}
                  onPress={() => handleOpenAccountSetting(item.key)}
                />
                {index < accountSettings.length - 1 ? <View style={styles.listDivider} /> : null}
              </View>
            ))}
          </View>

          <View style={styles.listBlock}>
            {supportItems.map((item, index) => (
              <View key={item.key}>
                <SettingRow title={item.title} />
                {index < supportItems.length - 1 ? <View style={styles.listDivider} /> : null}
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <AppText variant="caption" color="#A0AEC0">
              {appVersion}
            </AppText>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                isLoggingOut ? styles.logoutButtonDisabled : null,
                pressed && !isLoggingOut ? styles.logoutButtonPressed : null,
              ]}
              disabled={isLoggingOut}
              onPress={async () => {
                try {
                  setIsLoggingOut(true);
                  await logoutCurrentUser();
                } finally {
                  await clearTokens();
                  router.replace('/(auth)/login');
                  setIsLoggingOut(false);
                }
              }}>
              <Feather name="log-out" size={18} color="#FF4D4F" />
              <AppText variant="bodyStrong" color="#FF4D4F">
                {isLoggingOut ? 'Dang xuat...' : 'Đăng xuất'}
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <BottomNav items={navItems} activeKey="profile" />

      <Modal visible={cvModalVisible} transparent animationType="slide" onRequestClose={() => setCvModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.cvModal}>
            <View style={styles.cvModalHeader}>
              <View>
                <AppText variant="heading" style={styles.cvModalTitle}>
                  CV đã tải lên
                </AppText>
                <AppText variant="caption" color={colors.textMuted}>
                  Danh sách CV từ tài khoản của bạn
                </AppText>
              </View>
              <Pressable style={styles.modalCloseButton} onPress={() => setCvModalVisible(false)}>
                <Feather name="x" size={20} color={colors.text} />
              </Pressable>
            </View>

            {isLoadingResumes ? (
              <View style={styles.cvFeedback}>
                <ActivityIndicator size="small" color={colors.primary} />
                <AppText variant="body" color={colors.textMuted}>
                  Đang tải danh sách CV...
                </AppText>
              </View>
            ) : null}

            {resumeError ? (
              <View style={styles.cvFeedback}>
                <AppText variant="body" color={colors.tertiary}>
                  {resumeError}
                </AppText>
              </View>
            ) : null}

            {!isLoadingResumes && !resumeError && resumes.length === 0 ? (
              <View style={styles.cvFeedback}>
                <AppText variant="body" color={colors.textMuted}>
                  Bạn chưa tải CV nào lên.
                </AppText>
              </View>
            ) : null}

            <ScrollView style={styles.cvList} contentContainerStyle={styles.cvListContent}>
              {resumes.map((resume) => (
                <Pressable
                  key={resume._id}
                  style={({ pressed }) => [styles.cvCard, pressed ? styles.cvCardPressed : null]}
                  onPress={() => {
                    if (resume.cv_url) {
                      void Linking.openURL(resume.cv_url);
                    }
                  }}>
                  <View style={styles.cvCardIcon}>
                    <Feather name="file-text" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.cvCardCopy}>
                    <AppText variant="bodyStrong" style={styles.cvCardTitle} numberOfLines={1}>
                      {resume.title}
                    </AppText>
                    <AppText variant="caption" color={colors.textMuted}>
                      {formatResumeUpdatedAt(resume.updated_at)}
                    </AppText>
                  </View>
                  {resume.is_default ? (
                    <View style={styles.defaultBadge}>
                      <AppText variant="caption" color={colors.primaryDark}>
                        Mặc định
                      </AppText>
                    </View>
                  ) : null}
                  <Feather name="external-link" size={16} color={colors.textMuted} />
                  <Pressable
                    style={styles.deleteCvButton}
                    onPress={(event) => {
                      event.stopPropagation();
                      handleDeleteResume(resume._id);
                    }}
                    disabled={deletingResumeId === resume._id}>
                    {deletingResumeId === resume._id ? (
                      <ActivityIndicator size="small" color={colors.tertiary} />
                    ) : (
                      <Feather name="trash-2" size={16} color={colors.tertiary} />
                    )}
                  </Pressable>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={[styles.uploadCvButton, isUploadingResume ? styles.uploadCvButtonDisabled : null]}
              onPress={handleUploadResume}
              disabled={isUploadingResume}>
              {isUploadingResume ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Feather name="upload" size={17} color={colors.white} />
              )}
              <AppText variant="bodyStrong" color={colors.white}>
                {isUploadingResume ? 'Đang tải CV lên...' : 'Tải CV lên'}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={savedJobsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSavedJobsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.cvModal}>
            <View style={styles.cvModalHeader}>
              <View>
                <AppText variant="heading" style={styles.cvModalTitle}>
                  Việc làm đã lưu
                </AppText>
                <AppText variant="caption" color={colors.textMuted}>
                  Danh sách công việc bạn đã bookmark
                </AppText>
              </View>
              <Pressable style={styles.modalCloseButton} onPress={() => setSavedJobsModalVisible(false)}>
                <Feather name="x" size={20} color={colors.text} />
              </Pressable>
            </View>

            {isLoadingSavedJobs ? (
              <View style={styles.cvFeedback}>
                <ActivityIndicator size="small" color={colors.primary} />
                <AppText variant="body" color={colors.textMuted}>
                  Đang tải việc làm đã lưu...
                </AppText>
              </View>
            ) : null}

            {savedJobsError ? (
              <View style={styles.cvFeedback}>
                <AppText variant="body" color={colors.tertiary}>
                  {savedJobsError}
                </AppText>
              </View>
            ) : null}

            {!isLoadingSavedJobs && !savedJobsError && savedJobs.length === 0 ? (
              <View style={styles.cvFeedback}>
                <AppText variant="body" color={colors.textMuted}>
                  Bạn chưa lưu việc làm nào.
                </AppText>
              </View>
            ) : null}

            <ScrollView style={styles.cvList} contentContainerStyle={styles.cvListContent}>
              {savedJobs.map((item) => (
                <Pressable
                  key={item.job_id}
                  style={({ pressed }) => [styles.savedJobCard, pressed ? styles.cvCardPressed : null]}
                  onPress={() => {
                    setSavedJobsModalVisible(false);
                    router.push({
                      pathname: '/job/[id]',
                      params: { id: item.job_id },
                    });
                  }}>
                  <View style={styles.savedJobLogoWrap}>
                    <Image
                      source={{ uri: resolveCompanyLogo(item.company.logo) }}
                      style={styles.savedJobLogo}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.savedJobCopy}>
                    <AppText variant="bodyStrong" style={styles.savedJobTitle} numberOfLines={2}>
                      {item.job.title}
                    </AppText>
                    <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
                      {item.company.company_name}
                    </AppText>
                    <View style={styles.savedJobMetaRow}>
                      <View style={styles.savedJobMetaBadge}>
                        <Feather name="map-pin" size={12} color={colors.primaryDark} />
                        <AppText variant="caption" color={colors.primaryDark} numberOfLines={1}>
                          {item.job.location}
                        </AppText>
                      </View>
                      <View style={styles.savedJobMetaBadge}>
                        <Feather name="dollar-sign" size={12} color={colors.primaryDark} />
                        <AppText variant="caption" color={colors.primaryDark} numberOfLines={1}>
                          {formatFavoriteJobSalary(item)}
                        </AppText>
                      </View>
                    </View>
                    <AppText variant="caption" color={colors.textMuted}>
                      {formatFavoriteSavedAt(item.favorited_at)}
                    </AppText>
                  </View>
                  <Pressable
                    style={styles.deleteCvButton}
                    onPress={(event) => {
                      event.stopPropagation();
                      void handleRemoveSavedJob(item.job_id);
                    }}
                    disabled={removingSavedJobId === item.job_id}>
                    {removingSavedJobId === item.job_id ? (
                      <ActivityIndicator size="small" color={colors.tertiary} />
                    ) : (
                      <Feather name="bookmark" size={16} color={colors.tertiary} />
                    )}
                  </Pressable>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F3F2',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingTop: 42,
    paddingHorizontal: spacing.lg,
    paddingBottom: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroHeader: {
    alignItems: 'flex-start',
  },
  profileIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.white,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  identityText: {
    flex: 1,
  },
  name: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    marginTop: -36,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  toggleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    flex: 1,
    color: colors.text,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#EDF1EE',
    marginVertical: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.lg,
  },
  cvActionRow: {
    flexDirection: 'row',
  },
  cvActionItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 64,
    paddingHorizontal: spacing.xs,
  },
  cvActionPressed: {
    opacity: 0.82,
  },
  cvDivider: {
    borderRightWidth: 1,
    borderRightColor: '#EDF1EE',
  },
  cvActionLabel: {
    textAlign: 'center',
    color: colors.text,
  },
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  managementCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  managementLabel: {
    color: colors.text,
    textAlign: 'center',
  },
  banner: {
    backgroundColor: colors.primary,
    minHeight: 56,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  bannerIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextWrap: {
    flex: 1,
  },
  listBlock: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  settingRow: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  listDivider: {
    height: 1,
    backgroundColor: '#EDF1EE',
    marginLeft: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoutButtonPressed: {
    opacity: 0.85,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,18,15,0.38)',
    justifyContent: 'flex-end',
  },
  cvModal: {
    maxHeight: '78%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  cvModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cvModalTitle: {
    color: colors.text,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cvFeedback: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cvList: {
    maxHeight: 360,
  },
  cvListContent: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  cvCard: {
    minHeight: 72,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cvCardPressed: {
    opacity: 0.9,
  },
  cvCardIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cvCardCopy: {
    flex: 1,
    gap: 2,
  },
  cvCardTitle: {
    color: colors.text,
  },
  defaultBadge: {
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  deleteCvButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: '#FDECEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadCvButton: {
    minHeight: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  uploadCvButtonDisabled: {
    opacity: 0.7,
  },
  savedJobCard: {
    minHeight: 96,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  savedJobLogoWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceStrong,
    padding: spacing.xs,
  },
  savedJobLogo: {
    width: '100%',
    height: '100%',
  },
  savedJobCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  savedJobTitle: {
    color: colors.text,
  },
  savedJobMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  savedJobMetaBadge: {
    maxWidth: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
