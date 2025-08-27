import { renderHook, act } from '@testing-library/react-native';
import { useDeleteProduct } from './useDeleteProduct';
import { productService } from '@/services/products/api';
import { useProductsContext } from '@/contexts/ProductsContext';

// Mock dependencies
jest.mock('@/services/products/api');
jest.mock('@/contexts/ProductsContext');

const mockProductService = productService as jest.Mocked<typeof productService>;
const mockUseProductsContext = useProductsContext as jest.MockedFunction<typeof useProductsContext>;

describe('useDeleteProduct', () => {
  const mockTriggerRefresh = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProductsContext.mockReturnValue({
      refreshTrigger: 0,
      triggerRefresh: mockTriggerRefresh,
    });
  });

  it('should return deleteProduct function', () => {
    const { result } = renderHook(() => useDeleteProduct());

    expect(typeof result.current.deleteProduct).toBe('function');
  });

  it('should delete product and trigger refresh', async () => {
    const productId = 'test-product-id';
    mockProductService.deleteProduct.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteProduct());

    await act(async () => {
      await result.current.deleteProduct(productId);
    });

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(mockTriggerRefresh).toHaveBeenCalled();
  });

  it('should handle delete product error', async () => {
    const productId = 'test-product-id';
    const error = new Error('Failed to delete product');
    mockProductService.deleteProduct.mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteProduct());

    await expect(act(async () => {
      await result.current.deleteProduct(productId);
    })).rejects.toThrow('Failed to delete product');

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(mockTriggerRefresh).not.toHaveBeenCalled();
  });
});
