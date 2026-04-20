import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  StyleProp,
  StyleSheet,
  Platform,
  ScrollView,
  ViewStyle,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/src/theme';

type AuthShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  scrollEnabled?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function AuthShell({
  children,
  footer,
  scrollEnabled = true,
  contentContainerStyle,
}: AuthShellProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View pointerEvents="none" style={styles.backgroundTop} />
        <View pointerEvents="none" style={styles.backgroundBottom} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled}
          bounces={scrollEnabled}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: 'rgba(247,250,247,0.92)',
  },
  backgroundTop: {
    position: 'absolute',
    top: -48,
    right: -32,
    width: 156,
    height: 156,
    borderRadius: 90,
    backgroundColor: 'rgba(0,177,79,0.08)',
  },
  backgroundBottom: {
    position: 'absolute',
    bottom: -80,
    left: -64,
    width: 188,
    height: 188,
    borderRadius: 110,
    backgroundColor: 'rgba(0,110,46,0.06)',
  },
});
