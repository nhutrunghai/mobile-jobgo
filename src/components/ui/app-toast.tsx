import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type AppToastProps = {
  visible: boolean;
  message?: string;
  tone?: 'success' | 'error';
  bottomOffset?: number;
};

export function AppToast({
  visible,
  message,
  tone = 'success',
  bottomOffset = 0,
}: AppToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: visible ? 180 : 140,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 18,
        duration: visible ? 220 : 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  if (!message) {
    return null;
  }

  const isSuccess = tone === 'success';

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrapper,
        {
          bottom: bottomOffset + insets.bottom + spacing.lg,
          opacity,
          transform: [{ translateY }],
        },
      ]}>
      <View style={[styles.toast, isSuccess ? styles.successToast : styles.errorToast]}>
        <View style={[styles.iconWrap, isSuccess ? styles.successIconWrap : styles.errorIconWrap]}>
          <Feather
            name={isSuccess ? 'check-circle' : 'alert-circle'}
            size={18}
            color={isSuccess ? colors.primaryDark : colors.tertiary}
          />
        </View>
        <AppText variant="bodyStrong" style={styles.message}>
          {message}
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 20,
  },
  toast: {
    minHeight: 56,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  successToast: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  errorToast: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1,
    borderColor: '#F3C7D2',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconWrap: {
    backgroundColor: colors.primarySoft,
  },
  errorIconWrap: {
    backgroundColor: '#FCE3EA',
  },
  message: {
    flex: 1,
    color: colors.text,
  },
});
