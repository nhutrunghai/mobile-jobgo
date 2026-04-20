export const colors = {
  background: '#F7FAF7',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF4EE',
  surfaceStrong: '#E4ECE4',
  text: '#132218',
  textMuted: '#5E6E61',
  primary: '#00B14F',
  primaryDark: '#006E2E',
  primaryLink: '#14A44D',
  primarySoft: '#DDF7E7',
  tertiary: '#AF294C',
  outline: '#D7E1D8',
  outlineStrong: '#BECBBC',
  white: '#FFFFFF',
  black: '#0F120F',
  shadow: 'rgba(19, 34, 24, 0.08)',
  shadowStrong: 'rgba(19, 34, 24, 0.14)',
  socialFacebook: '#1877F2',
  socialApple: '#111111',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  section: 36,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800' as const,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800' as const,
  },
  heading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
} as const;

export const shadows = {
  soft: {
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  floating: {
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
} as const;
