import * as calculatorIndex from './index';

describe('Simulations Calculator Index', () => {
  it('should export calculator modules', () => {
    expect(calculatorIndex).toBeDefined();
    expect(typeof calculatorIndex).toBe('object');
  });

  it('should re-export calculator functions without errors', () => {
    // Verifica se módulos foram exportados sem erros
    expect(() => {
      const exported = { ...calculatorIndex };
      expect(exported).toBeDefined();
    }).not.toThrow();
  });

  it('should match snapshot', () => {
    expect(Object.keys(calculatorIndex).sort()).toMatchSnapshot();
  });
});
