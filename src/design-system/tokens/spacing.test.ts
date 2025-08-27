import { spacing, padding, margin } from './spacing';

describe('🔸 Spacing Tokens', () => {
  describe('Base Spacing Scale', () => {
    it('should have consistent spacing scale', () => {
      expect(spacing[0]).toBe(0);
      expect(spacing[1]).toBe(4);
      expect(spacing[2]).toBe(8);
      expect(spacing[3]).toBe(12);
      expect(spacing[4]).toBe(16);
      expect(spacing[5]).toBe(20);
      expect(spacing[6]).toBe(24);
      expect(spacing[8]).toBe(32);
      expect(spacing[10]).toBe(40);
      expect(spacing[12]).toBe(48);
      expect(spacing[16]).toBe(64);
      expect(spacing[20]).toBe(80);
      expect(spacing[24]).toBe(96);
      expect(spacing[28]).toBe(112);
      expect(spacing[32]).toBe(128);
    });

    it('should follow 4px grid system', () => {
      const values = [spacing[1], spacing[2], spacing[3], spacing[4], spacing[6], spacing[8]];
      values.forEach(value => {
        expect(value % 4).toBe(0);
      });
    });

    it('should have incremental values', () => {
      expect(spacing[2]).toBeGreaterThan(spacing[1]);
      expect(spacing[4]).toBeGreaterThan(spacing[2]);
      expect(spacing[8]).toBeGreaterThan(spacing[4]);
      expect(spacing[16]).toBeGreaterThan(spacing[8]);
    });
  });

  describe('Padding Shortcuts', () => {
    it('should have semantic padding values', () => {
      expect(padding.xs).toBe(spacing[1]); // 4px
      expect(padding.sm).toBe(spacing[2]); // 8px
      expect(padding.md).toBe(spacing[4]); // 16px
      expect(padding.lg).toBe(spacing[6]); // 24px
      expect(padding.xl).toBe(spacing[8]); // 32px
    });

    it('should have increasing padding sizes', () => {
      expect(padding.sm).toBeGreaterThan(padding.xs);
      expect(padding.md).toBeGreaterThan(padding.sm);
      expect(padding.lg).toBeGreaterThan(padding.md);
      expect(padding.xl).toBeGreaterThan(padding.lg);
    });

    it('should export padding object', () => {
      expect(padding).toBeDefined();
      expect(typeof padding).toBe('object');
    });
  });

  describe('Margin Shortcuts', () => {
    it('should have semantic margin values', () => {
      expect(margin.xs).toBe(spacing[1]); // 4px
      expect(margin.sm).toBe(spacing[2]); // 8px
      expect(margin.md).toBe(spacing[4]); // 16px
      expect(margin.lg).toBe(spacing[6]); // 24px
      expect(margin.xl).toBe(spacing[8]); // 32px
    });

    it('should have increasing margin sizes', () => {
      expect(margin.sm).toBeGreaterThan(margin.xs);
      expect(margin.md).toBeGreaterThan(margin.sm);
      expect(margin.lg).toBeGreaterThan(margin.md);
      expect(margin.xl).toBeGreaterThan(margin.lg);
    });

    it('should export margin object', () => {
      expect(margin).toBeDefined();
      expect(typeof margin).toBe('object');
    });
  });

  describe('Spacing Object Structure', () => {
    it('should export spacing object', () => {
      expect(spacing).toBeDefined();
      expect(typeof spacing).toBe('object');
    });

    it('should have all required spacing values', () => {
      const requiredSpacings = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 32] as const;
      requiredSpacings.forEach(space => {
        expect(spacing).toHaveProperty(space.toString());
        expect(typeof spacing[space as keyof typeof spacing]).toBe('number');
      });
    });

    it('should have consistent margin and padding shortcuts', () => {
      expect(padding.xs).toBe(margin.xs);
      expect(padding.sm).toBe(margin.sm);
      expect(padding.md).toBe(margin.md);
      expect(padding.lg).toBe(margin.lg);
      expect(padding.xl).toBe(margin.xl);
    });
  });

  describe('Spacing Usage Examples', () => {
    it('should provide common spacing values', () => {
      // Common mobile spacing patterns
      expect(spacing[2]).toBe(8);   // Small gaps
      expect(spacing[4]).toBe(16);  // Medium gaps
      expect(spacing[6]).toBe(24);  // Large gaps
      expect(spacing[8]).toBe(32);  // Extra large gaps
    });

    it('should support compact layouts', () => {
      expect(spacing[1]).toBe(4);   // Minimal spacing
      expect(spacing[2]).toBe(8);   // Compact spacing
    });

    it('should support spacious layouts', () => {
      expect(spacing[20]).toBe(80);  // Spacious sections
      expect(spacing[24]).toBe(96);  // Very spacious
      expect(spacing[32]).toBe(128); // Maximum spacing
    });
  });
});
