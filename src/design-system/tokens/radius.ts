export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const radius = {
  button: borderRadius.md,
  card: borderRadius.lg,
  modal: borderRadius.xl,
  input: borderRadius.md,
  pill: borderRadius.full,
  container: borderRadius['2xl'],
  sheet: {
    top: borderRadius['3xl'], // 24px conforme Figma
  },
} as const;
