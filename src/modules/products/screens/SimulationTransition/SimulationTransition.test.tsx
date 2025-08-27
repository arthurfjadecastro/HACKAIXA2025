import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import SimulationTransition from './SimulationTransition';
import { useSimulationTransition } from './hooks/useSimulationTransition';
import { useBackPressHandler } from './hooks/useBackPressHandler';

// Mock dos hooks
jest.mock('./hooks/useSimulationTransition');
jest.mock('./hooks/useBackPressHandler');

// Mock do React Navigation
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useRoute: jest.fn(),
  };
});

// Mock dos componentes filhos
jest.mock('./components/StatusCard', () => {
  const { View, Text } = require('react-native');
  return {
    StatusCard: ({ state, statusText }: { state: string; statusText: string }) => (
      <View testID="status-card">
        <Text testID="status-card-state">{state}</Text>
        <Text testID="status-card-text">{statusText}</Text>
      </View>
    ),
  };
});

jest.mock('./components/AnimationPlaceholder', () => {
  const { View, Text } = require('react-native');
  return {
    AnimationPlaceholder: ({ state }: { state: string }) => (
      <View testID="animation-placeholder">
        <Text testID="animation-state">{state}</Text>
      </View>
    ),
  };
});

jest.mock('./components/StatusDisplay', () => {
  const { View, Text } = require('react-native');
  return {
    StatusDisplay: ({ state, requestId }: { state: string; requestId: string }) => (
      <View testID="status-display">
        <Text testID="status-display-state">{state}</Text>
        <Text testID="status-display-id">{requestId}</Text>
      </View>
    ),
  };
});

// Mock do design system
jest.mock('@/design-system/components', () => ({
  Text: ({ children, testID, ...props }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText testID={testID} {...props}>{children}</RNText>;
  },
}));

jest.mock('@/design-system/tokens', () => ({
  theme: {
    colors: {
      primary: {
        main: '#005CA9',
        light: '#0066CC',
        dark: '#004A8A',
        contrast: '#FFFFFF',
      },
      secondary: {
        main: '#12161C',
        light: '#2A2E3A',
        dark: '#000000',
        contrast: '#FFFFFF',
      },
      background: {
        primary: '#F4F8FB',
        secondary: '#FFFFFF',
        card: '#FFFFFF',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },
      text: {
        primary: '#12161C',
        secondary: '#6B7280',
        contrast: '#FFFFFF',
        link: '#005CA9',
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    typography: {
      h1: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
      },
      h2: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32,
      },
      body1: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
      },
      body2: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
      },
    },
  },
}));

const mockUseSimulationTransition = useSimulationTransition as jest.MockedFunction<typeof useSimulationTransition>;
const mockUseBackPressHandler = useBackPressHandler as jest.MockedFunction<typeof useBackPressHandler>;
const mockUseRoute = require('@react-navigation/native').useRoute as jest.MockedFunction<any>;

const renderWithNavigation = (routeParams?: any) => {
  mockUseRoute.mockReturnValue({
    params: routeParams || {
      productId: 'test-product',
      amount: '10000',
      months: 12,
    },
  });
  
  return render(
    <NavigationContainer>
      <SimulationTransition />
    </NavigationContainer>
  );
};

