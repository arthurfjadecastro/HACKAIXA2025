import { styles } from './ResultSummary.styles';

describe('ResultSummary.styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have resultCard style properties', () => {
    expect(styles.resultCard).toBeDefined();
    expect(styles.resultCard.backgroundColor).toBe('#FFFFFF');
    expect(styles.resultCard.borderRadius).toBe(12);
  });

  it('should have successTitleContainer style properties', () => {
    expect(styles.successTitleContainer).toBeDefined();
    expect(styles.successTitleContainer.flexDirection).toBe('row');
  });

  it('should have consistent style structure', () => {
    expect(styles).toMatchSnapshot();
  });
});
