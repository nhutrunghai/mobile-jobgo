import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/theme';

export function SocialLoginButtons() {
  return (
    <View style={styles.row}>
      <SocialButton
        backgroundColor={colors.socialFacebook}
        icon={<FontAwesome name="facebook" size={22} color={colors.white} />}
      />
      <SocialButton
        backgroundColor={colors.surface}
        borderColor={colors.outline}
        icon={<FontAwesome name="google" size={22} color="#DB4437" />}
      />
      <SocialButton
        backgroundColor={colors.socialApple}
        icon={<Ionicons name="logo-apple" size={22} color={colors.white} />}
      />
    </View>
  );
}

type SocialButtonProps = {
  backgroundColor: string;
  borderColor?: string;
  icon: ReactNode;
};

function SocialButton({ backgroundColor, borderColor, icon }: SocialButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor },
        borderColor ? { borderColor, borderWidth: 1 } : null,
      ]}>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
