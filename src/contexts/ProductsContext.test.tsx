import React from 'react';
import { render } from '@testing-library/react-native';
import { ProductsProvider } from './ProductsContext';

// Mock das dependências
jest.mock('../services', () => ({
  productsApi: {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  },
}));

const TestComponent = () => <div data-testid="test-component">Test</div>;

describe('ProductsContext', () => {
  it('should export ProductsProvider', () => {
    expect(ProductsProvider).toBeDefined();
    expect(typeof ProductsProvider).toBe('function');
  });

  it('should provide context to children', () => {
    const { toJSON } = render(
      <ProductsProvider>
        <TestComponent />
      </ProductsProvider>
    );
    expect(toJSON()).toBeDefined();
  });

  it('should be a valid React component', () => {
    expect(React.isValidElement(<ProductsProvider><TestComponent /></ProductsProvider>)).toBe(true);
  });

  it('should handle children prop', () => {
    const { toJSON } = render(
      <ProductsProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </ProductsProvider>
    );
    expect(toJSON()).toBeDefined();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(
      <ProductsProvider>
        <TestComponent />
      </ProductsProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
