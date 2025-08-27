import { borderRadius, radius } from './radius';

describe('🔸 Radius Tokens', () => {
  describe('Border Radius Scale', () => {
    it('should have consistent border radius scale', () => {
      expect(borderRadius.none).toBe(0);
      expect(borderRadius.xs).toBe(4);
      expect(borderRadius.sm).toBe(6);
      expect(borderRadius.md).toBe(8);
      expect(borderRadius.lg).toBe(12);
      expect(borderRadius.xl).toBe(16);
      expect(borderRadius['2xl']).toBe(20);
      expect(borderRadius['3xl']).toBe(24);
      expect(borderRadius.full).toBe(9999);
    });

    it('should have increasing border radius values', () => {
      expect(borderRadius.xs).toBeGreaterThan(borderRadius.none);
      expect(borderRadius.sm).toBeGreaterThan(borderRadius.xs);
      expect(borderRadius.md).toBeGreaterThan(borderRadius.sm);
      expect(borderRadius.lg).toBeGreaterThan(borderRadius.md);
      expect(borderRadius.xl).toBeGreaterThan(borderRadius.lg);
      expect(borderRadius['2xl']).toBeGreaterThan(borderRadius.xl);
      expect(borderRadius['3xl']).toBeGreaterThan(borderRadius['2xl']);
      expect(borderRadius.full).toBeGreaterThan(borderRadius['3xl']);
    });

    it('should export borderRadius object', () => {
      expect(borderRadius).toBeDefined();
      expect(typeof borderRadius).toBe('object');
    });
  });

  describe('Semantic Radius Values', () => {
    it('should have semantic radius for components', () => {
      expect(radius.button).toBe(borderRadius.md);
      expect(radius.card).toBe(borderRadius.lg);
      expect(radius.modal).toBe(borderRadius.xl);
      expect(radius.input).toBe(borderRadius.md);
      expect(radius.pill).toBe(borderRadius.full);
      expect(radius.container).toBe(borderRadius['2xl']);
    });

    it('should have sheet radius variants', () => {
      expect(radius.sheet).toBeDefined();
      expect(typeof radius.sheet).toBe('object');
    });

    it('should export radius object', () => {
      expect(radius).toBeDefined();
      expect(typeof radius).toBe('object');
    });
  });

  describe('Radius Usage Patterns', () => {
    it('should provide subtle radius for inputs', () => {
      expect(radius.input).toBe(8); // md
    });

    it('should provide moderate radius for buttons', () => {
      expect(radius.button).toBe(8); // md
    });

    it('should provide larger radius for cards', () => {
      expect(radius.card).toBe(12); // lg
    });

    it('should provide largest radius for modals', () => {
      expect(radius.modal).toBe(16); // xl
    });

    it('should provide full radius for pills', () => {
      expect(radius.pill).toBe(9999); // full
    });

    it('should provide extra large radius for containers', () => {
      expect(radius.container).toBe(20); // 2xl
    });
  });

  describe('Radius Object Structure', () => {
    it('should have all required border radius values', () => {
      const requiredRadiusValues = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
      requiredRadiusValues.forEach(radiusKey => {
        expect(borderRadius).toHaveProperty(radiusKey);
        expect(typeof borderRadius[radiusKey as keyof typeof borderRadius]).toBe('number');
      });
    });

    it('should have all semantic radius components', () => {
      const requiredComponents = ['button', 'card', 'modal', 'input', 'pill', 'container', 'sheet'];
      requiredComponents.forEach(component => {
        expect(radius).toHaveProperty(component);
      });
    });

    it('should use valid border radius values in semantic radius', () => {
      const validRadiusValues = Object.values(borderRadius);
      
      expect(validRadiusValues).toContain(radius.button);
      expect(validRadiusValues).toContain(radius.card);
      expect(validRadiusValues).toContain(radius.modal);
      expect(validRadiusValues).toContain(radius.input);
      expect(validRadiusValues).toContain(radius.pill);
      expect(validRadiusValues).toContain(radius.container);
    });
  });

  describe('Design System Consistency', () => {
    it('should follow even number progression for most values', () => {
      const evenValues = [borderRadius.xs, borderRadius.md, borderRadius.xl, borderRadius['2xl'], borderRadius['3xl']];
      evenValues.forEach(value => {
        expect(value % 2).toBe(0);
      });
    });

    it('should have reasonable progression steps', () => {
      // Check that progression steps are reasonable (not too large jumps)
      expect(borderRadius.sm - borderRadius.xs).toBeLessThanOrEqual(4);
      expect(borderRadius.md - borderRadius.sm).toBeLessThanOrEqual(4);
      expect(borderRadius.lg - borderRadius.md).toBeLessThanOrEqual(8);
    });

    it('should provide good range coverage', () => {
      // Should cover from no radius to moderate radius
      expect(borderRadius.none).toBe(0);
      expect(borderRadius.md).toBeGreaterThanOrEqual(6);
      expect(borderRadius.md).toBeLessThanOrEqual(12);
      expect(borderRadius.xl).toBeGreaterThanOrEqual(12);
      expect(borderRadius.xl).toBeLessThanOrEqual(20);
    });
  });
});
