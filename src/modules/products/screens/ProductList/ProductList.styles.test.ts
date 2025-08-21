import { styles } from './ProductList.styles';

describe('ProductList.styles', () => {
  it('should export styles object with correct properties', () => {
    expect(styles).toBeDefined();
    expect(styles.container).toBeDefined();
    expect(styles.centerContent).toBeDefined();
    expect(styles.centerText).toBeDefined();
  });

  it('should have container with flex 1', () => {
    expect(styles.container.flex).toBe(1);
  });

  it('should have centerContent with proper layout', () => {
    expect(styles.centerContent.flex).toBe(1);
    expect(styles.centerContent.justifyContent).toBe('center');
    expect(styles.centerContent.alignItems).toBe('center');
  });

  it('should have centerText with text alignment', () => {
    expect(styles.centerText.textAlign).toBe('center');
  });
});
