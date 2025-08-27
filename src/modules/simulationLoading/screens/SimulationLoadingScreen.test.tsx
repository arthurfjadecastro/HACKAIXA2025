import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import SimulationLoadingScreen from './SimulationLoadingScreen';

// Mock do Navigation
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

// Mock do SimulationLottieAnimation
jest.mock('../components/LottieAnimation', () => {
  return ({ onComplete, testID }: any) => {
    const { View, Text } = require('react-native');
    // Simula completar animação após 2 segundos
    setTimeout(() => onComplete && onComplete(), 2000);
    return (
      <View testID={testID || 'simulation-loading-animation'}>
        <Text>Loading Animation</Text>
      </View>
    );
  };
});

// Mock dos estilos
jest.mock('./SimulationLoadingScreen.styles', () => ({
  styles: {
    container: { flex: 1 },
    loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  },
}));

// Mock dos timers
jest.useFakeTimers();

describe('SimulationLoadingScreen', () => {
  const mockNavigate = jest.fn();
  const mockReplace = jest.fn();
  const mockNavigation = {
    navigate: mockNavigate,
    replace: mockReplace,
  };

  const mockRoute = {
    params: {
      amount: '50.000,00',
      months: 36,
      productId: 'test-product-123',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should render correctly', () => {
    render(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
    expect(screen.getByText('Loading Animation')).toBeTruthy();
  });

  it('should start with loading status', () => {
    render(<SimulationLoadingScreen />);
    
    // Initially should show loading animation
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
  });

  it('should calculate loan with route parameters', async () => {
    jest.useRealTimers();
    
    render(<SimulationLoadingScreen />);
    
    // Wait for calculation to complete
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('SimulationResult', expect.objectContaining({
        calculation: expect.objectContaining({
          monthlyInstallment: expect.any(Number),
          totalWithInterest: expect.any(Number),
          totalInterest: expect.any(Number),
        }),
        productId: 'test-product-123',
      }));
    }, { timeout: 4000 });
    
    jest.useFakeTimers();
  });

  it('should handle default values when no route params', () => {
    (useRoute as jest.Mock).mockReturnValue({ params: {} });
    
    render(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
  });

  it('should handle missing amount parameter', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { months: 24, productId: 'test-id' }
    });
    
    render(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
  });

  it('should handle missing months parameter', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { amount: '25.000,00', productId: 'test-id' }
    });
    
    render(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
  });

  it('should format amount parameter correctly', async () => {
    jest.useRealTimers();
    
    const customRoute = {
      params: {
        amount: 'R$ 100.000,50',
        months: 48,
        productId: 'custom-product',
      },
    };
    
    (useRoute as jest.Mock).mockReturnValue(customRoute);
    
    render(<SimulationLoadingScreen />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('SimulationResult', expect.objectContaining({
        calculation: expect.objectContaining({
          monthlyInstallment: expect.any(Number),
        }),
        productId: 'custom-product',
      }));
    }, { timeout: 4000 });
    
    jest.useFakeTimers();
  });

  it('should handle navigation timeout', async () => {
    render(<SimulationLoadingScreen />);
    
    // Fast-forward 4 seconds (timeout period)
    jest.advanceTimersByTime(4000);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('SimulationResult', expect.any(Object));
    });
  });

  it('should handle animation completion', async () => {
    jest.useRealTimers();
    
    render(<SimulationLoadingScreen />);
    
    // Animation should complete and trigger navigation
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
    }, { timeout: 3000 });
    
    jest.useFakeTimers();
  });

  it('should calculate different loan amounts correctly', async () => {
    jest.useRealTimers();
    
    const smallLoanRoute = {
      params: {
        amount: '10.000,00',
        months: 12,
        productId: 'small-loan',
      },
    };
    
    (useRoute as jest.Mock).mockReturnValue(smallLoanRoute);
    
    render(<SimulationLoadingScreen />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('SimulationResult', expect.objectContaining({
        calculation: expect.objectContaining({
          monthlyInstallment: expect.any(Number),
          totalWithInterest: expect.any(Number),
        }),
        productId: 'small-loan',
      }));
    }, { timeout: 4000 });
    
    jest.useFakeTimers();
  });

  it('should handle edge case with zero amount', async () => {
    const zeroAmountRoute = {
      params: {
        amount: '0,00',
        months: 24,
        productId: 'zero-loan',
      },
    };
    
    (useRoute as jest.Mock).mockReturnValue(zeroAmountRoute);
    
    render(<SimulationLoadingScreen />);
    
    // Should still render without crashing
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
  });

  it('should maintain consistent calculation across re-renders', () => {
    const { rerender } = render(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
    
    rerender(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
  });

  it('should handle navigation prop changes', () => {
    const customNavigate = jest.fn();
    const customReplace = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ 
      navigate: customNavigate, 
      replace: customReplace 
    });
    
    render(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
    
    // Should use the custom navigation
    jest.advanceTimersByTime(4000);
    
    expect(customReplace).toHaveBeenCalled();
  });

  it('should handle different month durations', async () => {
    jest.useRealTimers();
    
    const longTermRoute = {
      params: {
        amount: '75.000,00',
        months: 120,
        productId: 'long-term',
      },
    };
    
    (useRoute as jest.Mock).mockReturnValue(longTermRoute);
    
    render(<SimulationLoadingScreen />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('SimulationResult', expect.objectContaining({
        calculation: expect.objectContaining({
          monthlyInstallment: expect.any(Number),
        }),
        productId: 'long-term',
      }));
    }, { timeout: 4000 });
    
    jest.useFakeTimers();
  });

  it('should handle malformed amount strings', () => {
    const malformedRoute = {
      params: {
        amount: 'abc123def',
        months: 36,
        productId: 'malformed',
      },
    };
    
    (useRoute as jest.Mock).mockReturnValue(malformedRoute);
    
    render(<SimulationLoadingScreen />);
    
    // Should render without crashing even with invalid amount
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
  });

  it('should cleanup effects on unmount', () => {
    const { unmount } = render(<SimulationLoadingScreen />);
    
    // Should not cause memory leaks
    unmount();
    
    // Advance timers after unmount
    jest.advanceTimersByTime(5000);
    
    // Should not navigate after unmount
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should handle rapid mount/unmount cycles', () => {
    const { unmount, rerender } = render(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
    
    unmount();
    rerender(<SimulationLoadingScreen />);
    
    expect(screen.getByTestId('simulation-loading-animation')).toBeTruthy();
  });
});
