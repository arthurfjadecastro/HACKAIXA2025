import * as hooksIndex from './index';

describe('Products Hooks Index', () => {
  it('should export all product hooks', () => {
    expect(hooksIndex).toBeDefined();
    expect(typeof hooksIndex).toBe('object');
  });

  it('should export useCreateProduct hook', () => {
    expect(hooksIndex.useCreateProduct).toBeDefined();
    expect(typeof hooksIndex.useCreateProduct).toBe('function');
  });

  it('should export useDeleteProduct hook', () => {
    expect(hooksIndex.useDeleteProduct).toBeDefined();
    expect(typeof hooksIndex.useDeleteProduct).toBe('function');
  });

  it('should export useProducts hook', () => {
    expect(hooksIndex.useProducts).toBeDefined();
    expect(typeof hooksIndex.useProducts).toBe('function');
  });

  it('should export useProductManagement hook', () => {
    expect(hooksIndex.useProductManagement).toBeDefined();
    expect(typeof hooksIndex.useProductManagement).toBe('function');
  });

  it('should match snapshot', () => {
    expect(Object.keys(hooksIndex).sort()).toMatchSnapshot();
  });
});
