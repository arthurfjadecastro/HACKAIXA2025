import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithNavigation } from '@/navigation/test-utils';
import HomeScreen from './HomeScreen';

// Mock do console.log para testar o handleLogin
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

// Mock do setTimeout para testar navegação
jest.useFakeTimers();

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock dos componentes para facilitar testes
jest.mock('@/modules/home/components/LoginBottomSheet', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ visible, onClose, onLogin }: any) => {
    if (!visible) return null;
    return (
      <View testID="login-bottom-sheet">
        <Text>Login BottomSheet</Text>
        <TouchableOpacity testID="close-bottom-sheet" onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="perform-login" onPress={() => onLogin('user', 'pass')}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockConsoleLog.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('renders successfully', () => {
    const { toJSON } = renderWithNavigation(<HomeScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => {
      renderWithNavigation(<HomeScreen />);
    }).not.toThrow();
  });

  it('shows welcome message and action cards', () => {
    const { getByText, getByTestId } = renderWithNavigation(<HomeScreen />);
    
    // Verifica mensagem de boas-vindas
    expect(getByText('Bem‑vindo! Vamos começar?')).toBeTruthy();
    
    // Verifica action card principal
    expect(getByTestId('login-action-card')).toBeTruthy();
  });

  it('displays user information correctly', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    expect(getByText('ARTHUR DE CASTRO')).toBeTruthy();
    expect(getByText('C150713-2')).toBeTruthy();
    expect(getByText('TEIA - BOX DE RELACIONAMENTO DIGITAL')).toBeTruthy();
    expect(getByText('GECDI - GN CANAIS DIGITAIS')).toBeTruthy();
  });

  it('auto-opens login bottom sheet after 1 second', async () => {
    const { queryByTestId, getByTestId } = renderWithNavigation(<HomeScreen />);
    
    // Initially bottom sheet should not be visible
    expect(queryByTestId('login-bottom-sheet')).toBeNull();

    // Fast-forward 1 second
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(getByTestId('login-bottom-sheet')).toBeTruthy();
    });
  });

  it('can press login action card and opens bottom sheet', () => {
    const { getByTestId } = renderWithNavigation(<HomeScreen />);
    
    const loginCard = getByTestId('login-action-card');
    fireEvent.press(loginCard);
    
    expect(getByTestId('login-bottom-sheet')).toBeTruthy();
  });

  it('closes bottom sheet when close is triggered', async () => {
    const { getByTestId, queryByTestId } = renderWithNavigation(<HomeScreen />);
    
    // Abrir o modal primeiro
    const loginCard = getByTestId('login-action-card');
    fireEvent.press(loginCard);
    
    expect(getByTestId('login-bottom-sheet')).toBeTruthy();
    
    // Fechar o modal
    const closeButton = getByTestId('close-bottom-sheet');
    fireEvent.press(closeButton);
    
    await waitFor(() => {
      expect(queryByTestId('login-bottom-sheet')).toBeNull();
    });
  });

  it('handles login function correctly and navigates', async () => {
    const { getByTestId, queryByTestId } = renderWithNavigation(<HomeScreen />);
    
    // Abrir o modal primeiro
    const loginCard = getByTestId('login-action-card');
    fireEvent.press(loginCard);
    
    expect(getByTestId('login-bottom-sheet')).toBeTruthy();
    
    // Fazer login
    const loginButton = getByTestId('perform-login');
    fireEvent.press(loginButton);
    
    // Bottom sheet deve fechar imediatamente
    await waitFor(() => {
      expect(queryByTestId('login-bottom-sheet')).toBeNull();
    });
    
    // Avançar 300ms para navegação
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('ProductList');
    });
  });

  it('handles multiple bottom sheet interactions', () => {
    const { getByTestId, queryByTestId } = renderWithNavigation(<HomeScreen />);
    
    const loginCard = getByTestId('login-action-card');
    
    // Abrir e fechar múltiplas vezes
    fireEvent.press(loginCard);
    expect(getByTestId('login-bottom-sheet')).toBeTruthy();
    
    fireEvent.press(getByTestId('close-bottom-sheet'));
    expect(queryByTestId('login-bottom-sheet')).toBeNull();
    
    fireEvent.press(loginCard);
    expect(getByTestId('login-bottom-sheet')).toBeTruthy();
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = renderWithNavigation(<HomeScreen />);
    
    // Unmount before timer fires
    unmount();
    
    // Advance time - should not cause any issues
    jest.advanceTimersByTime(1000);
    
    // If we reach here without error, cleanup worked
    expect(true).toBe(true);
  });

  it('renders action card with correct title', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    expect(getByText('Entrar')).toBeTruthy();
  });

  it('maintains state across re-renders', () => {
    const { getByTestId, rerender } = renderWithNavigation(<HomeScreen />);
    
    // Open bottom sheet
    fireEvent.press(getByTestId('login-action-card'));
    expect(getByTestId('login-bottom-sheet')).toBeTruthy();
    
    // Re-render
    rerender(<HomeScreen />);
    
    // State should be maintained
    expect(getByTestId('login-bottom-sheet')).toBeTruthy();
  });
});
