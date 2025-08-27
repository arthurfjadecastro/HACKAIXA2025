import React from 'react';
import LoanConfiguration from './LoanConfiguration';

// Mock das dependências
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: { productId: 'test-product', amount: '50000' }
  }),
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn()
  })
}));

jest.mock('../../hooks', () => ({
  useProducts: () => ({
    products: [{
      id: 'test-product',
      nome: 'Test Product',
      categoria: 'consignado'
    }],
    loading: false
  })
}));

jest.mock('@/services/products/data', () => ({
  default: {
    getInstance: jest.fn(() => ({
      getProduct: jest.fn(() => Promise.resolve({
        id: 'test-product',
        nome: 'Test Product',
        categoria: 'consignado'
      }))
    }))
  }
}));

jest.mock('./hooks', () => ({
  useLoanCalculation: () => ({
    amount: 50000,
    months: 24,
    monthlyPayment: 2500,
    totalAmount: 60000,
    totalInterest: 10000,
    setAmount: jest.fn(),
    setMonths: jest.fn(),
    updateCalculation: jest.fn()
  })
}));

describe('LoanConfiguration', () => {
  it('should export LoanConfiguration as default', () => {
    expect(LoanConfiguration).toBeDefined();
    expect(typeof LoanConfiguration).toBe('function');
  });

  it('should be a valid React component', () => {
    expect(React.isValidElement(<LoanConfiguration />)).toBe(true);
  });
});