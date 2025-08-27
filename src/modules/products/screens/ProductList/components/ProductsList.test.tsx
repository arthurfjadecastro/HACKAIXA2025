import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import { ProductsList } from './ProductsList';

// Mock dos módulos externos
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Icon',
}));

// Mock do sistema de design
jest.mock('../../../../../design-system/components', () => ({
  Card: ({ children }: any) => children,
}));

jest.mock('../../../../../design-system/tokens', () => ({
  colors: {
    text: { 
      primary: '#12161C',
      secondary: '#666666',
      disabled: '#999999',
      inverse: '#FFFFFF',
      hint: 'rgba(18, 22, 28, 0.6)'
    },
    primary: { 
      main: '#005CA9',
      light: '#0066CC',
      dark: '#004A8A',
      contrast: '#FFFFFF'
    },
    background: { 
      primary: '#F4F8FB',
      secondary: '#FFFFFF',
      card: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    border: { 
      light: '#EEEEEE',
      medium: '#DDDDDD',
      dark: '#CCCCCC'
    },
    status: {
      success: '#00C851',
      warning: '#FF8800',
      error: '#FF4444',
      info: '#33B5E5'
    }
  },
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24
  },
  typography: {
    heading: { h3: { fontSize: 18, fontWeight: '600' } },
    body: { medium: { fontSize: 14, fontWeight: '400' } }
  }
}));

// Mock dos tipos
jest.mock('../../../../../services/products/types', () => ({
  Product: {},
}));

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

describe('ProductsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  it('should render empty list when no products provided', () => {
    const { queryByText } = render(<ProductsList products={[]} />);
    expect(queryByText('Empréstimo')).toBeNull();
  });

  it('should render product list when products provided', () => {
    const products = [
      {
        id: '1',
        name: 'Empréstimo Consignado',
        juros: 2.5,
        prazoMaximo: 72,
        normativo: 'CO055',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    expect(getByText('Empréstimo Consignado')).toBeTruthy();
    expect(getByText('Consignado')).toBeTruthy();
  });

  it('should handle product card press for active products', () => {
    const products = [
      {
        id: '1',
        name: 'Empréstimo Consignado',
        juros: 2.5,
        prazoMaximo: 72,
        normativo: 'CO055',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    
    fireEvent.press(getByText('Empréstimo Consignado'));
    
    expect(mockNavigate).toHaveBeenCalledWith('ProductSimulator', { productId: '1' });
  });

  it('should not navigate for inactive products', () => {
    const products = [
      {
        id: '1',
        name: 'Empréstimo Inativo',
        juros: 2.5,
        prazoMaximo: 72,
        normativo: 'CO055',
        active: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    
    fireEvent.press(getByText('Empréstimo Inativo'));
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should display correct category for consignado products', () => {
    const products = [
      {
        id: '1',
        name: 'Empréstimo Consignado INSS',
        juros: 2.5,
        prazoMaximo: 72,
        normativo: 'CO055',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    expect(getByText('Consignado')).toBeTruthy();
  });

  it('should display correct category for habitacao products', () => {
    const products = [
      {
        id: '1',
        name: 'Financiamento Habitação',
        juros: 8.5,
        prazoMaximo: 420,
        normativo: 'HA100',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    expect(getByText('Habitação')).toBeTruthy();
  });

  it('should display correct category for custom products', () => {
    const products = [
      {
        id: '1',
        name: 'Produto Personalizado',
        juros: 5.0,
        prazoMaximo: 60,
        normativo: 'CU001',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    expect(getByText('Produto criado pelo usuário')).toBeTruthy();
  });

  it('should display product information correctly', () => {
    const products = [
      {
        id: '1',
        name: 'Empréstimo Consignado',
        juros: 2.5,
        prazoMaximo: 72,
        normativo: 'CO055',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    expect(getByText(/Juros: 2.5% a\.m\./)).toBeTruthy();
    expect(getByText(/Prazo máximo: 72 meses/)).toBeTruthy();
    expect(getByText(/Normativo: CO055/)).toBeTruthy();
  });

  it('should handle multiple products', () => {
    const products = [
      {
        id: '1',
        name: 'Empréstimo Consignado',
        juros: 2.5,
        prazoMaximo: 72,
        normativo: 'CO055',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Financiamento Habitacional',
        juros: 8.5,
        prazoMaximo: 420,
        normativo: 'HA100',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    expect(getByText('Empréstimo Consignado')).toBeTruthy();
    expect(getByText('Financiamento Habitacional')).toBeTruthy();
  });

  it('should handle edge case with zero interest rate', () => {
    const products = [
      {
        id: '1',
        name: 'Produto Sem Taxa',
        juros: 0,
        prazoMaximo: 12,
        normativo: 'SP001',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    expect(getByText(/Juros: 0% a\.m\./)).toBeTruthy();
  });

  it('should handle products without normativo', () => {
    const products = [
      {
        id: '1',
        name: 'Produto Sem Normativo',
        juros: 2.5,
        prazoMaximo: 72,
        normativo: '',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { queryByText } = render(<ProductsList products={products} />);
    expect(queryByText(/Normativo:/)).toBeNull();
  });

  it('should display product with complete information', () => {
    const products = [
      {
        id: '1',
        name: 'Empréstimo Completo',
        juros: 1.5,
        prazoMaximo: 48,
        normativo: 'EC001',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const { getByText } = render(<ProductsList products={products} />);
    expect(getByText('Empréstimo Completo')).toBeTruthy();
    expect(getByText(/Juros: 1.5% a\.m\./)).toBeTruthy();
    expect(getByText(/Prazo máximo: 48 meses/)).toBeTruthy();
    expect(getByText(/Normativo: EC001/)).toBeTruthy();
  });
});
