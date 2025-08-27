import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ProductsProvider } from '@/contexts/ProductsContext';

interface TestWrapperProps {
  children: React.ReactNode;
}

// Wrapper que combina navegação e context providers para testes
export const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  return (
    <NavigationContainer>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </NavigationContainer>
  );
};

// Função helper para renderizar com todos os providers necessários
export const renderWithProviders = (ui: React.ReactElement) => {
  return (
    <TestWrapper>
      {ui}
    </TestWrapper>
  );
};
