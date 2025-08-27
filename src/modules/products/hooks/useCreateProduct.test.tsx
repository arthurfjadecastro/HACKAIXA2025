import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useCreateProduct } from './useCreateProduct';
import { productService } from '@/services/products/api';
import { useProductsContext } from '@/contexts/ProductsContext';

// Mock dependencies
jest.mock('@/services/products/api');
jest.mock('@/contexts/ProductsContext');
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

const mockProductService = productService as jest.Mocked<typeof productService>;
const mockUseProductsContext = useProductsContext as jest.MockedFunction<typeof useProductsContext>;
const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;

describe('useCreateProduct', () => {
  const mockTriggerRefresh = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProductsContext.mockReturnValue({
      refreshTrigger: 0,
      triggerRefresh: mockTriggerRefresh,
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useCreateProduct());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.createProduct).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useCreateProduct());

    // Set an error first
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('should create product successfully', async () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      juros: 5.5,
      prazoMaximo: 12,
      normativo: 'Test normative',
      active: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      categoria: 'outro'
    };

    const mockRequest = {
      name: 'Test Product',
      juros: 5.5,
      prazoMaximo: 12,
      normativo: 'Test normative',
      categoria: 'outro'
    };

    mockProductService.createProduct.mockResolvedValue(mockProduct);

    const { result } = renderHook(() => useCreateProduct());

    let response;
    await act(async () => {
      response = await result.current.createProduct(mockRequest);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(response).toEqual({
      success: true,
      data: mockProduct,
    });
    expect(mockProductService.createProduct).toHaveBeenCalledWith(mockRequest);
    expect(mockTriggerRefresh).toHaveBeenCalled();
  });

  it('should handle create product error', async () => {
    const errorMessage = 'Failed to create product';
    mockProductService.createProduct.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCreateProduct());

    const mockRequest = {
      name: 'Test Product',
      juros: 5.5,
      prazoMaximo: 12,
      normativo: 'Test normative',
      categoria: 'outro'
    };

    let response;
    await act(async () => {
      response = await result.current.createProduct(mockRequest);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(response).toEqual({
      success: false,
      error: errorMessage,
    });
    expect(mockAlert).toHaveBeenCalledWith(
      'Erro',
      errorMessage,
      [{ text: 'OK' }]
    );
    expect(mockTriggerRefresh).not.toHaveBeenCalled();
  });

});
