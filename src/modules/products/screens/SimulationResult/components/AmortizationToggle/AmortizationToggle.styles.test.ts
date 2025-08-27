import { styles } from './AmortizationToggle.styles';

describe('AmortizationToggle.styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have amortizationToggle style properties', () => {
    expect(styles.amortizationToggle).toBeDefined();
    expect(styles.amortizationToggle.marginTop).toBe(12);
  });

  it('should have toggleLabel style properties', () => {
    expect(styles.toggleLabel).toBeDefined();
    expect(styles.toggleLabel.fontSize).toBe(13);
    expect(styles.toggleLabel.fontWeight).toBe('600');
  });

  it('should have consistent style structure', () => {
    expect(styles).toMatchSnapshot();
  });
});
