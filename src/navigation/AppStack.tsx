import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/design-system/tokens';

import HomeScreen from '@/modules/home/screens/HomeScreen';
import ProductListScreen from '@/modules/products/screens/ProductList';
import ProductSimulatorScreen from '@/modules/products/screens/ProductSimulator';
import RegisterProductsScreen from '@/modules/products/screens/RegisterProducts';

export type AppStackParamList = {
  Home: undefined;
  ProductList: undefined;
  ProductSimulator: { productId?: string };
  RegisterProducts: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary.main,
        },
        headerTintColor: colors.primary.contrast,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'C150713 CAIXA',
          headerShown: true
        }}
      />
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ 
          title: 'Produtos de Empréstimo',
          headerShown: true
        }}
      />
      <Stack.Screen 
        name="ProductSimulator" 
        component={ProductSimulatorScreen}
        options={{ 
          title: 'Simulador de Empréstimo',
          headerShown: true
        }}
      />
      <Stack.Screen 
        name="RegisterProducts" 
        component={RegisterProductsScreen}
        options={{ 
          title: 'Register Products',
          headerShown: true
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
