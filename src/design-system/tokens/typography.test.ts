import { fontWeights, fontSizes, lineHeights, typography } from './typography';

describe('📝 Typography Tokens', () => {
  describe('Font Weights', () => {
    it('should have all font weight variants', () => {
      expect(fontWeights.light).toBe('300');
      expect(fontWeights.regular).toBe('400');
      expect(fontWeights.medium).toBe('500');
      expect(fontWeights.semiBold).toBe('600');
      expect(fontWeights.bold).toBe('700');
      expect(fontWeights.extraBold).toBe('800');
    });

    it('should have increasing font weight values', () => {
      const weights = [
        parseInt(fontWeights.light),
        parseInt(fontWeights.regular),
        parseInt(fontWeights.medium),
        parseInt(fontWeights.semiBold),
        parseInt(fontWeights.bold),
        parseInt(fontWeights.extraBold)
      ];

      for (let i = 1; i < weights.length; i++) {
        expect(weights[i]!).toBeGreaterThan(weights[i - 1]!);
      }
    });

    it('should export fontWeights object', () => {
      expect(fontWeights).toBeDefined();
      expect(typeof fontWeights).toBe('object');
    });
  });

  describe('Font Sizes', () => {
    it('should have all font size variants', () => {
      expect(fontSizes.xs).toBe(10);
      expect(fontSizes.sm).toBe(12);
      expect(fontSizes.md).toBe(14);
      expect(fontSizes.lg).toBe(16);
      expect(fontSizes.xl).toBe(18);
      expect(fontSizes['2xl']).toBe(20);
      expect(fontSizes['3xl']).toBe(24);
      expect(fontSizes['4xl']).toBe(26);
      expect(fontSizes['5xl']).toBe(32);
      expect(fontSizes['6xl']).toBe(40);
    });

    it('should have increasing font sizes', () => {
      expect(fontSizes.sm).toBeGreaterThan(fontSizes.xs);
      expect(fontSizes.md).toBeGreaterThan(fontSizes.sm);
      expect(fontSizes.lg).toBeGreaterThan(fontSizes.md);
      expect(fontSizes.xl).toBeGreaterThan(fontSizes.lg);
      expect(fontSizes['2xl']).toBeGreaterThan(fontSizes.xl);
      expect(fontSizes['3xl']).toBeGreaterThan(fontSizes['2xl']);
    });

    it('should export fontSizes object', () => {
      expect(fontSizes).toBeDefined();
      expect(typeof fontSizes).toBe('object');
    });
  });

  describe('Line Heights', () => {
    it('should have line height variants', () => {
      expect(lineHeights).toBeDefined();
      expect(typeof lineHeights).toBe('object');
    });

    it('should have appropriate line height values', () => {
      Object.values(lineHeights).forEach(height => {
        expect(typeof height).toBe('number');
        expect(height).toBeGreaterThan(0);
      });
    });

    it('should export lineHeights object', () => {
      expect(lineHeights).toBeDefined();
      expect(typeof lineHeights).toBe('object');
    });
  });

  describe('Typography Styles', () => {
    it('should have heading styles', () => {
      expect(typography.h1).toBeDefined();
      expect(typography.h2).toBeDefined();
      expect(typography.h3).toBeDefined();
      expect(typography.h4).toBeDefined();
      expect(typography.h5).toBeDefined();
    });

    it('should have body text styles', () => {
      expect(typography.body1).toBeDefined();
      expect(typography.body2).toBeDefined();
    });

    it('should have caption and helper text styles', () => {
      expect(typography.caption).toBeDefined();
      expect(typography.overline).toBeDefined();
    });

    it('should have complete style objects', () => {
      const h1 = typography.h1;
      expect(h1.fontSize).toBeDefined();
      expect(h1.fontWeight).toBeDefined();
      expect(h1.lineHeight).toBeDefined();
      expect(typeof h1.fontSize).toBe('number');
      expect(typeof h1.fontWeight).toBe('string');
      expect(typeof h1.lineHeight).toBe('number');
    });

    it('should export typography object', () => {
      expect(typography).toBeDefined();
      expect(typeof typography).toBe('object');
    });
  });

  describe('Typography Consistency', () => {
    it('should use defined font sizes in typography styles', () => {
      const validFontSizes = Object.values(fontSizes);
      
      Object.values(typography).forEach(style => {
        if (style.fontSize) {
          expect(validFontSizes).toContain(style.fontSize);
        }
      });
    });

    it('should use defined font weights in typography styles', () => {
      const validFontWeights = Object.values(fontWeights);
      
      Object.values(typography).forEach(style => {
        if (style.fontWeight) {
          expect(validFontWeights).toContain(style.fontWeight);
        }
      });
    });

    it('should have decreasing font sizes from h1 to h5', () => {
      expect(typography.h1.fontSize!).toBeGreaterThan(typography.h2.fontSize!);
      expect(typography.h2.fontSize!).toBeGreaterThan(typography.h3.fontSize!);
      expect(typography.h3.fontSize!).toBeGreaterThan(typography.h4.fontSize!);
      expect(typography.h4.fontSize!).toBeGreaterThan(typography.h5.fontSize!);
    });
  });

  describe('Platform Compatibility', () => {
    it('should have font family defined for typography styles', () => {
      Object.values(typography).forEach(style => {
        if (style.fontFamily) {
          expect(typeof style.fontFamily).toBe('string');
        }
      });
    });

    it('should have proper React Native text style structure', () => {
      Object.values(typography).forEach(style => {
        // Check if properties are valid TextStyle properties
        if (style.fontSize) expect(typeof style.fontSize).toBe('number');
        if (style.fontWeight) expect(typeof style.fontWeight).toBe('string');
        if (style.lineHeight) expect(typeof style.lineHeight).toBe('number');
        if (style.letterSpacing) expect(typeof style.letterSpacing).toBe('number');
      });
    });
  });
});
