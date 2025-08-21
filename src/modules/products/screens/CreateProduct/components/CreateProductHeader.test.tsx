import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { CreateProductHeader } from './CreateProductHeader';

// Mock do react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('CreateProductHeader', () => {
  const mockGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: mockGoBack,
    });
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<CreateProductHeader />);
    
    expect(getByText('Cadastre um novo produto')).toBeTruthy();
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('calls navigation goBack when back button is pressed', () => {
    const { getByTestId } = render(<CreateProductHeader />);
    
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility properties', () => {
    const { getByTestId } = render(<CreateProductHeader />);
    
    const backButton = getByTestId('back-button');
    expect(backButton.props.accessible).toBe(true);
    expect(backButton.props.accessibilityLabel).toBe('Voltar');
    expect(backButton.props.accessibilityRole).toBe('button');
  });
});
