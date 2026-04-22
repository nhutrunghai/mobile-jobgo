import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type SearchFilterItem = {
  key: string;
  label?: string;
  active?: boolean;
  open?: boolean;
  onPress?: () => void;
};

type SearchFilterBarProps = {
  filters: readonly SearchFilterItem[];
};

export function SearchFilterBar({ filters }: SearchFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {filters.map((filter) => (
        <Pressable
          key={filter.key}
          style={[
            styles.chip,
            filter.key === 'filter' ? styles.filterChip : null,
            filter.active ? styles.activeChip : null,
          ]}
          onPress={filter.onPress}>
          {filter.key === 'filter' ? (
            <Feather name="sliders" size={18} color={filter.active ? colors.primary : '#55615B'} />
          ) : null}
          {filter.label ? (
            <AppText variant="body" style={[styles.label, filter.active ? styles.activeLabel : null]}>
              {filter.label}
            </AppText>
          ) : null}
          {filter.key !== 'filter' ? (
            <Feather
              name={filter.open ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={filter.active || filter.open ? colors.primary : '#8D968F'}
            />
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    minHeight: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#DADFDA',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChip: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    gap: 0,
  },
  activeChip: {
    borderColor: '#A6E1B4',
    backgroundColor: '#EEFBEF',
  },
  label: {
    color: '#46524C',
    fontSize: 13,
    lineHeight: 16,
    flexShrink: 0,
  },
  activeLabel: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
