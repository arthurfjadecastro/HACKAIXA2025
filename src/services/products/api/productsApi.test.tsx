import AsyncStorage from '@react-native-async-storage/async-storage';
import { productService } from './productsApi';
import { CreateProductRequest, Product } from '../types/productTypes';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to default mock implementations
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
  });

  describe('clearStorage', () => {
    it('should remove products from storage', async () => {
      await productService.clearStorage();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('@caixa:products');
    });
  });

  describe('getStoredProducts', () => {
    it('should return empty array when no products stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await productService.getStoredProducts();

      expect(result).toEqual([]);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@caixa:products');
    });

    it('should return stored products with proper type conversion', async () => {
      const storedProducts = [
        {
          id: '1',
          name: 'Test Product',
          juros: 5.5,
          prazoMaximo: 12,
          prazoMinimo: null,
          normativo: 'TEST001',
          active: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          categoria: null,
          configuracoes: null,
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedProducts));

      const result = await productService.getStoredProducts();

      expect(result).toEqual([
        {
          id: '1',
          name: 'Test Product',
          juros: 5.5,
          prazoMaximo: 12,
          prazoMinimo: undefined,
          normativo: 'TEST001',
          active: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          categoria: undefined,
          configuracoes: undefined,
        },
      ]);
    });

    it('should handle JSON parse errors gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-json');

      // The service should return empty array on JSON parse error based on try/catch in implementation
      const result = await productService.getStoredProducts();
      expect(result).toEqual([]);
    });
  });

  describe('createProduct', () => {
    it('should create a new product and store it', async () => {
      const createRequest: CreateProductRequest = {
        name: 'New Product',
        juros: 3.5,
        prazoMaximo: 24,
        normativo: 'NEW001',
        categoria: 'outro',
      };

      // Mock existing products
      const existingProducts: Product[] = [
        {
          id: '1',
          name: 'Existing Product',
          juros: 2.5,
          prazoMaximo: 12,
          normativo: 'EX001',
          active: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingProducts));

      const result = await productService.createProduct(createRequest);

      // Verify product was created with correct properties
      expect(result.name).toBe(createRequest.name);
      expect(result.juros).toBe(createRequest.juros);
      expect(result.prazoMaximo).toBe(createRequest.prazoMaximo);
      expect(result.normativo).toBe(createRequest.normativo);
      expect(result.categoria).toBe(createRequest.categoria);
      expect(result.active).toBe(false); // Products are created inactive by default
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      // Verify storage was updated
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@caixa:products',
        expect.stringContaining('"name":"New Product"')
      );
    });

    it('should handle storage errors during creation', async () => {
      const createRequest: CreateProductRequest = {
        name: 'New Product',
        juros: 3.5,
        prazoMaximo: 24,
        normativo: 'NEW001',
      };

      // Make getStoredProducts fail - this is called within createProduct
      mockAsyncStorage.getItem.mockResolvedValue('[]'); // First call succeeds to get existing products
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error')); // Storage save fails

      await expect(productService.createProduct(createRequest)).rejects.toThrow('Storage error');
    });
  });

  describe('deleteProduct', () => {
    it('should remove product from storage completely', async () => {
      const existingProducts: Product[] = [
        {
          id: '1',
          name: 'Product to Delete',
          juros: 2.5,
          prazoMaximo: 12,
          normativo: 'DEL001',
          active: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Product to Keep',
          juros: 3.5,
          prazoMaximo: 24,
          normativo: 'KEEP001',
          active: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingProducts));

      await productService.deleteProduct('1');

      // Verify the product was removed completely (not just marked inactive)
      const saveCall = mockAsyncStorage.setItem.mock.calls[0];
      expect(saveCall).toBeDefined();
      
      const savedData = JSON.parse(saveCall![1]);
      
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe('2');
      expect(savedData[0].name).toBe('Product to Keep');
    });

    it('should remove non-existent product without error', async () => {
      const existingProducts: Product[] = [
        {
          id: '1',
          name: 'Product',
          juros: 2.5,
          prazoMaximo: 12,
          normativo: 'EX001',
          active: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingProducts));

      // deleteProduct just filters the array, so it won't throw for non-existent IDs
      await expect(productService.deleteProduct('non-existent')).resolves.not.toThrow();
    });
  });
});
