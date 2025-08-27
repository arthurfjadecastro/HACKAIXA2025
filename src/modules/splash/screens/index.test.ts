import SplashScreen from './index';

describe('Splash Screens Index', () => {
  it('should export SplashScreen component', () => {
    expect(SplashScreen).toBeDefined();
    expect(typeof SplashScreen).toBe('function');
  });

  it('should be a valid React component', () => {
    expect(SplashScreen.name).toBe('SplashScreen');
  });

  it('should match snapshot', () => {
    expect(SplashScreen).toMatchSnapshot();
  });
});
