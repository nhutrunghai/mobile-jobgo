import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type CvLibrarySheetProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
};

export function CvLibrarySheet({
  visible,
  title,
  subtitle,
  onClose,
}: CvLibrarySheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <AppText variant="title" style={styles.sheetTitle}>
              CV từ thư viện của tôi
            </AppText>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color="#98A2B3" />
            </Pressable>
          </View>

          <View style={styles.body}>
            <AppText variant="bodyStrong" color={colors.textMuted} style={styles.sectionLabel}>
              CV ONLINE
            </AppText>
            <View style={styles.card}>
              <View style={styles.radioSelected}>
                <View style={styles.radioDot} />
              </View>
              <View style={styles.cardText}>
                <AppText variant="body" style={styles.cardTitle}>
                  {title}
                </AppText>
                <AppText variant="caption" color={colors.textMuted}>
                  {subtitle}
                </AppText>
              </View>
              <AppText variant="bodyStrong" color={colors.primaryLink}>
                Xem CV
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.24)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#F7F8FB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 360,
    overflow: 'hidden',
  },
  sheetHeader: {
    backgroundColor: colors.surface,
    minHeight: 84,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 24, 39, 0.06)',
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  cardText: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    color: colors.text,
  },
});
