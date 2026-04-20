import { useState } from 'react';
import {
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
import { AuthButton } from '@/src/features/auth/components/auth-button';
import { AuthCheckbox } from '@/src/features/auth/components/auth-checkbox';
import { applicationData } from '@/src/features/job-application/data';
import {
  ApplicationCvPicker,
  ApplicationOptionCard,
} from '@/src/features/job-application/components/application-option-card';
import { CvLibrarySheet } from '@/src/features/job-application/components/cv-library-sheet';
import { colors, radius, spacing } from '@/src/theme';

export function JobApplicationScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

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
                title={applicationData.cvTitle}
                subtitle={applicationData.cvUpdatedAt}
                onPress={() => setSheetVisible(true)}
              />
            </ApplicationOptionCard>

            <ApplicationOptionCard title="Tải CV lên từ điện thoại" />
          </View>

          <View style={styles.section}>
            <AppText variant="heading" style={styles.sectionTitle}>
              Địa điểm làm việc mong muốn <AppText variant="heading" color={colors.tertiary}>*</AppText>
            </AppText>
            <View style={styles.fieldBox}>
              <View style={styles.locationChip}>
                <AppText variant="body" style={styles.locationText}>
                  {applicationData.desiredLocation}
                </AppText>
                <Feather name="x" size={16} color="#6B7280" />
              </View>
            </View>
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
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AuthButton label="Ứng tuyển" style={styles.submitButton} />
        </View>
      </KeyboardAvoidingView>

      <CvLibrarySheet
        visible={sheetVisible}
        title={applicationData.cvTitle}
        subtitle={applicationData.cvUpdatedAt}
        onClose={() => setSheetVisible(false)}
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
  fieldBox: {
    minHeight: 64,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'center',
  },
  locationChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationText: {
    color: colors.text,
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
