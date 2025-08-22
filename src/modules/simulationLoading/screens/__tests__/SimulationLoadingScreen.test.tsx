import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SimulationLoadingScreen from '../SimulationLoadingScreen';

// Mock dos componentes de navegação
const mockNavigate = jest.fn();
const mockRoute = {
  params: {
    productId: 'test-product',
    amount: '1000,00',
    months: 12
  }
};

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  useRoute: () => mockRoute,
}));

// Mock do SimulationLottieAnimation
jest.mock('../../components/LottieAnimation', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  
  return function MockSimulationLottieAnimation({ isLoading, onFinish, testID }: any) {
    React.useEffect(() => {
      if (!isLoading && onFinish) {
        // Simula finalização da animação
        setTimeout(onFinish, 100);
      }
    }, [isLoading, onFinish]);
    
    return (
      <View testID={testID}>
        <Text>{isLoading ? 'Loading Animation' : 'Finished Animation'}</Text>
      </View>
    );
  };
});

const Stack = createNativeStackNavigator();

const renderWithNavigation = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Test" component={() => component} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('SimulationLoadingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render loading animation', () => {
    renderWithNavigation(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
    expect(screen.getByText('Loading Animation')).toBeTruthy();
  });

  it('should show calculation in progress', async () => {
    renderWithNavigation(<SimulationLoadingScreen />);
    
    // Inicialmente deve mostrar loading
    expect(screen.getByText('Loading Animation')).toBeTruthy();
    
    // Avança o timer para simular o cálculo (4000ms)
    jest.advanceTimersByTime(4000);
    
    // Aguarda a transição para finished
    await waitFor(() => {
      expect(screen.getByText('Finished Animation')).toBeTruthy();
    });
  });

  it('should eventually call navigation', async () => {
    renderWithNavigation(<SimulationLoadingScreen />);
    
    // Avança o timer para completar o cálculo
    jest.advanceTimersByTime(5000);
    
    // A navegação deve eventualmente ser chamada
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