describe('SimulationTransition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup padrão dos mocks
    mockUseSimulationTransition.mockReturnValue({
      state: 'loading',
      statusText: 'Processando...',
      requestId: 'test-request-123',
    });
    
    mockUseBackPressHandler.mockImplementation(() => {});
  });

  it('should render correctly with default state', () => {
    renderWithNavigation();
    
    expect(screen.getByText('Processando Simulação')).toBeTruthy();
    expect(screen.getByText('Estamos calculando as melhores condições para você.')).toBeTruthy();
    expect(screen.getByTestId('status-card')).toBeTruthy();
    expect(screen.getByTestId('animation-placeholder')).toBeTruthy();
    expect(screen.getByTestId('status-display')).toBeTruthy();
  });

  it('should call useSimulationTransition with correct parameters from route', () => {
    const routeParams = {
      productId: 'test-product-123',
      amount: '50000',
      months: 24,
    };
    
    renderWithNavigation(routeParams);
    
    expect(mockUseSimulationTransition).toHaveBeenCalledWith({
      productId: 'test-product-123',
      amount: '50000',
      months: 24,
    });
  });

  it('should call useBackPressHandler with correct state', () => {
    const testState = 'loading';
    mockUseSimulationTransition.mockReturnValue({
      state: testState,
      statusText: 'Loading...',
      requestId: 'test-id',
    });
    
    renderWithNavigation();
    
    expect(mockUseBackPressHandler).toHaveBeenCalledWith({ state: testState });
  });

  it('should display idle state correctly', () => {
    mockUseSimulationTransition.mockReturnValue({
      state: 'idle',
      statusText: 'Iniciando...',
      requestId: 'test-request-idle',
    });
    
    renderWithNavigation();
    
    expect(screen.getByTestId('status-card-state')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-card-text')).toHaveTextContent('Iniciando...');
    expect(screen.getByTestId('animation-state')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-display-state')).toHaveTextContent('idle');
    expect(screen.getByTestId('status-display-id')).toHaveTextContent('test-request-idle');
  });

  it('should display loading state correctly', () => {
    mockUseSimulationTransition.mockReturnValue({
      state: 'loading',
      statusText: 'Processando dados...',
      requestId: 'test-request-loading',
    });
    
    renderWithNavigation();
    
    expect(screen.getByTestId('status-card-state')).toHaveTextContent('loading');
    expect(screen.getByTestId('status-card-text')).toHaveTextContent('Processando dados...');
    expect(screen.getByTestId('animation-state')).toHaveTextContent('loading');
    expect(screen.getByTestId('status-display-state')).toHaveTextContent('loading');
    expect(screen.getByTestId('status-display-id')).toHaveTextContent('test-request-loading');
  });

  it('should display success state correctly', () => {
    mockUseSimulationTransition.mockReturnValue({
      state: 'success',
      statusText: 'Simulação concluída!',
      requestId: 'test-request-success',
    });
    
    renderWithNavigation();
    
    expect(screen.getByTestId('status-card-state')).toHaveTextContent('success');
    expect(screen.getByTestId('status-card-text')).toHaveTextContent('Simulação concluída!');
    expect(screen.getByTestId('animation-state')).toHaveTextContent('success');
    expect(screen.getByTestId('status-display-state')).toHaveTextContent('success');
    expect(screen.getByTestId('status-display-id')).toHaveTextContent('test-request-success');
  });

  it('should display error state correctly with error hint', () => {
    mockUseSimulationTransition.mockReturnValue({
      state: 'error',
      statusText: 'Erro na simulação',
      requestId: 'test-request-error',
    });
    
    renderWithNavigation();
    
    expect(screen.getByTestId('status-card-state')).toHaveTextContent('error');
    expect(screen.getByTestId('status-card-text')).toHaveTextContent('Erro na simulação');
    expect(screen.getByTestId('animation-state')).toHaveTextContent('error');
    expect(screen.getByTestId('status-display-state')).toHaveTextContent('error');
    expect(screen.getByTestId('status-display-id')).toHaveTextContent('test-request-error');
    expect(screen.getByText('Tente novamente ou verifique sua conexão.')).toBeTruthy();
  });

  it('should not display error hint when state is not error', () => {
    mockUseSimulationTransition.mockReturnValue({
      state: 'loading',
      statusText: 'Carregando...',
      requestId: 'test-request',
    });
    
    renderWithNavigation();
    
    expect(() => screen.getByText('Tente novamente ou verifique sua conexão.')).toThrow();
  });

  it('should handle different route parameter combinations', () => {
    const testCases = [
      { productId: 'prod-1', amount: '1000', months: 6 },
      { productId: 'prod-2', amount: '25000', months: 12 },
      { productId: 'prod-3', amount: '100000', months: 36 },
    ];
    
    testCases.forEach(params => {
      renderWithNavigation(params);
      expect(mockUseSimulationTransition).toHaveBeenCalledWith(params);
    });
  });

  it('should pass correct state to useBackPressHandler in different states', () => {
    const states = ['idle', 'loading', 'success', 'error'];
    
    states.forEach(state => {
      mockUseSimulationTransition.mockReturnValue({
        state: state as any,
        statusText: `Status: ${state}`,
        requestId: `req-${state}`,
      });
      
      renderWithNavigation();
      
      expect(mockUseBackPressHandler).toHaveBeenCalledWith({ state });
    });
  });

  it('should handle rapid state changes correctly', () => {
    const { rerender } = renderWithNavigation();
    
    // Estado inicial
    mockUseSimulationTransition.mockReturnValue({
      state: 'idle',
      statusText: 'Iniciando...',
      requestId: 'req-1',
    });
    
    rerender(
      <NavigationContainer>
        <SimulationTransition />
      </NavigationContainer>
    );
    
    expect(screen.getByTestId('status-card-state')).toHaveTextContent('idle');
    
    // Mudança para loading
    mockUseSimulationTransition.mockReturnValue({
      state: 'loading',
      statusText: 'Processando...',
      requestId: 'req-1',
    });
    
    rerender(
      <NavigationContainer>
        <SimulationTransition />
      </NavigationContainer>
    );
    
    expect(screen.getByTestId('status-card-state')).toHaveTextContent('loading');
    
    // Mudança para success
    mockUseSimulationTransition.mockReturnValue({
      state: 'success',
      statusText: 'Concluído!',
      requestId: 'req-1',
    });
    
    rerender(
      <NavigationContainer>
        <SimulationTransition />
      </NavigationContainer>
    );
    
    expect(screen.getByTestId('status-card-state')).toHaveTextContent('success');
  });

  it('should maintain consistent requestId throughout state changes', () => {
    const requestId = 'consistent-request-id';
    
    mockUseSimulationTransition.mockReturnValue({
      state: 'loading',
      statusText: 'Processing...',
      requestId,
    });
    
    renderWithNavigation();
    
    expect(screen.getByTestId('status-display-id')).toHaveTextContent(requestId);
  });

  it('should handle statusText changes correctly', () => {
    const statusTexts = [
      'Iniciando simulação...',
      'Validando dados...',
      'Calculando juros...',
      'Finalizando...',
      'Concluído!',
    ];
    
    statusTexts.forEach(statusText => {
      mockUseSimulationTransition.mockReturnValue({
        state: 'loading',
        statusText,
        requestId: 'test-req',
      });
      
      const { unmount } = renderWithNavigation();
      
      expect(screen.getByTestId('status-card-text')).toHaveTextContent(statusText);
      
      unmount();
    });
  });

  it('should render all required components in correct order', () => {
    renderWithNavigation();
    
    const container = screen.getByText('Processando Simulação').parent?.parent;
    expect(container).toBeTruthy();
    
    // Verificar se todos os componentes estão presentes
    expect(screen.getByText('Processando Simulação')).toBeTruthy();
    expect(screen.getByText('Estamos calculando as melhores condições para você.')).toBeTruthy();
    expect(screen.getByTestId('animation-placeholder')).toBeTruthy();
    expect(screen.getByTestId('status-card')).toBeTruthy();
    expect(screen.getByTestId('status-display')).toBeTruthy();
  });
});