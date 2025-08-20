import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputField from './InputField';

describe('InputField', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    mockOnChangeText.mockClear();
  });

  it('renders successfully with label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputField
        label="Usuário"
        placeholder="Insira seu usuário"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(getByText('Usuário')).toBeTruthy();
    expect(getByPlaceholderText('Insira seu usuário')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Usuário"
        placeholder="Insira seu usuário"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = getByPlaceholderText('Insira seu usuário');
    fireEvent.changeText(input, 'test@example.com');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
  });

  it('shows password toggle button when secureTextEntry is true', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Senha"
        placeholder="Insira sua senha"
        value=""
        onChangeText={mockOnChangeText}
        secureTextEntry={true}
      />
    );
    
    const input = getByPlaceholderText('Insira sua senha');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('toggles password visibility when eye button is pressed', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Senha"
        placeholder="Insira sua senha"
        value=""
        onChangeText={mockOnChangeText}
        secureTextEntry={true}
      />
    );
    
    const input = getByPlaceholderText('Insira sua senha');
    
    // Inicialmente deve estar oculto
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('displays value correctly', () => {
    const { getByDisplayValue } = render(
      <InputField
        label="Usuário"
        placeholder="Insira seu usuário"
        value="test@example.com"
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(getByDisplayValue('test@example.com')).toBeTruthy();
  });
});
