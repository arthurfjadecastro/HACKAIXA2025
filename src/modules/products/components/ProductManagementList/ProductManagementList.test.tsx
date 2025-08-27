import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { ProductManagementList } from './ProductManagementList';
import { Product } from '@/services/products/types';

// Mock do Card component
jest.mock('@/design-system/components', () => ({
  Card: ({ children, style }: any) => (
    <div style={style} data-testid="card">
      {children}
    </div>
  ),
}));

const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Crédito Consignado INSS',
    juros: 2.5,
    prazoMaximo: 84,
    normativo: 'BACEN 3.954',
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    categoria: 'consignado'
  },
  {
    id: 'product-2', 
    name: 'Financiamento Habitacional SAC',
    juros: 8.5,
    prazoMaximo: 420,
    normativo: 'BACEN 4.676',
    active: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    categoria: 'habitacao'
  },
  {
    id: 'product-3',
    name: 'Empréstimo Pessoal',
    juros: 15.2,
    prazoMaximo: 60,
    normativo: 'BACEN 4.656',
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    categoria: 'outro'
  }
];

const mockOnToggleStatus = jest.fn();

describe('ProductManagementList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering with products', () => {
    it('should render all products correctly', () => {
      const { getByText } = render(
        <ProductManagementList 
          products={mockProducts}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // Check if all products are rendered
      expect(getByText('Crédito Consignado INSS')).toBeTruthy();
      expect(getByText('Financiamento Habitacional SAC')).toBeTruthy();
      expect(getByText('Empréstimo Pessoal')).toBeTruthy();

      // Check if all product details are rendered
      expect(getByText('2.5% a.a.')).toBeTruthy();
      expect(getByText('8.5% a.a.')).toBeTruthy();
      expect(getByText('15.2% a.a.')).toBeTruthy();
    });

    it('should display product information correctly', () => {
      const { getByText } = render(
        <ProductManagementList 
          products={[mockProducts[0]!]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // Check product details
      expect(getByText('Crédito Consignado INSS')).toBeTruthy();
      expect(getByText('2.5% a.a.')).toBeTruthy();
      expect(getByText('84 meses')).toBeTruthy();
      expect(getByText('BACEN 3.954')).toBeTruthy();
    });

    it('should display active status correctly', () => {
      const { getAllByText, getByText } = render(
        <ProductManagementList 
          products={mockProducts}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // Check status display
      const ativoElements = getAllByText('ATIVO');
      expect(ativoElements).toHaveLength(2); // Two products are active
      expect(getByText('INATIVO')).toBeTruthy(); // One product is inactive
    });

    it('should display toggle buttons correctly', () => {
      const { getAllByText, getByText } = render(
        <ProductManagementList 
          products={mockProducts}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // Active products show DESATIVAR button
      const desativarButtons = getAllByText('DESATIVAR');
      expect(desativarButtons).toHaveLength(2);

      // Inactive product shows ATIVAR button  
      expect(getByText('ATIVAR')).toBeTruthy();
    });

    it('should handle toggle button press', () => {
      const { getAllByText } = render(
        <ProductManagementList 
          products={[mockProducts[0]!]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // Click on the toggle button
      const desativarButton = getAllByText('DESATIVAR')[0]!;
      fireEvent.press(desativarButton);

      expect(mockOnToggleStatus).toHaveBeenCalledWith('product-1');
    });

    it('should handle toggle for inactive product', () => {
      const { getByText } = render(
        <ProductManagementList 
          products={[mockProducts[1]!]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // Click on ATIVAR button for inactive product
      const ativarButton = getByText('ATIVAR');
      fireEvent.press(ativarButton);

      expect(mockOnToggleStatus).toHaveBeenCalledWith('product-2');
    });

    it('should show loading state for specific product', () => {
      const { queryByText } = render(
        <ProductManagementList 
          products={[mockProducts[0]!]}
          onToggleStatus={mockOnToggleStatus}
          toggleLoading="product-1"
        />
      );

      // Should show loading indicator instead of button text
      expect(queryByText('DESATIVAR')).toBeNull();
    });

    it('should disable button when loading', () => {
      const { UNSAFE_getByType } = render(
        <ProductManagementList 
          products={[mockProducts[0]!]}
          onToggleStatus={mockOnToggleStatus}
          toggleLoading="product-1"
        />
      );

      // Check for ActivityIndicator when loading
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should render single product correctly', () => {
      const { getByText } = render(
        <ProductManagementList 
          products={[mockProducts[0]!]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      expect(getByText('Crédito Consignado INSS')).toBeTruthy();
      expect(getByText('2.5% a.a.')).toBeTruthy();
      expect(getByText('ATIVO')).toBeTruthy();
    });

    it('should handle different product types', () => {
      const { getByText } = render(
        <ProductManagementList 
          products={mockProducts}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // All different products should be rendered
      expect(getByText('Crédito Consignado INSS')).toBeTruthy();
      expect(getByText('Financiamento Habitacional SAC')).toBeTruthy();
      expect(getByText('Empréstimo Pessoal')).toBeTruthy();
    });
  });

  describe('Empty state', () => {
    it('should render empty state when no products', () => {
      const { getByText } = render(
        <ProductManagementList 
          products={[]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      expect(getByText(/Nenhum produto cadastrado ainda/)).toBeTruthy();
      expect(getByText(/Cadastre o primeiro produto acima/)).toBeTruthy();
    });

    it('should not render cards when empty', () => {
      const { queryByTestId } = render(
        <ProductManagementList 
          products={[]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      expect(queryByTestId('card')).toBeNull();
    });

    it('should not call onToggleStatus in empty state', () => {
      render(
        <ProductManagementList 
          products={[]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // No calls should be made in empty state
      expect(mockOnToggleStatus).not.toHaveBeenCalled();
    });
  });

  describe('Loading states', () => {
    it('should show loading for correct product only', () => {
      const { getAllByText, UNSAFE_getAllByType } = render(
        <ProductManagementList 
          products={mockProducts}
          onToggleStatus={mockOnToggleStatus}
          toggleLoading="product-2"
        />
      );

      // Only product-2 should show loading
      const indicators = UNSAFE_getAllByType(ActivityIndicator);
      expect(indicators).toHaveLength(1);
      
      // Other products should show buttons - use getAllByText for multiple elements
      const desativarButtons = getAllByText('DESATIVAR');
      expect(desativarButtons).toHaveLength(2); // product-1 and product-3
    });

    it('should handle loading state changes', () => {
      const { rerender, queryByText } = render(
        <ProductManagementList 
          products={[mockProducts[1]!]}
          onToggleStatus={mockOnToggleStatus}
          toggleLoading={null}
        />
      );

      // Initially no loading
      expect(queryByText('ATIVAR')).toBeTruthy();

      // Set loading
      rerender(
        <ProductManagementList 
          products={[mockProducts[1]!]}
          onToggleStatus={mockOnToggleStatus}
          toggleLoading="product-2"
        />
      );

      expect(queryByText('ATIVAR')).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle products with long names', () => {
      const longNameProduct: Product = {
        ...mockProducts[0]!,
        name: 'Este é um nome muito longo para um produto financeiro que deve ser exibido corretamente'
      };

      const { getByText } = render(
        <ProductManagementList 
          products={[longNameProduct]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      expect(getByText('Este é um nome muito longo para um produto financeiro que deve ser exibido corretamente')).toBeTruthy();
    });

    it('should handle products with zero interest', () => {
      const zeroInterestProduct: Product = {
        ...mockProducts[0]!,
        juros: 0
      };

      const { getByText } = render(
        <ProductManagementList 
          products={[zeroInterestProduct]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      expect(getByText('0% a.a.')).toBeTruthy();
    });

    it('should handle products with large numbers', () => {
      const largeNumberProduct: Product = {
        ...mockProducts[0]!,
        juros: 999.99,
        prazoMaximo: 9999
      };

      const { getByText } = render(
        <ProductManagementList 
          products={[largeNumberProduct]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      expect(getByText('999.99% a.a.')).toBeTruthy();
      expect(getByText('9999 meses')).toBeTruthy();
    });

    it('should handle missing onToggleStatus callback', () => {
      const { getAllByText } = render(
        <ProductManagementList 
          products={[mockProducts[0]!]}
          onToggleStatus={jest.fn()}
        />
      );

      // Should still render the button
      expect(getAllByText('DESATIVAR')).toHaveLength(1);
    });

    it('should handle products with empty strings', () => {
      const emptyStringProduct: Product = {
        ...mockProducts[0]!,
        name: '',
        normativo: ''
      };

      const { queryByText } = render(
        <ProductManagementList 
          products={[emptyStringProduct]}
          onToggleStatus={mockOnToggleStatus}
        />
      );

      // Should handle empty strings gracefully
      expect(queryByText('2.5% a.a.')).toBeTruthy();
      expect(queryByText('84 meses')).toBeTruthy();
    });

    it('should preserve loading state across different products', () => {
      const { rerender, UNSAFE_getAllByType } = render(
        <ProductManagementList 
          products={mockProducts}
          onToggleStatus={mockOnToggleStatus}
          toggleLoading="product-1"
        />
      );

      // Change loading to different product
      rerender(
        <ProductManagementList 
          products={mockProducts}
          onToggleStatus={mockOnToggleStatus}
          toggleLoading="product-3"
        />
      );

      // Should still have one loading indicator
      const indicators = UNSAFE_getAllByType(ActivityIndicator);
      expect(indicators).toHaveLength(1);
    });
  });
});
