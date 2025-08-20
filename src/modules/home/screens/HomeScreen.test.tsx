import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithNavigation } from '@/utils/test-utils';
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
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

  it('can press login action card', () => {
    const { getByTestId } = renderWithNavigation(<HomeScreen />);
    
    // Verificar se o elemento é pressável
    expect(() => {
      fireEvent.press(getByTestId('login-action-card'));
    }).not.toThrow();
  });
});
