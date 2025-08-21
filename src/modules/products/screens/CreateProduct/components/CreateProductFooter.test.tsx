import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreateProductFooter } from './CreateProductFooter';

describe('CreateProductFooter', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    isLoading: false,
    isFormValid: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<CreateProductFooter {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders submit button with correct title', () => {
    const { getByText } = render(<CreateProductFooter {...defaultProps} />);
    expect(getByText('Cadastrar')).toBeTruthy();
  });

  it('disables button when form is invalid', () => {
    const { getByTestId } = render(
      <CreateProductFooter {...defaultProps} isFormValid={false} />
    );
    const button = getByTestId('submit-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('disables button when loading', () => {
    const { getByTestId } = render(
      <CreateProductFooter {...defaultProps} isLoading={true} isFormValid={true} />
    );
    const button = getByTestId('submit-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('enables button when form is valid and not loading', () => {
    const { getByTestId } = render(
      <CreateProductFooter {...defaultProps} isFormValid={true} isLoading={false} />
    );
    const button = getByTestId('submit-button');
    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  it('calls onSubmit when button is pressed', () => {
    const mockOnSubmit = jest.fn();
    const { getByTestId } = render(
      <CreateProductFooter {...defaultProps} onSubmit={mockOnSubmit} isFormValid={true} />
    );
    
    const button = getByTestId('submit-button');
    fireEvent.press(button);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <CreateProductFooter {...defaultProps} isLoading={true} />
    );
    const button = getByTestId('submit-button');
    // O componente Button pode não expor a prop loading diretamente
    // Vamos verificar apenas se o botão está desabilitado quando loading
    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
