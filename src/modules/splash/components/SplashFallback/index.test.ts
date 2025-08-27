import { SplashFallback } from './index';
import type { SplashFallbackProps } from './index';

describe('SplashFallback Index', () => {
  it('should export SplashFallback component', () => {
    expect(SplashFallback).toBeDefined();
    expect(typeof SplashFallback).toBe('function');
  });

  it('should export SplashFallbackProps type', () => {
    // TypeScript types don't exist at runtime, but we can check the component accepts props
    expect(() => {
      const props: SplashFallbackProps = {
        size: 100,
        color: '#000000',
        testID: 'test'
      };
      expect(props).toBeDefined();
    }).not.toThrow();
  });

  it('should match snapshot', () => {
    expect(SplashFallback).toMatchSnapshot();
  });
});
