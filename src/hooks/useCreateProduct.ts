import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { productService } from '@/services/products/productService.mock';
import { CreateProductRequest, CreateProductResponse } from '@/services/products/productTypes';
import { useProductsContext } from '@/contexts/ProductsContext';

interface UseCreateProductReturn {
  createProduct: (data: CreateProductRequest) => Promise<CreateProductResponse>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useCreateProduct = (): UseCreateProductReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { triggerRefresh } = useProductsContext();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createProduct = useCallback(async (data: CreateProductRequest): Promise<CreateProductResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Criando produto:', data);
      
      const newProduct = await productService.createProduct(data);
      
      console.log('✅ Produto criado com sucesso:', newProduct);
      
      // Feedback visual de sucesso
      Alert.alert(
        'Sucesso!',
        `Produto "${newProduct.name}" cadastrado com sucesso.`,
        [{ text: 'OK' }]
      );
      
      // ✨ Aciona refresh global da lista
      triggerRefresh();
      
      return {
        success: true,
        data: newProduct,
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto';
      console.error('❌ Erro ao criar produto:', errorMessage);
      
      setError(errorMessage);
      
      // Feedback visual de erro
      Alert.alert(
        'Erro',
        errorMessage,
        [{ text: 'OK' }]
      );
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProduct,
    loading,
    error,
    clearError,
  };
};
