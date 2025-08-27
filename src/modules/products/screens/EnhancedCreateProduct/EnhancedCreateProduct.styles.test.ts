import { styles } from './EnhancedCreateProduct.styles';

describe('EnhancedCreateProduct Styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have container style', () => {
    expect(styles.container).toBeDefined();
    expect(styles.container.flex).toBe(1);
    expect(styles.container.backgroundColor).toBe('#F4F8FB');
  });

  it('should have header style', () => {
    expect(styles.header).toBeDefined();
    expect(styles.header.flexDirection).toBe('row');
    expect(styles.header.alignItems).toBe('center');
    expect(styles.header.justifyContent).toBe('space-between');
  });

  it('should have backButton style', () => {
    expect(styles.backButton).toBeDefined();
    expect(styles.backButton.padding).toBe(8);
    expect(styles.backButton.marginLeft).toBe(-8);
  });

  it('should have headerTitle style', () => {
    expect(styles.headerTitle).toBeDefined();
    expect(styles.headerTitle.fontSize).toBe(16);
    expect(styles.headerTitle.fontWeight).toBe('600');
    expect(styles.headerTitle.color).toBe('#333333');
    expect(styles.headerTitle.textAlign).toBe('center');
  });

  it('should have headerSpacer style', () => {
    expect(styles.headerSpacer).toBeDefined();
    expect(styles.headerSpacer.width).toBe(40);
  });

  it('should match snapshot', () => {
    expect(styles).toMatchSnapshot();
  });
});
