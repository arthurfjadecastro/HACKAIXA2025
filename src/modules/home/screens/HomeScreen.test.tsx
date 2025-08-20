import React from 'react';
import { act } from '@testing-library/react-native';
import { renderWithNavigation } from '@/utils/test-utils';
import HomeScreen from './HomeScreen';

// Mock do setTimeout para os testes
jest.useFakeTimers();

describe('HomeScreen', () => {
  afterEach(() => {
    jest.clearAllTimers();
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

  it('shows login bottom sheet after 1 second', async () => {
    const { queryByPlaceholderText } = renderWithNavigation(<HomeScreen />);
    
    // Inicialmente o BottomSheet não deve estar visível
    expect(queryByPlaceholderText('Insira seu usuário')).toBeFalsy();
    
    // Avançar o timer em 1 segundo usando act
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    
    // Agora o BottomSheet deve estar visível
    expect(queryByPlaceholderText('Insira seu usuário')).toBeTruthy();
    expect(queryByPlaceholderText('Insira sua senha')).toBeTruthy();
  });
});
