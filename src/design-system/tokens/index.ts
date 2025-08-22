import { colors } from '@/design-system/tokens/colors';
import { typography, fontWeights, fontSizes, lineHeights } from '@/design-system/tokens/typography';
import { spacing, padding, margin, gap } from '@/design-system/tokens/spacing';
import { borderRadius, radius } from '@/design-system/tokens/radius';
import { shadows } from '@/design-system/tokens/shadows';
import { elevation } from '@/design-system/tokens/elevation';

export { colors } from '@/design-system/tokens/colors';
export { typography, fontWeights, fontSizes, lineHeights } from '@/design-system/tokens/typography';
export { spacing, padding, margin, gap } from '@/design-system/tokens/spacing';
export { borderRadius, radius } from '@/design-system/tokens/radius';
export { shadows } from '@/design-system/tokens/shadows';
export { elevation } from '@/design-system/tokens/elevation';


export const theme = {
  colors,
  typography,
  spacing,
  padding,
  margin,
  gap,
  borderRadius,
  radius,
  shadows,
  elevation,
  fontWeights,
  fontSizes,
  lineHeights,
} as const;


export type Theme = typeof theme;
