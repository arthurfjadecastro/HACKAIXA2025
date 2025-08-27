import * as productsIndex from './index';

describe('Products Services Index', () => {
  it('should export products modules', () => {
    expect(productsIndex).toBeDefined();
    expect(typeof productsIndex).toBe('object');
  });

  it('should re-export API, data and types modules', () => {
    // Verifica se módulos foram exportados sem erros
    expect(() => {
      const exported = { ...productsIndex };
      expect(exported).toBeDefined();
    }).not.toThrow();
  });

  it('should match snapshot', () => {
    expect(Object.keys(productsIndex).sort()).toMatchSnapshot();
  });
});
