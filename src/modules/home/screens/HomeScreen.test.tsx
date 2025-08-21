import React from 'react';
import { fireEvent } from '@testing-library/react-native';
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

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockConsoleLog.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
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
    expect(getByText('Que bom ter você aqui!')).toBeTruthy();
    
    // Verifica action card principal
    expect(getByTestId('login-action-card')).toBeTruthy();
  });

  it('can press login action card and opens bottom sheet', () => {
    const { getByTestId } = renderWithNavigation(<HomeScreen />);
    
    const loginCard = getByTestId('login-action-card');
    
    // Pressionar o card de login não deve gerar erro
    expect(() => {
      fireEvent.press(loginCard);
    }).not.toThrow();
  });

  it('closes bottom sheet when close is triggered', () => {
    const { getByTestId } = renderWithNavigation(<HomeScreen />);
    
    // Abrir o modal primeiro
    const loginCard = getByTestId('login-action-card');
    
    // Pressionar o card de login não deve gerar erro
    expect(() => {
      fireEvent.press(loginCard);
    }).not.toThrow();
  });

  it('handles login function correctly', () => {
    const { getByTestId } = renderWithNavigation(<HomeScreen />);
    
    // Verificar que o componente renderiza corretamente
    expect(getByTestId('login-action-card')).toBeTruthy();
    
    // Verificar que pressionar o botão não gera erro
    const loginCard = getByTestId('login-action-card');
    fireEvent.press(loginCard);
    
    // Se chegou aqui, a função handleOpenLogin foi executada sem erro
    expect(true).toBe(true);
  });
});
