import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type SearchTopBarProps = {
  query: string;
  onChangeText: (value: string) => void;
  onBackPress: () => void;
  searched?: boolean;
  autoFocus?: boolean;
};

export function SearchTopBar({
  query,
  onChangeText,
  onBackPress,
  searched = false,
  autoFocus = true,
}: SearchTopBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <Pressable onPress={onBackPress} style={styles.iconButton} hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.primaryDark} />
          </Pressable>

          {searched ? (
            <Pressable style={styles.locationChip}>
              <Feather name="map-pin" size={16} color={colors.primary} />
              <AppText variant="bodyStrong" color={colors.primaryDark}>
                Địa điểm
              </AppText>
              <Feather name="chevron-down" size={16} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>

        <Pressable style={styles.iconButton} hitSlop={8}>
          <Feather name="more-vertical" size={20} color={colors.primaryDark} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={20} color="#B6BCB8" />
        <TextInput
          autoFocus={autoFocus}
          value={query}
          onChangeText={onChangeText}
          placeholder="Vị trí tuyển dụng, tên công ty..."
          placeholderTextColor="#A0A6A2"
          style={styles.input}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    paddingTop: 46,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: -2,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 42,
    borderRadius: radius.lg,
    backgroundColor: '#F2F4F2',
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
});
