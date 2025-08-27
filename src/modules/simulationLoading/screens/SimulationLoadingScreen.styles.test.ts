import { styles } from './SimulationLoadingScreen.styles';

describe('SimulationLoadingScreen Styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have container style', () => {
    expect(styles.container).toBeDefined();
    expect(styles.container.flex).toBe(1);
    expect(styles.container.backgroundColor).toBe('#F4F8FB');
  });

  it('should have content style', () => {
    expect(styles.content).toBeDefined();
    expect(styles.content.flex).toBe(1);
    expect(styles.content.justifyContent).toBe('center');
    expect(styles.content.alignItems).toBe('center');
  });

  it('should match snapshot', () => {
    expect(styles).toMatchSnapshot();
  });
});
