import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigator, { AppStackParamList } from './AppStack';

// Mocks das screens
jest.mock('@/modules/splash/screens/SplashScreen', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockSplashScreen() {
    return React.createElement(View, { testID: 'splash-screen' }, 
      React.createElement(Text, null, 'Splash')
    );
  };
});

jest.mock('@/modules/home/screens/HomeScreen', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockHomeScreen() {
    return React.createElement(View, { testID: 'home-screen' }, 
      React.createElement(Text, null, 'Home')
    );
  };
});

jest.mock('@/modules/products/screens/ProductList', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockProductList() {
    return React.createElement(View, { testID: 'product-list' }, 
      React.createElement(Text, null, 'ProductList')
    );
  };
});

jest.mock('@/modules/products/screens/ProductSimulator', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockProductSimulator() {
    return React.createElement(View, { testID: 'product-simulator' }, 
      React.createElement(Text, null, 'Simulator')
    );
  };
});

jest.mock('@/modules/products/screens/LoanConfiguration', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockLoanConfiguration() {
    return React.createElement(View, { testID: 'loan-config' }, 
      React.createElement(Text, null, 'LoanConfig')
    );
  };
});

jest.mock('@/modules/simulationLoading/screens', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockSimulationLoading() {
    return React.createElement(View, { testID: 'sim-loading' }, 
      React.createElement(Text, null, 'Loading')
    );
  };
});

jest.mock('@/modules/products/screens/SimulationResult', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockSimulationResult() {
    return React.createElement(View, { testID: 'sim-result' }, 
      React.createElement(Text, null, 'Result')
    );
  };
});

jest.mock('@/modules/products/screens/RegisterProducts', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockRegisterProducts() {
    return React.createElement(View, { testID: 'register' }, 
      React.createElement(Text, null, 'Register')
    );
  };
});

jest.mock('@/modules/products/screens/CreateProduct', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockCreateProduct() {
    return React.createElement(View, { testID: 'create' }, 
      React.createElement(Text, null, 'Create')
    );
  };
});

jest.mock('@/design-system/tokens', () => ({
  colors: {
    primary: {
      main: '#005ca9',
      contrast: '#ffffff'
    }
  }
}));

describe('AppStack Navigation', () => {
  it('should export AppStackNavigator as default', () => {
    expect(AppStackNavigator).toBeDefined();
    expect(typeof AppStackNavigator).toBe('function');
  });

  it('should be a valid React component', () => {
    expect(React.isValidElement(<AppStackNavigator />)).toBe(true);
  });

  it('should render without crashing', () => {
    expect(() => {
      render(
        <NavigationContainer>
          <AppStackNavigator />
        </NavigationContainer>
      );
    }).not.toThrow();
  });

  it('should export AppStackParamList type correctly', () => {
    const testParams: AppStackParamList = {
      Splash: undefined,
      Home: undefined,
      ProductList: undefined,
      ProductSimulator: { productId: 'test-id' },
      LoanConfiguration: { productId: 'test-id', amount: '10000' },
      SimulationLoading: { productId: 'test-id', amount: '10000', months: 12 },
      SimulationResult: { productId: 'test-id', amount: '10000', months: 12, result: {} },
      RegisterProducts: undefined,
      CreateProduct: undefined,
    };
    
    expect(testParams).toBeDefined();
    expect(testParams.ProductSimulator?.productId).toBe('test-id');
    expect(testParams.LoanConfiguration.productId).toBe('test-id');
    expect(testParams.LoanConfiguration.amount).toBe('10000');
  });

  it('should render with navigation container', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <AppStackNavigator />
      </NavigationContainer>
    );
    
    // Should render the initial screen (Splash)
    expect(getByTestId('splash-screen')).toBeTruthy();
  });

  it('should validate ProductSimulator params are optional', () => {
    const validParams1: AppStackParamList['ProductSimulator'] = { productId: 'test' };
    const validParams2: AppStackParamList['ProductSimulator'] = {};
    
    expect(validParams1.productId).toBe('test');
    expect(validParams2.productId).toBeUndefined();
  });
});
