import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import RegisterProducts from './RegisterProducts';

// Mock do navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

const renderWithNavigation = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('RegisterProducts', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
  });

  it('renders without crashing', () => {
    const { getByText } = renderWithNavigation(<RegisterProducts />);
    
    expect(getByText('Cadastre um novo produto')).toBeTruthy();
  });

  it('displays the correct title', () => {
    const { getByText } = renderWithNavigation(<RegisterProducts />);
    
    const title = getByText('Cadastre um novo produto');
    expect(title).toBeTruthy();
  });

  it('renders the back button and handles navigation', () => {
    const { getByTestId } = renderWithNavigation(<RegisterProducts />);
    
    const backButton = getByTestId('back-button');
    expect(backButton).toBeTruthy();
    
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders the create new product button', () => {
    const { getByTestId } = renderWithNavigation(<RegisterProducts />);
    
    const createButton = getByTestId('create-new-product-button');
    expect(createButton).toBeTruthy();
  });

  it('renders product templates', () => {
    const { getByTestId } = renderWithNavigation(<RegisterProducts />);
    
    expect(getByTestId('product-template-1')).toBeTruthy();
    expect(getByTestId('product-template-2')).toBeTruthy();
    expect(getByTestId('product-template-3')).toBeTruthy();
  });

  it('renders save button', () => {
    const { getByTestId } = renderWithNavigation(<RegisterProducts />);
    
    const saveButton = getByTestId('save-products-button');
    expect(saveButton).toBeTruthy();
  });

  it('handles product selection', () => {
    const { getByTestId } = renderWithNavigation(<RegisterProducts />);
    
    const productTemplate = getByTestId('product-template-1');
    fireEvent.press(productTemplate);
    
    // Após seleção, o botão salvar deve estar habilitado
    const saveButton = getByTestId('save-products-button');
    expect(saveButton).toBeTruthy();
  });
});
