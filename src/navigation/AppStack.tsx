import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/design-system/tokens';

import SplashScreen from '@/modules/splash/screens/SplashScreen';
import HomeScreen from '@/modules/home/screens/HomeScreen';
import ProductListScreen from '@/modules/products/screens/ProductList';
import ProductSimulatorScreen from '@/modules/products/screens/ProductSimulator';
import RegisterProductsScreen from '@/modules/products/screens/RegisterProducts';
import CreateProductScreen from '@/modules/products/screens/CreateProduct';

export type AppStackParamList = {
  Splash: undefined;
  Home: undefined;
  ProductList: undefined;
  ProductSimulator: { productId?: string };
  RegisterProducts: undefined;
  CreateProduct: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
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
        name="Splash" 
        component={SplashScreen}
        options={{ 
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'C150713 CAIXA',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ 
          title: 'Produtos de Empréstimo',
          headerShown: false
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
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="CreateProduct" 
        component={CreateProductScreen}
        options={{ 
          title: 'Cadastre um novo produto',
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
