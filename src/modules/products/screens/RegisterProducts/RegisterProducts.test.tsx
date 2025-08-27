import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TestWrapper } from '@/utils/test-utils';
import RegisterProducts from './RegisterProducts';
import { useProductManagement } from '@/modules/products/hooks/useProductManagement';
import { useDeleteProduct } from '../../hooks';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
}));

// Mock hooks
const mockToggleProductStatus = jest.fn();
const mockDeleteProduct = jest.fn();

jest.mock('@/modules/products/hooks/useProductManagement', () => ({
  useProductManagement: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useDeleteProduct: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockProducts = [
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

describe('RegisterProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useProductManagement as jest.Mock).mockReturnValue({
      products: mockProducts,
      toggleProductStatus: mockToggleProductStatus,
    });
    
    (useDeleteProduct as jest.Mock).mockReturnValue({
      deleteProduct: mockDeleteProduct,
    });
  });

  describe('Header Navigation', () => {
    it('should render header with back button and add button', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getByTestId('back-button')).toBeTruthy();
      expect(getByTestId('add-product-button')).toBeTruthy();
      expect(getByText('Produtos')).toBeTruthy();
    });

    it('should navigate back when back button is pressed', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      fireEvent.press(getByTestId('back-button'));
      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

    it('should navigate to CreateProduct when add button is pressed', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      fireEvent.press(getByTestId('add-product-button'));
      expect(mockNavigate).toHaveBeenCalledWith('CreateProduct');
    });
  });

  describe('Product List Rendering', () => {
    it('should render all products correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getByText('Crédito Consignado INSS')).toBeTruthy();
      expect(getByText('Financiamento Habitacional SAC')).toBeTruthy();
      expect(getByText('Empréstimo Pessoal')).toBeTruthy();
    });

    it('should display product details correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Check juros
      expect(getByText('2.5% a.a.')).toBeTruthy();
      expect(getByText('8.5% a.a.')).toBeTruthy();
      expect(getByText('15.2% a.a.')).toBeTruthy();

      // Check prazo
      expect(getByText('84 meses')).toBeTruthy();
      expect(getByText('420 meses')).toBeTruthy();
      expect(getByText('60 meses')).toBeTruthy();

      // Check normativo
      expect(getByText('BACEN 3.954')).toBeTruthy();
      expect(getByText('BACEN 4.676')).toBeTruthy();
      expect(getByText('BACEN 4.656')).toBeTruthy();
    });

    it('should display correct status badges', () => {
      const { getAllByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      const ativoElements = getAllByText('ATIVO');
      const inativoElements = getAllByText('INATIVO');
      
      expect(ativoElements).toHaveLength(2); // product-1 and product-3
      expect(inativoElements).toHaveLength(1); // product-2
    });

    it('should display detail labels correctly', () => {
      const { getAllByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getAllByText('Juros')).toHaveLength(3);
      expect(getAllByText('Prazo máximo')).toHaveLength(3);
      expect(getAllByText('Normativo')).toHaveLength(3);
    });
  });

  describe('Product Selection', () => {
    it('should select product when clicked', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      fireEvent.press(getByTestId('product-item-product-1'));
      
      // Check if save button appears (indicates selection)
      expect(getByTestId('save-button')).toBeTruthy();
    });

    it('should deselect product when clicked again', () => {
      const { getByTestId, queryByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Select first
      fireEvent.press(getByTestId('product-item-product-1'));
      expect(getByTestId('save-button')).toBeTruthy();

      // Deselect
      fireEvent.press(getByTestId('product-item-product-1'));
      expect(queryByTestId('save-button')).toBeNull();
    });

    it('should allow only one product selection at a time', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Select first product (active)
      fireEvent.press(getByTestId('product-item-product-1'));
      expect(getByText('Inativar Produto')).toBeTruthy();
      
      // Select second product (inactive)
      fireEvent.press(getByTestId('product-item-product-2'));
      expect(getByText('Ativar Produto')).toBeTruthy();
    });

    it('should update button text based on selected product status', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Select active product
      fireEvent.press(getByTestId('product-item-product-1'));
      expect(getByText('Inativar Produto')).toBeTruthy();

      // Select inactive product
      fireEvent.press(getByTestId('product-item-product-2'));
      expect(getByText('Ativar Produto')).toBeTruthy();
    });
  });

  describe('Save Functionality', () => {
    it('should show save button when product is selected', () => {
      const { getByTestId, queryByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Initially no save button
      expect(queryByTestId('save-button')).toBeNull();

      // Select product
      fireEvent.press(getByTestId('product-item-product-1'));
      
      // Save button should appear
      expect(getByTestId('save-button')).toBeTruthy();
    });

    it('should call toggleProductStatus when save button is pressed', async () => {
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Select product
      fireEvent.press(getByTestId('product-item-product-1'));
      
      // Press save button
      fireEvent.press(getByTestId('save-button'));

      await waitFor(() => {
        expect(mockToggleProductStatus).toHaveBeenCalledWith('product-1');
      });
    });

    it('should clear selection after saving', async () => {
      const { getByTestId, queryByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Select product
      fireEvent.press(getByTestId('product-item-product-1'));
      
      // Press save button
      fireEvent.press(getByTestId('save-button'));

      await waitFor(() => {
        // Save button should disappear after save
        expect(queryByTestId('save-button')).toBeNull();
      });
    });

    it('should handle save errors gracefully', async () => {
      mockToggleProductStatus.mockRejectedValueOnce(new Error('Network error'));
      
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Select product
      fireEvent.press(getByTestId('product-item-product-1'));
      
      // Press save button
      fireEvent.press(getByTestId('save-button'));

      await waitFor(() => {
        expect(mockToggleProductStatus).toHaveBeenCalledWith('product-1');
      });

      // Should not throw error and continue functioning
    });

    it('should not call toggle when no product is selected', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // No save button should be present when nothing is selected
      expect(queryByTestId('save-button')).toBeNull();
      expect(mockToggleProductStatus).not.toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      (useProductManagement as jest.Mock).mockReturnValue({
        products: [],
        toggleProductStatus: mockToggleProductStatus,
      });
    });

    it('should show empty state when no products exist', () => {
      const { getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getByText('Nenhum produto cadastrado')).toBeTruthy();
      expect(getByText('Clique no botão + para criar seu primeiro produto')).toBeTruthy();
    });

    it('should not show save button in empty state', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(queryByTestId('save-button')).toBeNull();
    });

    it('should still allow navigation to create product in empty state', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      fireEvent.press(getByTestId('add-product-button'));
      expect(mockNavigate).toHaveBeenCalledWith('CreateProduct');
    });

    it('should show empty icon in empty state', () => {
      const { getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Should render empty state with proper text
      expect(getByText('Nenhum produto cadastrado')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle products with long names', () => {
      const longNameProducts = [{
        ...mockProducts[0],
        name: 'Este é um nome muito longo para um produto financeiro que deve ser exibido corretamente na interface'
      }];

      (useProductManagement as jest.Mock).mockReturnValue({
        products: longNameProducts,
        toggleProductStatus: mockToggleProductStatus,
      });

      const { getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getByText('Este é um nome muito longo para um produto financeiro que deve ser exibido corretamente na interface')).toBeTruthy();
    });

    it('should handle products with zero values', () => {
      const zeroValueProducts = [{
        ...mockProducts[0],
        juros: 0,
        prazoMaximo: 0
      }];

      (useProductManagement as jest.Mock).mockReturnValue({
        products: zeroValueProducts,
        toggleProductStatus: mockToggleProductStatus,
      });

      const { getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getByText('0% a.a.')).toBeTruthy();
      expect(getByText('0 meses')).toBeTruthy();
    });

    it('should handle products with large numbers', () => {
      const largeNumberProducts = [{
        ...mockProducts[0],
        juros: 999.99,
        prazoMaximo: 9999
      }];

      (useProductManagement as jest.Mock).mockReturnValue({
        products: largeNumberProducts,
        toggleProductStatus: mockToggleProductStatus,
      });

      const { getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getByText('999.99% a.a.')).toBeTruthy();
      expect(getByText('9999 meses')).toBeTruthy();
    });

    it('should handle single product correctly', () => {
      (useProductManagement as jest.Mock).mockReturnValue({
        products: [mockProducts[0]],
        toggleProductStatus: mockToggleProductStatus,
      });

      const { getByText, getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getByText('Crédito Consignado INSS')).toBeTruthy();
      expect(getByTestId('product-item-product-1')).toBeTruthy();
    });

    it('should handle rapid selection changes', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Rapid selection changes
      fireEvent.press(getByTestId('product-item-product-1'));
      fireEvent.press(getByTestId('product-item-product-2'));
      fireEvent.press(getByTestId('product-item-product-3'));
      fireEvent.press(getByTestId('product-item-product-1'));

      // Should work without errors - check final state
      expect(getByTestId('save-button')).toBeTruthy();
    });

    it('should preserve component state during interactions', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Select product
      fireEvent.press(getByTestId('product-item-product-1'));
      expect(getByText('Inativar Produto')).toBeTruthy();

      // Navigate back and forth
      fireEvent.press(getByTestId('back-button'));
      fireEvent.press(getByTestId('add-product-button'));

      // Component should still function
      expect(mockGoBack).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('CreateProduct');
    });

    it('should handle products with empty strings', () => {
      const emptyStringProducts = [{
        ...mockProducts[0],
        name: '',
        normativo: ''
      }];

      (useProductManagement as jest.Mock).mockReturnValue({
        products: emptyStringProducts,
        toggleProductStatus: mockToggleProductStatus,
      });

      const { getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Should handle empty strings gracefully
      expect(getByText('2.5% a.a.')).toBeTruthy();
      expect(getByText('84 meses')).toBeTruthy();
    });
  });

  describe('Accessibility and TestIDs', () => {
    it('should have proper testIDs for all interactive elements', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(getByTestId('back-button')).toBeTruthy();
      expect(getByTestId('add-product-button')).toBeTruthy();
      expect(getByTestId('product-item-product-1')).toBeTruthy();
      expect(getByTestId('product-item-product-2')).toBeTruthy();
      expect(getByTestId('product-item-product-3')).toBeTruthy();
    });

    it('should render component structure correctly', () => {
      const { getByText, getByTestId, getAllByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Header elements
      expect(getByText('Produtos')).toBeTruthy();
      expect(getByTestId('back-button')).toBeTruthy();
      expect(getByTestId('add-product-button')).toBeTruthy();

      // Product elements
      expect(getByText('Crédito Consignado INSS')).toBeTruthy();
      expect(getAllByText('Juros')).toHaveLength(3); // Multiple products show juros
      expect(getAllByText('Prazo máximo')).toHaveLength(3); // Multiple products show prazo
      expect(getAllByText('Normativo')).toHaveLength(3); // Multiple products show normativo
    });

    it('should handle button states correctly', () => {
      const { getByTestId, getByText } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Select product to show save button
      fireEvent.press(getByTestId('product-item-product-1'));
      
      const saveButton = getByTestId('save-button');
      expect(saveButton).toBeTruthy();
      expect(getByText('Inativar Produto')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with useProductManagement hook correctly', () => {
      render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(useProductManagement).toHaveBeenCalled();
    });

    it('should integrate with useDeleteProduct hook correctly', () => {
      render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      expect(useDeleteProduct).toHaveBeenCalled();
    });

    it('should handle hook dependencies correctly', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <RegisterProducts />
        </TestWrapper>
      );

      // Component should render without errors when hooks are properly mocked
      expect(getByTestId('back-button')).toBeTruthy();
      expect(getByTestId('add-product-button')).toBeTruthy();
    });
  });
});
