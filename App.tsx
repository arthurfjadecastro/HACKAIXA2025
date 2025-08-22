import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigator from '@/navigation/AppStack';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { useCaixaFonts } from '@/design-system';


export default function App() {
  const [fontsLoaded, fontError] = useCaixaFonts();
  // Não renderizar nada até as fontes carregarem
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ProductsProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppStackNavigator />
      </NavigationContainer>
    </ProductsProvider>
  );
}
