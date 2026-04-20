import { Text, TextProps } from 'react-native';

import { typography } from '@/src/theme';

type Variant = keyof typeof typography;

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
};

export function AppText({
  variant = 'body',
  color,
  style,
  ...props
}: AppTextProps) {
  return <Text {...props} style={[typography[variant], color ? { color } : undefined, style]} />;
}
