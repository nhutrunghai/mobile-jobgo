import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type ApplicationOptionCardProps = {
  title: string;
  selected?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
};

export function ApplicationOptionCard({
  title,
  selected,
  children,
  onPress,
}: ApplicationOptionCardProps) {
  return (
    <Pressable style={[styles.card, selected ? styles.cardSelected : null]} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.radio, selected ? styles.radioSelected : null]}>
          {selected ? <View style={styles.radioDot} /> : null}
        </View>
        <AppText variant="bodyStrong" style={styles.title}>
          {title}
        </AppText>
      </View>
      {children}
    </Pressable>
  );
}

type ApplicationCvPickerProps = {
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export function ApplicationCvPicker({
  title,
  subtitle,
  onPress,
}: ApplicationCvPickerProps) {
  return (
    <Pressable style={styles.picker} onPress={onPress}>
      <View style={styles.pickerText}>
        <AppText variant="body" style={styles.pickerTitle}>
          {title}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {subtitle}
        </AppText>
      </View>
      <Feather name="chevron-down" size={22} color="#98A2B3" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.surface,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  radio: {
    width: 22,
    height: 22,
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
  title: {
    color: colors.text,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.md,
    minHeight: 72,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  pickerText: {
    gap: spacing.xs,
    flex: 1,
  },
  pickerTitle: {
    color: colors.text,
  },
});
