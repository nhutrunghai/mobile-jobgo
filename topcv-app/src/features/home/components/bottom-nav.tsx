import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius } from '@/src/theme';

export type BottomNavItem = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  active?: boolean;
  badge?: string;
  image?: string;
  href?: Href;
  onPress?: () => void;
};

type BottomNavProps = {
  items: readonly BottomNavItem[];
  activeKey?: string;
};

export function BottomNav({ items, activeKey }: BottomNavProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = activeKey ? activeKey === item.key : item.active;
        const handlePress = () => {
          if (item.href) {
            router.replace(item.href);
            return;
          }

          item.onPress?.();
        };

        return (
        <Pressable
          key={item.key}
          style={styles.item}
          onPress={handlePress}
          hitSlop={10}
          android_ripple={{ color: 'rgba(0, 177, 79, 0.08)', borderless: false }}>
          <View style={styles.iconWrap}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.avatar} contentFit="cover" />
            ) : (
              <Feather
                name={item.icon}
                size={20}
                color={isActive ? colors.primary : '#98A2B3'}
              />
            )}
            {item.badge ? (
              <View style={styles.badge}>
                <AppText variant="caption" style={styles.badgeText}>
                  {item.badge}
                </AppText>
              </View>
            ) : null}
          </View>
          <AppText
            variant="caption"
            color={isActive ? colors.primary : '#98A2B3'}
            style={styles.label}
            numberOfLines={1}>
            {item.label}
          </AppText>
        </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(17, 24, 39, 0.06)',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 2,
  },
  iconWrap: {
    minHeight: 22,
    position: 'relative',
  },
  label: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 11,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -14,
    backgroundColor: '#F59E0B',
    borderRadius: radius.pill,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    lineHeight: 10,
    fontWeight: '700',
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
  },
});
