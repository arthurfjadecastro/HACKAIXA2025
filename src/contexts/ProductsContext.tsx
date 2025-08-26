import React, { createContext, useContext, useCallback, useState } from 'react';

interface ProductsContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

interface ProductsProviderProps {
  children: React.ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext deve ser usado dentro de ProductsProvider');
  }
  return context;
};
