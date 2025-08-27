import ProductDataService from './index';

describe('Products Data Index', () => {
  it('should export ProductDataService as default', () => {
    expect(ProductDataService).toBeDefined();
    expect(typeof ProductDataService).toBe('function');
  });

  it('should export ProductDataService as named export', () => {
    const { ProductDataService: NamedService } = require('./index');
    expect(NamedService).toBeDefined();
    expect(typeof NamedService).toBe('function');
  });

  it('should export same service for both exports', () => {
    const defaultExport = require('./index').default;
    const namedExport = require('./index').ProductDataService;
    expect(defaultExport).toBe(namedExport);
  });
});
