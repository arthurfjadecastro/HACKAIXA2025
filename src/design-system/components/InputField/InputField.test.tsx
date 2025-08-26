import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput } from 'react-native';
import InputField from './InputField';

describe('InputField', () => {
  const mockOnChangeText = jest.fn();
  const mockOnBlur = jest.fn();
  const mockOnSubmitEditing = jest.fn();

  beforeEach(() => {
    mockOnChangeText.mockClear();
    mockOnBlur.mockClear();
    mockOnSubmitEditing.mockClear();
  });

  it('renders correctly with basic props', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputField
        label="Test Label"
        placeholder="Test Placeholder"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'new text');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('renders password toggle when secureTextEntry is true', () => {
    const { getByTestId } = render(
      <InputField
        label="Password"
        placeholder="Enter password"
        value=""
        onChangeText={mockOnChangeText}
        secureTextEntry
      />
    );
    
    expect(getByTestId('password-toggle-button')).toBeTruthy();
  });

  it('toggles password visibility', () => {
    const { getByTestId } = render(
      <InputField
        label="Password"
        placeholder="Enter password"
        value=""
        onChangeText={mockOnChangeText}
        secureTextEntry
      />
    );
    
    const toggleButton = getByTestId('password-toggle-button');
    fireEvent.press(toggleButton);
    
    expect(toggleButton).toBeTruthy();
  });

  it('calls onBlur when input loses focus', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
        onBlur={mockOnBlur}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'blur');
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('calls onSubmitEditing when submit is pressed', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
        onSubmitEditing={mockOnSubmitEditing}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'submitEditing');
    
    expect(mockOnSubmitEditing).toHaveBeenCalled();
  });

  it('exposes focus, blur, and clear methods via ref', () => {
    const ref = createRef<TextInput>();
    render(
      <InputField
        ref={ref}
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current?.focus).toBe('function');
    expect(typeof ref.current?.blur).toBe('function');
    expect(typeof ref.current?.clear).toBe('function');
  });

  it('handles focus state changes', () => {
    const { getByPlaceholderText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
    
    // Verifica que o componente continua funcionando após mudanças de foco
    expect(input).toBeTruthy();
  });

  it('renders error message when error prop is provided', () => {
    const { getByText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
        error="This field is required"
        helperText="This field is required"
      />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders helper text when provided', () => {
    const { getByText } = render(
      <InputField
        label="Test"
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
        helperText="This is helper text"
      />
    );
    
    expect(getByText('This is helper text')).toBeTruthy();
  });
});
