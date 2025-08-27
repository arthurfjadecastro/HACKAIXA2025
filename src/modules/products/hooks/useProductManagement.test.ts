import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProductManagement } from './useProductManagement';

// Mock the dependencies
jest.mock('./useProducts', () => ({
  useProducts: () => ({
    products: [
      { id: '1', name: 'Product 1', active: true },
      { id: '2', name: 'Product 2', active: false }
    ],
    loading: false,
    refetch: jest.fn()
  })
}));

jest.mock('@/contexts/ProductsContext', () => ({
  useProductsContext: () => ({
    triggerRefresh: jest.fn()
  })
}));

jest.mock('@/services/products/api', () => ({
  productService: {
    updateProduct: jest.fn()
  }
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn()
  }
}));

describe('useProductManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useProductManagement());
    
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });

  it('should provide products data', () => {
    const { result } = renderHook(() => useProductManagement());
    
    expect(result.current.products).toBeDefined();
    expect(Array.isArray(result.current.products)).toBe(true);
    expect(result.current.products).toHaveLength(2);
  });

  it('should provide loading state', () => {
    const { result } = renderHook(() => useProductManagement());
    
    expect(typeof result.current.loading).toBe('boolean');
    expect(result.current.loading).toBe(false);
  });

  it('should provide toggleLoading state', () => {
    const { result } = renderHook(() => useProductManagement());
    
    expect(result.current.toggleLoading).toBe(null);
  });

  it('should provide action functions', () => {
    const { result } = renderHook(() => useProductManagement());
    
    expect(typeof result.current.toggleProductStatus).toBe('function');
    expect(typeof result.current.refetch).toBe('function');
  });

  it('should toggle product status successfully', async () => {
    const mockUpdateProduct = require('@/services/products/api').productService.updateProduct;
    
    // Mock successful update
    mockUpdateProduct.mockResolvedValueOnce({});
    
    const { result } = renderHook(() => useProductManagement());
    
    await act(async () => {
      await result.current.toggleProductStatus('1');
    });
    
    expect(mockUpdateProduct).toHaveBeenCalledWith('1', { active: false });
    expect(Alert.alert).toHaveBeenCalledWith('Sucesso', expect.any(String));
  });

  it('should handle toggle product error', async () => {
    const mockUpdateProduct = require('@/services/products/api').productService.updateProduct;
    
    // Mock error
    mockUpdateProduct.mockRejectedValueOnce(new Error('API Error'));
    
    const { result } = renderHook(() => useProductManagement());
    
    await act(async () => {
      await result.current.toggleProductStatus('1');
    });
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', expect.any(String));
  });

  it('should handle product not found', async () => {
    const { result } = renderHook(() => useProductManagement());
    
    await act(async () => {
      await result.current.toggleProductStatus('invalid-id');
    });
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Produto não encontrado');
  });
});
