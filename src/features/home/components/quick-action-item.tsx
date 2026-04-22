import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius } from '@/src/theme';

type QuickActionItemProps = {
  label: string;
  image: string;
};

export function QuickActionItem({ label, image }: QuickActionItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
      </View>
      <AppText variant="caption" style={styles.label} numberOfLines={2}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 68,
    gap: 6,
  },
  imageWrap: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    color: colors.text,
    textAlign: 'center',
    minHeight: 28,
    fontSize: 12,
    lineHeight: 16,
  },
});
