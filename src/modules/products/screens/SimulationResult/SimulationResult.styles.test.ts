import { styles } from './SimulationResult.styles';

describe('SimulationResult Styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have container style', () => {
    expect(styles.container).toBeDefined();
    expect(styles.container.flex).toBe(1);
    expect(styles.container.backgroundColor).toBe('#F4F8FB');
  });

  it('should have scrollContainer style', () => {
    expect(styles.scrollContainer).toBeDefined();
    expect(styles.scrollContainer.flex).toBe(1);
  });

  it('should have contentWrapper style', () => {
    expect(styles.contentWrapper).toBeDefined();
    expect(styles.contentWrapper.flex).toBe(1);
  });

  it('should have contentContainer style', () => {
    expect(styles.contentContainer).toBeDefined();
    expect(styles.contentContainer.paddingTop).toBe(16);
    expect(styles.contentContainer.paddingBottom).toBe(16);
    expect(styles.contentContainer.paddingHorizontal).toBe(8);
  });

  it('should match snapshot', () => {
    expect(styles).toMatchSnapshot();
  });
});
