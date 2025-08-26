import { useCallback } from 'react';
import { productService } from '@/services/products/productService.mock';
import { useProductsContext } from '@/contexts/ProductsContext';

export function useDeleteProduct() {
  const { triggerRefresh } = useProductsContext();

  const deleteProduct = useCallback(async (id: string) => {
    await productService.deleteProduct(id);
    triggerRefresh();
  }, [triggerRefresh]);

  return { deleteProduct };
}
