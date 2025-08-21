import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/products/productService.mock';
import { Product } from '@/services/products/productTypes';
import { useProductsContext } from '@/contexts/ProductsContext';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useProductsContext();

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      console.log('🔄 Carregando lista de produtos...');
      
      const loadedProducts = await productService.getStoredProducts();
      setProducts(loadedProducts);
      
      console.log(`✅ ${loadedProducts.length} produtos carregados`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      console.error('❌ Erro ao carregar produtos:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch (com loading)
  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchProducts();
  }, [fetchProducts]);

  // Refresh (sem loading para pull-to-refresh)
  const refresh = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshTrigger]); // ← Escuta mudanças no refreshTrigger

  return {
    products,
    loading,
    error,
    refetch,
    refresh,
  };
};
