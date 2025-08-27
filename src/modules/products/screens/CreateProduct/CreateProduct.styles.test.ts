import { styles } from './CreateProduct.styles';

describe('CreateProduct Styles', () => {
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
    expect(styles.header.paddingHorizontal).toBe(20);
    expect(styles.header.paddingTop).toBe(16);
    expect(styles.header.paddingBottom).toBe(20);
    expect(styles.header.minHeight).toBe(64);
  });

  it('should have backButton style', () => {
    expect(styles.backButton).toBeDefined();
    expect(styles.backButton.padding).toBe(8);
    expect(styles.backButton.marginLeft).toBe(-8);
    expect(styles.backButton.marginRight).toBe(16);
    expect(styles.backButton.width).toBe(40);
    expect(styles.backButton.height).toBe(40);
    expect(styles.backButton.justifyContent).toBe('center');
    expect(styles.backButton.alignItems).toBe('center');
    expect(styles.backButton.borderRadius).toBe(20);
  });

  it('should match snapshot', () => {
    expect(styles).toMatchSnapshot();
  });
});
