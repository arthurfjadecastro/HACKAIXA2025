import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/products/api';
import { Product } from '@/services/products/types';
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
      
      const loadedProducts = await productService.getStoredProducts();
      setProducts(loadedProducts);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
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
