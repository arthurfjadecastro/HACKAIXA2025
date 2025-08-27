import { styles } from './InstallmentsHeader.styles';

describe('InstallmentsHeader Styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have installmentsHeader style', () => {
    expect(styles.installmentsHeader).toBeDefined();
    expect(styles.installmentsHeader.paddingHorizontal).toBe(0);
    expect(styles.installmentsHeader.paddingTop).toBe(32);
    expect(styles.installmentsHeader.paddingBottom).toBe(16);
  });

  it('should have installmentsTitle style', () => {
    expect(styles.installmentsTitle).toBeDefined();
    expect(styles.installmentsTitle.fontSize).toBe(18);
    expect(styles.installmentsTitle.fontWeight).toBe('800');
    expect(styles.installmentsTitle.color).toBe('#1565C0');
    expect(styles.installmentsTitle.textAlign).toBe('left');
  });

  it('should match snapshot', () => {
    expect(styles).toMatchSnapshot();
  });
});
