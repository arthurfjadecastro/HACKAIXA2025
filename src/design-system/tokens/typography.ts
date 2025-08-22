import { TextStyle, Platform } from 'react-native';

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const;

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 26,
  '5xl': 32,
  '6xl': 40,
} as const;

export const lineHeights = {
  xs: 12,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 36,
  '5xl': 40,
  '6xl': 48,
} as const;

export const fontFamilies = {
  // Fontes oficiais da CAIXA
  caixa: Platform.select({
    ios: 'CAIXAStd-Regular',
    android: 'CAIXAStd-Regular',
    default: 'CAIXAStd-Regular',
  }),
  
  caixaSemiBold: Platform.select({
    ios: 'CAIXAStd-SemiBold',
    android: 'CAIXAStd-SemiBold', 
    default: 'CAIXAStd-SemiBold',
  }),

  // Alias para compatibilidade e facilidade de uso
  primary: Platform.select({
    ios: 'CAIXAStd-Regular',
    android: 'CAIXAStd-Regular',
    default: 'CAIXAStd-Regular',
  }),
  
  primaryBold: Platform.select({
    ios: 'CAIXAStd-SemiBold',
    android: 'CAIXAStd-SemiBold',
    default: 'CAIXAStd-SemiBold',
  }),
  
  // Fallback para casos especiais
  monospace: Platform.select({
    ios: 'SF Mono',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

export const typography = {
  h1: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['4xl'],
    fontFamily: fontFamilies.caixaSemiBold,
  } as TextStyle,

  h2: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['3xl'],
    fontFamily: fontFamilies.caixaSemiBold,
  } as TextStyle,

  h3: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights['2xl'],
    fontFamily: fontFamilies.caixaSemiBold,
  } as TextStyle,

  h4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.xl,
    fontFamily: fontFamilies.caixaSemiBold,
  } as TextStyle,

  h5: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.lg,
    fontFamily: fontFamilies.caixaSemiBold,
  } as TextStyle,

  body1: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.lg,
    fontFamily: fontFamilies.caixa,
  } as TextStyle,

  body2: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.md,
    fontFamily: fontFamilies.caixa,
  } as TextStyle,

  button: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.lg,
    fontFamily: fontFamilies.caixaSemiBold,
  } as TextStyle,

  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.sm,
    fontFamily: fontFamilies.caixa,
  } as TextStyle,

  overline: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.xs,
    fontFamily: fontFamilies.caixaSemiBold,
    textTransform: 'uppercase',
  } as TextStyle,

  account: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.sm,
    fontFamily: fontFamilies.caixa,
    opacity: 0.8,
  } as TextStyle,

  amount: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights['3xl'],
    fontFamily: fontFamilies.caixaSemiBold,
  } as TextStyle,
} as const;
