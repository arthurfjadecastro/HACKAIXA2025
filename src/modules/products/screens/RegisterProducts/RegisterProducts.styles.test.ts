import { styles } from './RegisterProducts.styles';

describe('RegisterProducts Styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have container style', () => {
    expect(styles.container).toBeDefined();
    expect(styles.container.flex).toBe(1);
  });

  it('should have header style', () => {
    expect(styles.header).toBeDefined();
    expect(styles.header.flexDirection).toBe('row');
    expect(styles.header.alignItems).toBe('center');
  });

  it('should have backButton style', () => {
    expect(styles.backButton).toBeDefined();
    expect(styles.backButton.padding).toBe(8);
    expect(styles.backButton.marginLeft).toBe(-8);
  });

  it('should have headerTitle style', () => {
    expect(styles.headerTitle).toBeDefined();
    expect(styles.headerTitle.flex).toBe(1);
    expect(styles.headerTitle.fontSize).toBe(20);
    expect(styles.headerTitle.fontWeight).toBe('600');
  });

  it('should have addButton style', () => {
    expect(styles.addButton).toBeDefined();
  });

  it('should match snapshot', () => {
    expect(styles).toMatchSnapshot();
  });
});
