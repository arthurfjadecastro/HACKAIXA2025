import { styles } from './Header.styles';

describe('Header.styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have header style properties', () => {
    expect(styles.header).toBeDefined();
  });

  it('should have backButton style properties', () => {
    expect(styles.backButton).toBeDefined();
  });

  it('should have consistent style structure', () => {
    expect(styles).toMatchSnapshot();
  });
});
