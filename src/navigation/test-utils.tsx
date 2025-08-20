import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Wrapper para componentes que precisam de navegação
const NavigationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NavigationContainer>
    {children}
  </NavigationContainer>
);

// Função helper para renderizar com navegação
export const renderWithNavigation = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: NavigationWrapper, ...options });
};

// Re-export tudo do @testing-library/react-native
export * from '@testing-library/react-native';
