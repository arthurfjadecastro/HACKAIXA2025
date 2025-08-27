import { renderHook, act } from '@testing-library/react-native';
import { useProducts } from './useProducts';
import { productService } from '@/services/products/api';
import { useProductsContext } from '@/contexts/ProductsContext';

// Mock do productService
jest.mock('@/services/products/api', () => ({
  productService: {
    getStoredProducts: jest.fn(),
  },
}));

// Mock do useProductsContext
jest.mock('@/contexts/ProductsContext', () => ({
  useProductsContext: jest.fn(),
}));

const mockProductService = productService as jest.Mocked<typeof productService>;
const mockUseProductsContext = useProductsContext as jest.MockedFunction<typeof useProductsContext>;

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProductsContext.mockReturnValue({
      refreshTrigger: 0,
      triggerRefresh: jest.fn(),
    });
  });

  it('should initialize with correct default values', () => {
    mockProductService.getStoredProducts.mockResolvedValue([]);
    
    const { result } = renderHook(() => useProducts());

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.refetch).toBe('function');
    expect(typeof result.current.refresh).toBe('function');
  });

  it('should load products successfully', async () => {
    const mockProducts = [] as any[];
    mockProductService.getStoredProducts.mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle loading error', async () => {
    const errorMessage = 'Failed to load products';
    mockProductService.getStoredProducts.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle non-Error exceptions', async () => {
    mockProductService.getStoredProducts.mockRejectedValue('String error');

    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Erro ao carregar produtos');
  });

  it('should refetch products with loading state', async () => {
    mockProductService.getStoredProducts.mockResolvedValue([]);

    const { result } = renderHook(() => useProducts());

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);

    // Call refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.loading).toBe(false);
    expect(mockProductService.getStoredProducts).toHaveBeenCalledTimes(2);
  });

  it('should refresh products without showing loading', async () => {
    mockProductService.getStoredProducts.mockResolvedValue([]);

    const { result } = renderHook(() => useProducts());

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const initialLoading = result.current.loading;

    // Call refresh
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.loading).toBe(initialLoading);
    expect(mockProductService.getStoredProducts).toHaveBeenCalledTimes(2);
  });

  it('should handle empty products array', async () => {
    mockProductService.getStoredProducts.mockResolvedValue([]);

    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should maintain function references between renders', () => {
    mockProductService.getStoredProducts.mockResolvedValue([]);

    const { result } = renderHook(() => useProducts());

    const firstRefetch = result.current.refetch;
    const firstRefresh = result.current.refresh;

    expect(result.current.refetch).toBe(firstRefetch);
    expect(result.current.refresh).toBe(firstRefresh);
  });

  it('should clear error on successful refetch', async () => {
    // First call fails
    mockProductService.getStoredProducts.mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useProducts());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Network error');

    // Second call succeeds
    mockProductService.getStoredProducts.mockResolvedValue([]);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBe(null);
    expect(result.current.products).toEqual([]);
  });
});
