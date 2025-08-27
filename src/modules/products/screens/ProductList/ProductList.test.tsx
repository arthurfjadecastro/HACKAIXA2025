import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TestWrapper } from '@/utils/test-utils';
import ProductList from './ProductList';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('ProductList', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders screen components', () => {
    const { getByText } = render(
      <TestWrapper>
        <ProductList />
      </TestWrapper>
    );
    
    expect(getByText('Olá, Arthur de Castro')).toBeTruthy();
    expect(getByText('Cliente Singular')).toBeTruthy();
    expect(getByText('Escolha um produto e simule seu empréstimo de forma rápida e clara.')).toBeTruthy();
    expect(getByText('Cadastrar produto')).toBeTruthy();
  });

  it('navigates to RegisterProducts when button is pressed', () => {
    const { getByText } = render(
      <TestWrapper>
        <ProductList />
      </TestWrapper>
    );
    
    const button = getByText('Cadastrar produto');
    fireEvent.press(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('RegisterProducts');
  });

  it('renders main content and navigation', () => {
    const { getByText } = render(
      <TestWrapper>
        <ProductList />
      </TestWrapper>
    );
    
    expect(getByText('Escolha um produto e simule seu empréstimo de forma rápida e clara.')).toBeTruthy();
    expect(getByText('Cadastrar produto')).toBeTruthy();
  });
});
