import { colors } from './colors';

describe('Design System Colors', () => {
  describe('Primary Colors', () => {
    it('should have correct primary colors', () => {
      expect(colors.primary.main).toBe('#005CA9');
      expect(colors.primary.light).toBe('#0066CC');
      expect(colors.primary.dark).toBe('#004A8A');
      expect(colors.primary.contrast).toBe('#FFFFFF');
    });
  });

  describe('Secondary Colors', () => {
    it('should have correct secondary colors', () => {
      expect(colors.secondary.main).toBe('#12161C');
      expect(colors.secondary.light).toBe('#2A2E3A');
      expect(colors.secondary.dark).toBe('#000000');
      expect(colors.secondary.contrast).toBe('#FFFFFF');
    });
  });

  describe('Background Colors', () => {
    it('should have correct background colors', () => {
      expect(colors.background.primary).toBe('#F4F8FB');
      expect(colors.background.secondary).toBe('#FFFFFF');
      expect(colors.background.card).toBe('#FFFFFF');
      expect(colors.background.overlay).toBe('rgba(0, 0, 0, 0.5)');
    });
  });

  describe('Text Colors', () => {
    it('should have correct text colors', () => {
      expect(colors.text.primary).toBe('#12161C');
      expect(colors.text.secondary).toBe('#666666');
      expect(colors.text.disabled).toBe('#999999');
      expect(colors.text.inverse).toBe('#FFFFFF');
      expect(colors.text.hint).toBe('rgba(18, 22, 28, 0.6)');
    });
  });

  describe('Status Colors', () => {
    it('should have correct status colors', () => {
      expect(colors.status.success).toBe('#00C851');
      expect(colors.status.warning).toBe('#FF8800');
      expect(colors.status.error).toBe('#FF4444');
      expect(colors.status.info).toBe('#33B5E5');
    });
  });

  describe('Border Colors', () => {
    it('should have correct border colors', () => {
      expect(colors.border.light).toBe('#EEEEEE');
      expect(colors.border.medium).toBe('#DDDDDD');
      expect(colors.border.dark).toBe('#CCCCCC');
    });
  });

  describe('Component Colors', () => {
    it('should have correct component colors', () => {
      expect(colors.component.shadow).toBe('#000000');
      expect(colors.component.ripple).toBe('rgba(0, 92, 169, 0.1)');
      expect(colors.component.divider).toBe('#EEEEEE');
      expect(colors.component.placeholder).toBe('#999999');
    });
  });

  describe('Color Object Structure', () => {
    it('should export colors object', () => {
      expect(colors).toBeDefined();
      expect(typeof colors).toBe('object');
    });

    it('should have all required color groups', () => {
      expect(colors).toHaveProperty('primary');
      expect(colors).toHaveProperty('secondary');
      expect(colors).toHaveProperty('background');
      expect(colors).toHaveProperty('text');
      expect(colors).toHaveProperty('status');
      expect(colors).toHaveProperty('border');
      expect(colors).toHaveProperty('component');
    });

    it('should have primary color variants', () => {
      expect(colors.primary).toHaveProperty('main');
      expect(colors.primary).toHaveProperty('light');
      expect(colors.primary).toHaveProperty('dark');
      expect(colors.primary).toHaveProperty('contrast');
    });
  });
});
