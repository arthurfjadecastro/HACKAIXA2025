import * as tokensIndex from './index';

describe('Design System Tokens Index', () => {
  it('should export all design tokens', () => {
    expect(tokensIndex).toBeDefined();
    expect(typeof tokensIndex).toBe('object');
  });

  it('should export colors', () => {
    expect(tokensIndex.colors).toBeDefined();
    expect(typeof tokensIndex.colors).toBe('object');
  });

  it('should export typography tokens', () => {
    expect(tokensIndex.typography).toBeDefined();
    expect(tokensIndex.fontWeights).toBeDefined();
    expect(tokensIndex.fontSizes).toBeDefined();
    expect(tokensIndex.lineHeights).toBeDefined();
  });

  it('should export spacing tokens', () => {
    expect(tokensIndex.spacing).toBeDefined();
    expect(tokensIndex.padding).toBeDefined();
    expect(tokensIndex.margin).toBeDefined();
    expect(tokensIndex.gap).toBeDefined();
  });

  it('should export radius tokens', () => {
    expect(tokensIndex.borderRadius).toBeDefined();
    expect(tokensIndex.radius).toBeDefined();
  });

  it('should export shadows and elevation', () => {
    expect(tokensIndex.shadows).toBeDefined();
    expect(tokensIndex.elevation).toBeDefined();
  });

  it('should export theme object', () => {
    expect(tokensIndex.theme).toBeDefined();
    expect(typeof tokensIndex.theme).toBe('object');
  });

  it('should match snapshot', () => {
    expect(Object.keys(tokensIndex).sort()).toMatchSnapshot();
  });
});
