import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type CvLibrarySheetProps = {
  visible: boolean;
  items: {
    id: string;
    title: string;
    subtitle: string;
  }[];
  selectedId?: string;
  onSelect: (resumeId: string) => void;
  onClose: () => void;
};

export function CvLibrarySheet({
  visible,
  items,
  selectedId,
  onSelect,
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
            {items.map((item) => {
              const selected = item.id === selectedId;

              return (
                <Pressable
                  key={item.id}
                  style={styles.card}
                  onPress={() => {
                    onSelect(item.id);
                    onClose();
                  }}>
                  <View style={[styles.radio, selected ? styles.radioSelected : null]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={styles.cardText}>
                    <AppText variant="body" style={styles.cardTitle}>
                      {item.title}
                    </AppText>
                    <AppText variant="caption" color={colors.textMuted}>
                      {item.subtitle}
                    </AppText>
                  </View>
                  <AppText variant="bodyStrong" color={colors.primaryLink}>
                    Chọn
                  </AppText>
                </Pressable>
              );
            })}
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <AppText variant="body" color={colors.textMuted}>
                  Bạn chưa có CV nào trong thư viện.
                </AppText>
              </View>
            ) : null}
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
  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
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
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
