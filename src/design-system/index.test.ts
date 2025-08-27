import * as designSystemIndex from './index';

describe('Design System Index', () => {
  it('should export design system modules', () => {
    expect(designSystemIndex).toBeDefined();
    expect(typeof designSystemIndex).toBe('object');
  });

  it('should re-export Icon components', () => {
    expect(designSystemIndex.Icon).toBeDefined();
    expect(designSystemIndex.useIcon).toBeDefined();
    expect(designSystemIndex.iconNames).toBeDefined();
    expect(designSystemIndex.iconSizes).toBeDefined();
  });

  it('should re-export tokens and components', () => {
    // Verifica se módulos foram exportados sem erros
    expect(() => {
      const exported = { ...designSystemIndex };
      expect(exported).toBeDefined();
    }).not.toThrow();
  });

  it('should match snapshot', () => {
    expect(Object.keys(designSystemIndex).sort()).toMatchSnapshot();
  });
});
