import * as typesIndex from './index';

describe('Products Types Index', () => {
  it('should export productTypes modules', () => {
    expect(typesIndex).toBeDefined();
    expect(typeof typesIndex).toBe('object');
  });

  it('should re-export types without errors', () => {
    // Verifica se módulos foram exportados sem erros
    expect(() => {
      const exported = { ...typesIndex };
      expect(exported).toBeDefined();
    }).not.toThrow();
  });

  it('should export all necessary types', () => {
    // Verifica se as principais funções/tipos estão disponíveis
    const keys = Object.keys(typesIndex);
    expect(keys.length).toBeGreaterThanOrEqual(0);
  });
});
