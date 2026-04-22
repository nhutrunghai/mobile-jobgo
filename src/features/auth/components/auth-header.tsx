import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { colors, radius, spacing } from '@/src/theme';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  badge?: ReactNode;
  centered?: boolean;
  hideBackPlaceholder?: boolean;
};

export function AuthHeader({
  title,
  subtitle,
  onBackPress,
  badge,
  centered = false,
  hideBackPlaceholder = false,
}: AuthHeaderProps) {
  return (
    <View style={styles.wrapper}>
      {onBackPress ? (
        <Pressable onPress={onBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color={colors.primaryDark} />
        </Pressable>
      ) : hideBackPlaceholder ? null : (
        <View style={styles.backSpacer} />
      )}

      <View style={[styles.brand, centered ? styles.brandCentered : null]}>
        <View style={styles.logoRow}>
          <AppText variant="display" color={colors.primary} style={styles.logoWord}>
            Top
          </AppText>
          <AppText variant="display" color={colors.text} style={styles.logoWord}>
            cv
          </AppText>
        </View>
        <AppText variant="heading" style={[styles.title, centered ? styles.textCentered : null]}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="body"
            color={colors.textMuted}
            style={[styles.subtitle, centered ? styles.textCentered : null]}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {badge ? <View style={[styles.badge, centered ? styles.badgeCentered : null]}>{badge}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xxxl,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  backSpacer: {
    height: 42,
    marginBottom: spacing.xl,
  },
  brand: {
    gap: spacing.sm,
  },
  brandCentered: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoWord: {
    letterSpacing: 0,
  },
  title: {
    color: colors.text,
  },
  subtitle: {
    maxWidth: 320,
  },
  textCentered: {
    textAlign: 'center',
  },
  badge: {
    marginTop: spacing.xl,
  },
  badgeCentered: {
    alignItems: 'center',
  },
});
