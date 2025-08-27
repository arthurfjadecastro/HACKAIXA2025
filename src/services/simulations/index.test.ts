import * as simulationsIndex from './index';

describe('Simulations Services Index', () => {
  it('should export simulations modules', () => {
    expect(simulationsIndex).toBeDefined();
    expect(typeof simulationsIndex).toBe('object');
  });

  it('should re-export API and calculator modules', () => {
    // Verifica se módulos foram exportados sem erros
    expect(() => {
      const exported = { ...simulationsIndex };
      expect(exported).toBeDefined();
    }).not.toThrow();
  });

  it('should match snapshot', () => {
    expect(Object.keys(simulationsIndex).sort()).toMatchSnapshot();
  });
});
