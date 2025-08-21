import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigator from '@/navigation/AppStack';
import { ProductsProvider } from '@/contexts/ProductsContext';

export default function App() {
  return (
    <ProductsProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppStackNavigator />
      </NavigationContainer>
    </ProductsProvider>
  );
}
