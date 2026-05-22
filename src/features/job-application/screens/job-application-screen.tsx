import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  InteractionManager,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { AppToast } from '@/src/components/ui/app-toast';
import { AuthButton } from '@/src/features/auth/components/auth-button';
import { AuthCheckbox } from '@/src/features/auth/components/auth-checkbox';
import { applicationData } from '@/src/features/job-application/data';
import {
  ApplicationCvPicker,
  ApplicationOptionCard,
} from '@/src/features/job-application/components/application-option-card';
import { CvLibrarySheet } from '@/src/features/job-application/components/cv-library-sheet';
import { applyToJob, createResume, getMyResumes } from '@/src/features/job-application/services/job-application-api';
import type { ResumeItem } from '@/src/features/job-application/types';
import { ApiError } from '@/src/lib/api/api-error';
import { getAccessToken } from '@/src/lib/auth/token-store';
import { uploadFiles } from '@/src/lib/uploadthing';
import { colors, radius, spacing } from '@/src/theme';

function waitForUploadUiFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => resolve());
    });
  });
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

export function JobApplicationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [agreed, setAgreed] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>();
  const [resumeError, setResumeError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastTone, setToastTone] = useState<'success' | 'error'>('success');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedResume = resumes.find((item) => item._id === selectedResumeId) ?? resumes[0];

  const showToast = (message: string, tone: 'success' | 'error') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(message);
    setToastTone(tone);
    setIsToastVisible(true);

    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2800);
  };

  useEffect(() => {
    let isMounted = true;

    const loadResumes = async () => {
      try {
        setIsLoadingResumes(true);
        setResumeError(undefined);
        const response = await getMyResumes();

        if (!isMounted) {
          return;
        }

        const nextResumes = response.data;
        setResumes(nextResumes);

        const defaultResume = nextResumes.find((item) => item.is_default) ?? nextResumes[0];
        setSelectedResumeId(defaultResume?._id);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setResumeError(error.message);
        } else {
          setResumeError('Không thể tải thư viện CV');
        }
      } finally {
        if (isMounted) {
          setIsLoadingResumes(false);
        }
      }
    };

    void loadResumes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  }, []);

  const handleUploadResume = async () => {
    if (isUploadingResume) {
      return;
    }

    try {
      setResumeError(undefined);

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

      setIsUploadingResume(true);
      await waitForUploadUiFrame();

      const pickedFile = {
        uri: selectedAsset.uri,
        name: selectedAsset.name,
        type: selectedAsset.mimeType ?? 'application/octet-stream',
        size: selectedAsset.size ?? 0,
        lastModified: Date.now(),
      } as File;

      const accessToken = getAccessToken();
      const uploadedFiles = await uploadFiles('userResume', {
        files: [pickedFile],
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
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
      setSelectedResumeId(createdResume.data._id);
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

  const handleSubmit = async () => {
    const jobId = params.id;

    setSubmitError(undefined);

    if (!jobId) {
      setSubmitError('Không tìm thấy công việc để ứng tuyển');
      showToast('Không tìm thấy công việc để ứng tuyển', 'error');
      return;
    }

    if (!selectedResume?._id) {
      setSubmitError('Vui lòng chọn CV để ứng tuyển');
      showToast('Vui lòng chọn CV để ứng tuyển', 'error');
      return;
    }

    if (!agreed) {
      setSubmitError('Bạn cần đồng ý thỏa thuận dữ liệu cá nhân');
      showToast('Bạn cần đồng ý thỏa thuận dữ liệu cá nhân', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await applyToJob(jobId, {
        cv_id: selectedResume._id,
        cover_letter: coverLetter.trim() || undefined,
      });

      showToast(response.message || 'Ứng tuyển thành công', 'success');
      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        showToast(error.message, 'error');
      } else {
        setSubmitError('Không thể gửi hồ sơ ứng tuyển');
        showToast('Không thể gửi hồ sơ ứng tuyển', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <AppText variant="title" style={styles.headerTitle}>
            Ứng tuyển
          </AppText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <AppText variant="heading" style={styles.sectionTitle}>
              CV ứng tuyển
            </AppText>

            <ApplicationOptionCard title="CV từ thư viện của tôi" selected onPress={() => setSheetVisible(true)}>
              <ApplicationCvPicker
                title={selectedResume?.title ?? 'Chưa có CV nào'}
                subtitle={selectedResume ? formatResumeUpdatedAt(selectedResume.updated_at) : 'Hãy chọn từ thư viện hoặc tải CV mới'}
                onPress={() => setSheetVisible(true)}
              />
            </ApplicationOptionCard>

            <ApplicationOptionCard
              title="Tải CV lên từ điện thoại"
              onPress={() => {
                void handleUploadResume();
              }}
            />
            {isUploadingResume ? (
              <AppText variant="caption" color={colors.textMuted}>
                Đang tải CV từ điện thoại...
              </AppText>
            ) : null}
            {isLoadingResumes ? (
              <AppText variant="caption" color={colors.textMuted}>
                Đang tải thư viện CV...
              </AppText>
            ) : null}
            {resumeError ? (
              <AppText variant="caption" color={colors.tertiary}>
                {resumeError}
              </AppText>
            ) : null}
          </View>

          <View style={styles.section}>
            <AppText variant="heading" style={styles.sectionTitle}>
              Thư giới thiệu
            </AppText>
            <TextInput
              multiline
              textAlignVertical="top"
              style={styles.textarea}
              placeholder={applicationData.coverLetterPlaceholder}
              placeholderTextColor="#9CA3AF"
              value={coverLetter}
              onChangeText={setCoverLetter}
              maxLength={2000}
            />
          </View>

          <View style={styles.section}>
            <AppText variant="heading" style={styles.sectionTitle}>
              Lưu ý
            </AppText>
            <View style={styles.notes}>
              <View style={styles.noteRow}>
                <AppText variant="body" style={styles.noteNumber}>
                  1.
                </AppText>
                <AppText variant="body" style={styles.noteText}>
                  {applicationData.notes[0].split('hotro@topcv.vn')[0]}
                  <AppText variant="body" color={colors.primaryLink} style={styles.linkText}>
                    hotro@topcv.vn
                  </AppText>
                  {' để được hỗ trợ kịp thời.'}
                </AppText>
              </View>
              <View style={styles.noteRow}>
                <AppText variant="body" style={styles.noteNumber}>
                  2.
                </AppText>
                <AppText variant="body" style={styles.noteText}>
                  Tìm hiểu thêm kinh nghiệm phòng tránh lừa đảo{' '}
                  <AppText variant="body" color={colors.primaryLink} style={styles.linkText}>
                    tại đây.
                  </AppText>
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <AuthCheckbox value={agreed} onChange={setAgreed}>
              <AppText variant="body" color={colors.textMuted} style={styles.agreementText}>
                Tôi đã đọc và đồng ý với{' '}
                <AppText variant="body" color={colors.primaryLink} style={styles.linkText}>
                  Thỏa thuận sử dụng dữ liệu cá nhân
                </AppText>{' '}
                giữa tôi và Nhà tuyển dụng.
              </AppText>
            </AuthCheckbox>
            {submitError ? (
              <AppText variant="caption" color={colors.tertiary}>
                {submitError}
              </AppText>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AuthButton
            label={isSubmitting ? 'Dang ung tuyen...' : 'Ứng tuyển'}
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting || isLoadingResumes || isUploadingResume}
          />
        </View>
      </KeyboardAvoidingView>

      <CvLibrarySheet
        visible={sheetVisible}
        items={resumes.map((item) => ({
          id: item._id,
          title: item.title,
          subtitle: formatResumeUpdatedAt(item.updated_at),
        }))}
        selectedId={selectedResumeId}
        onSelect={setSelectedResumeId}
        onClose={() => setSheetVisible(false)}
      />

      <AppToast
        visible={isToastVisible}
        message={toastMessage}
        tone={toastTone}
        bottomOffset={80}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 24, 39, 0.06)',
  },
  headerButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
  },
  headerSpacer: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
  },
  textarea: {
    minHeight: 132,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.lg,
    padding: spacing.lg,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  notes: {
    gap: spacing.xl,
  },
  noteRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  noteNumber: {
    color: colors.text,
  },
  noteText: {
    flex: 1,
    color: colors.text,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  agreementText: {
    flex: 1,
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
  submitButton: {
    borderRadius: radius.md,
  },
});
