import { styles } from './LoanConfiguration.styles';

describe('LoanConfiguration Styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have container style', () => {
    expect(styles.container).toBeDefined();
  });

  it('should have content style', () => {
    expect(styles.content).toBeDefined();
  });

  it('should have header style', () => {
    expect(styles.header).toBeDefined();
  });

  it('should match snapshot', () => {
    expect(styles).toMatchSnapshot();
  });
});
