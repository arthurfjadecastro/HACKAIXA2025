import * as simulationsApiIndex from './index';

describe('Simulations API Index', () => {
  it('should export simulations API modules', () => {
    expect(simulationsApiIndex).toBeDefined();
    expect(typeof simulationsApiIndex).toBe('object');
  });

  it('should re-export API functions without errors', () => {
    // Verifica se módulos foram exportados sem erros
    expect(() => {
      const exported = { ...simulationsApiIndex };
      expect(exported).toBeDefined();
    }).not.toThrow();
  });

  it('should match snapshot', () => {
    expect(Object.keys(simulationsApiIndex).sort()).toMatchSnapshot();
  });
});
