import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { LoanHeader } from './LoanHeader';

// Mock do Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color, testID }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID || `icon-${name}`}>
        <Text>{name}</Text>
      </View>
    );
  },
}));

// Mock dos estilos
jest.mock('../../LoanConfiguration.styles', () => ({
  styles: {
    header: { flexDirection: 'row', padding: 16 },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
  },
}));

describe('LoanHeader', () => {
  const mockOnGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName="Consignado INSS"
      />
    );
    
    expect(screen.getByText('Consignado INSS')).toBeTruthy();
    expect(screen.getByTestId('icon-chevron-back')).toBeTruthy();
    expect(screen.getByText('chevron-back')).toBeTruthy();
  });

  it('should call onGoBack when back button is pressed', () => {
    render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName="Test Product"
      />
    );
    
    const backButton = screen.getByTestId('icon-chevron-back').parent;
    fireEvent.press(backButton);
    
    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  it('should render with different product names', () => {
    const { rerender } = render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName="Habitação SAC"
      />
    );
    
    expect(screen.getByText('Habitação SAC')).toBeTruthy();
    
    rerender(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName="Crédito Consignado FUNCEF"
      />
    );
    
    expect(screen.getByText('Crédito Consignado FUNCEF')).toBeTruthy();
  });

  it('should render with empty product name', () => {
    render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName=""
      />
    );
    
    expect(screen.getByText('')).toBeTruthy();
    expect(screen.getByTestId('icon-chevron-back')).toBeTruthy();
  });

  it('should render with long product name', () => {
    const longName = 'Financiamento Habitacional Sistema de Amortização Constante para Funcionários Públicos Federais';
    
    render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName={longName}
      />
    );
    
    expect(screen.getByText(longName)).toBeTruthy();
  });

  it('should handle special characters in product name', () => {
    render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName="Crédito & Financiamento - Opção Nº 1"
      />
    );
    
    expect(screen.getByText('Crédito & Financiamento - Opção Nº 1')).toBeTruthy();
  });

  it('should render back button with correct icon', () => {
    render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName="Test"
      />
    );
    
    const icon = screen.getByTestId('icon-chevron-back');
    expect(icon).toBeTruthy();
    expect(screen.getByText('chevron-back')).toBeTruthy();
  });

  it('should handle multiple rapid back button presses', () => {
    render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName="Test"
      />
    );
    
    const backButton = screen.getByTestId('icon-chevron-back').parent;
    
    fireEvent.press(backButton);
    fireEvent.press(backButton);
    fireEvent.press(backButton);
    
    expect(mockOnGoBack).toHaveBeenCalledTimes(3);
  });

  it('should render with all supported product types', () => {
    const productTypes = [
      'Consignado INSS',
      'Consignado FUNCEF',
      'Consignado Militar',
      'Habitação SAC',
      'Habitação PRICE',
      'Financiamento Estudantil'
    ];

    productTypes.forEach(productName => {
      const { rerender } = render(
        <LoanHeader
          onGoBack={mockOnGoBack}
          productName={productName}
        />
      );
      
      expect(screen.getByText(productName)).toBeTruthy();
      
      rerender(<></>);
    });
  });

  it('should maintain accessibility with back button', () => {
    render(
      <LoanHeader
        onGoBack={mockOnGoBack}
        productName="Accessibility Test"
      />
    );
    
    const backButton = screen.getByTestId('icon-chevron-back').parent;
    expect(backButton).toBeTruthy();
    
    // Simula navegação por teclado/screen reader
    fireEvent.press(backButton);
    expect(mockOnGoBack).toHaveBeenCalled();
  });
});
