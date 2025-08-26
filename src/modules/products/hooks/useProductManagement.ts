import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import { productService } from '@/services/products/productService.mock';
import { useProductsContext } from '@/contexts/ProductsContext';

export const useProductManagement = () => {
  const { products, loading, refetch } = useProducts();
  const { triggerRefresh } = useProductsContext();
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const toggleProductStatus = useCallback(async (productId: string) => {
    setToggleLoading(productId);
    
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        Alert.alert('Erro', 'Produto não encontrado');
        return;
      }

      await productService.updateProduct(productId, { active: !product.active });
      
      // Atualizar a lista local e global
      await refetch();
      triggerRefresh();
      
      Alert.alert(
        'Sucesso', 
        `Produto ${!product.active ? 'ativado' : 'desativado'} com sucesso!`
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o produto. Tente novamente.');
    } finally {
      setToggleLoading(null);
    }
  }, [products, refetch, triggerRefresh]);

  return {
    products,
    loading,
    toggleProductStatus,
    toggleLoading,
    refetch
  };
};
