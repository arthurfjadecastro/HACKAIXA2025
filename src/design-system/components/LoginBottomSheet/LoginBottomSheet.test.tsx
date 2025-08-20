import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithNavigation } from '@/utils/test-utils';
import LoginBottomSheet from './LoginBottomSheet';

describe('LoginBottomSheet', () => {
  const mockOnClose = jest.fn();
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnLogin.mockClear();
  });

  it('renders successfully when visible', () => {
    const { getAllByText, getByPlaceholderText } = renderWithNavigation(
      <LoginBottomSheet
        visible={true}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    );
    
    // Verifica se o título está presente
    const entrarTitles = getAllByText('Entrar');
    expect(entrarTitles.length).toBeGreaterThan(0);
    
    expect(getByPlaceholderText('Insira seu usuário')).toBeTruthy();
    expect(getByPlaceholderText('Insira sua senha')).toBeTruthy();
  });

  it('disables login button when form is invalid', () => {
    const { getByTestId } = renderWithNavigation(
      <LoginBottomSheet
        visible={true}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    );
    
    const loginButton = getByTestId('login-button');
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
  });

  it('enables login button when both fields are filled', () => {
    const { getByPlaceholderText, getByTestId } = renderWithNavigation(
      <LoginBottomSheet
        visible={true}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    );
    
    const usernameInput = getByPlaceholderText('Insira seu usuário');
    const passwordInput = getByPlaceholderText('Insira sua senha');
    
    fireEvent.changeText(usernameInput, 'user@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    const loginButton = getByTestId('login-button');
    expect(loginButton.props.accessibilityState.disabled).toBe(false);
  });

  it('calls onLogin when login button is pressed with valid form', () => {
    const { getByPlaceholderText, getByTestId } = renderWithNavigation(
      <LoginBottomSheet
        visible={true}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    );
    
    const usernameInput = getByPlaceholderText('Insira seu usuário');
    const passwordInput = getByPlaceholderText('Insira sua senha');
    
    fireEvent.changeText(usernameInput, 'user@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);
    
    expect(mockOnLogin).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  // Teste de reset será implementado posteriormente
  // devido à complexidade com renderWithNavigation
});
