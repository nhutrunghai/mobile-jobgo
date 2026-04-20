import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/app-text';
import { colors } from '@/src/theme';

type SectionHeaderProps = {
  title: string;
  action?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  action = 'Xem tất cả',
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="heading" style={styles.title}>
        {title}
      </AppText>

      <Pressable hitSlop={8} onPress={onActionPress} disabled={!onActionPress}>
        <AppText variant="bodyStrong" color={colors.primaryLink}>
          {action}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
  },
});
