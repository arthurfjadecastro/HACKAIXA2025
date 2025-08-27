import { styles } from './Footer.styles';

describe('Footer.styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have footer style', () => {
    expect(styles.footer).toBeDefined();
    expect(styles.footer.paddingHorizontal).toBe(24);
    expect(styles.footer.paddingVertical).toBe(16);
  });

  it('should have newSimulationButton style', () => {
    expect(styles.newSimulationButton).toBeDefined();
    expect(styles.newSimulationButton.backgroundColor).toBe('#F7931E');
    expect(styles.newSimulationButton.borderRadius).toBe(8);
  });

  it('should have consistent style structure', () => {
    expect(styles).toMatchSnapshot();
  });
});
