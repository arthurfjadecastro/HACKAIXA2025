import * as servicesIndex from './index';

describe('Services Index', () => {
  it('should export products services', () => {
    expect(servicesIndex).toBeDefined();
    expect(typeof servicesIndex).toBe('object');
  });

  it('should re-export modules correctly', () => {
    // Verifica se o módulo foi exportado sem erros
    expect(() => {
      const exported = { ...servicesIndex };
      expect(exported).toBeDefined();
    }).not.toThrow();
  });

  it('should match snapshot', () => {
    expect(Object.keys(servicesIndex).sort()).toMatchSnapshot();
  });
});
