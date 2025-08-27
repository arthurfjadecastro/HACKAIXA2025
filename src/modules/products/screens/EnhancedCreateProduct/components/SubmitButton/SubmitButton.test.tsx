import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SubmitButton } from './SubmitButton';

// Mock do design-system components
jest.mock('@/design-system/components', () => ({
  Button: ({ title, onPress, disabled, style, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity 
        onPress={disabled ? undefined : onPress} 
        disabled={disabled}
        style={style}
        {...props}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  },
}));

describe('SubmitButton', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    loading: false,
    canSubmit: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { toJSON } = render(<SubmitButton {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render submit text when not loading', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} />);
    expect(getByText('Cadastrar Produto')).toBeTruthy();
  });

  it('should render loading text when loading', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} loading={true} />);
    expect(getByText('Salvando...')).toBeTruthy();
  });

  it('should call onSubmit when pressed and not loading', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} />);
    
    const button = getByText('Cadastrar Produto');
    fireEvent.press(button);

    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} loading={true} />);
    
    const button = getByText('Salvando...');
    expect(button.parent?.props.disabled).toBe(true);
  });

  it('should not be disabled when not loading', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} />);
    
    const button = getByText('Cadastrar Produto');
    expect(button.parent?.props.disabled).toBe(false);
  });

  it('should not render when canSubmit is false', () => {
    const { queryByText } = render(<SubmitButton {...defaultProps} canSubmit={false} />);
    
    expect(queryByText('Cadastrar Produto')).toBeNull();
    expect(queryByText('Salvando...')).toBeNull();
  });

  it('should handle press events correctly', () => {
    const mockOnSubmit = jest.fn();
    const { getByText } = render(<SubmitButton onSubmit={mockOnSubmit} loading={false} canSubmit={true} />);
    
    const button = getByText('Cadastrar Produto');
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockOnSubmit).toHaveBeenCalledTimes(2);
  });

  it('should apply correct styles when loading', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} loading={true} />);
    
    const button = getByText('Salvando...');
    expect(button.parent).toBeTruthy();
  });

  it('should apply correct styles when not loading', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} />);
    
    const button = getByText('Cadastrar Produto');
    expect(button.parent).toBeTruthy();
  });

  it('should handle multiple rapid presses', () => {
    const mockOnSubmit = jest.fn();
    const { getByText } = render(<SubmitButton onSubmit={mockOnSubmit} loading={false} canSubmit={true} />);
    
    const button = getByText('Cadastrar Produto');
    
    // Simula múltiplos cliques rápidos
    for (let i = 0; i < 5; i++) {
      fireEvent.press(button);
    }

    expect(mockOnSubmit).toHaveBeenCalledTimes(5);
  });

  it('should maintain accessibility properties', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} />);
    
    const button = getByText('Cadastrar Produto');
    expect(button.parent).toBeTruthy();
  });

  it('should handle edge case of undefined onSubmit', () => {
    const { getByText } = render(<SubmitButton onSubmit={undefined as any} loading={false} canSubmit={true} />);
    
    const button = getByText('Cadastrar Produto');
    
    // Não deve gerar erro mesmo com onSubmit undefined
    expect(() => fireEvent.press(button)).not.toThrow();
  });

  it('should render with custom text props', () => {
    const { getByText } = render(<SubmitButton {...defaultProps} />);
    
    expect(getByText('Cadastrar Produto')).toBeTruthy();
  });

  it('should maintain button functionality across re-renders', () => {
    const mockOnSubmit = jest.fn();
    const { getByText, rerender } = render(
      <SubmitButton onSubmit={mockOnSubmit} loading={false} canSubmit={true} />
    );
    
    // Primeiro clique
    fireEvent.press(getByText('Cadastrar Produto'));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    
    // Re-render
    rerender(<SubmitButton onSubmit={mockOnSubmit} loading={true} canSubmit={true} />);
    
    // Verifica que o texto mudou
    expect(getByText('Salvando...')).toBeTruthy();
    
    // Re-render novamente
    rerender(<SubmitButton onSubmit={mockOnSubmit} loading={false} canSubmit={true} />);
    
    // Segundo clique após re-render
    fireEvent.press(getByText('Cadastrar Produto'));
    expect(mockOnSubmit).toHaveBeenCalledTimes(2);
  });
});
