import { Product } from './productTypes';

describe('productTypes', () => {
  describe('Product interface', () => {
    it('should define Product interface correctly', () => {
      const mockProduct: Product = {
        id: 'test-product-1',
        name: 'Produto de Teste',
        juros: 1.36,
        prazoMaximo: 32,
        prazoMinimo: 1,
        normativo: 'CO055',
        active: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      expect(mockProduct.id).toBe('test-product-1');
      expect(mockProduct.name).toBe('Produto de Teste');
      expect(mockProduct.juros).toBe(1.36);
      expect(mockProduct.prazoMaximo).toBe(32);
      expect(mockProduct.prazoMinimo).toBe(1);
      expect(mockProduct.normativo).toBe('CO055');
      expect(mockProduct.active).toBe(true);
      expect(mockProduct.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(mockProduct.updatedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should allow optional prazoMinimo field', () => {
      const productWithoutMinimo: Product = {
        id: 'test-product-2',
        name: 'Produto Sem Mínimo',
        juros: 2.5,
        prazoMaximo: 24,
        normativo: 'CO056',
        active: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      expect(productWithoutMinimo.prazoMinimo).toBeUndefined();
      expect(productWithoutMinimo.active).toBe(false);
    });

    it('should validate juros field as number', () => {
      const product: Product = {
        id: 'test-product-3',
        name: 'Produto Juros Zero',
        juros: 0,
        prazoMaximo: 12,
        normativo: 'CO057',
        active: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      expect(typeof product.juros).toBe('number');
      expect(product.juros).toBe(0);
    });

    it('should validate normativo field as string', () => {
      const product: Product = {
        id: 'test-product-4',
        name: 'Produto Normativo',
        juros: 1.5,
        prazoMaximo: 36,
        normativo: 'TESTE123',
        active: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      expect(typeof product.normativo).toBe('string');
      expect(product.normativo).toBe('TESTE123');
    });

    it('should validate date fields as ISO strings', () => {
      const now = new Date().toISOString();
      const product: Product = {
        id: 'test-product-5',
        name: 'Produto Data',
        juros: 1.8,
        prazoMaximo: 48,
        normativo: 'CO058',
        active: true,
        createdAt: now,
        updatedAt: now,
      };

      expect(typeof product.createdAt).toBe('string');
      expect(typeof product.updatedAt).toBe('string');
      expect(product.createdAt).toBe(now);
      expect(product.updatedAt).toBe(now);
    });
  });
});
