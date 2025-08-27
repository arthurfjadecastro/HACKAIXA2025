import React from 'react';
import { render } from '@testing-library/react-native';
import CreateProduct from './CreateProduct';

// Mock do hook
jest.mock('./hooks/useCreateProductFormSimple', () => ({
  useCreateProductForm: jest.fn(() => ({
    formData: { name: '', interestRate: '', maxTerm: '', normative: '' },
    errors: {},
    isLoading: false,
    isFormValid: false,
    updateField: jest.fn(),
    handleBlur: jest.fn(),
    handleSubmit: jest.fn(),
    scrollViewRef: { current: null },
  })),
}));

// Mock dos componentes
jest.mock('./components', () => ({
  CreateProductHeader: jest.fn(() => null),
  CreateProductForm: jest.fn(() => null),
  CreateProductFooter: jest.fn(() => null),
}));

describe('CreateProduct', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<CreateProduct />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders all main components', () => {
    render(<CreateProduct />);
    
    const { CreateProductHeader, CreateProductForm, CreateProductFooter } = require('./components');
    
    expect(CreateProductHeader).toHaveBeenCalled();
    expect(CreateProductForm).toHaveBeenCalled();
    expect(CreateProductFooter).toHaveBeenCalled();
  });

  it('passes correct props to CreateProductForm', () => {
    render(<CreateProduct />);
    
    const { CreateProductForm } = require('./components');
    const lastCall = CreateProductForm.mock.calls[CreateProductForm.mock.calls.length - 1];
    
    expect(lastCall[0]).toEqual(
      expect.objectContaining({
        formData: expect.any(Object),
        updateField: expect.any(Function),
      })
    );
    
    // Verificar que as props específicas estão presentes
    expect(lastCall[0]).toHaveProperty('isConvenioAlreadyRegistered');
    expect(lastCall[0]).toHaveProperty('isHabitacaoAlreadyRegistered');
  });

  it('passes correct props to CreateProductFooter', () => {
    render(<CreateProduct />);
    
    const { CreateProductFooter } = require('./components');
    const lastCall = CreateProductFooter.mock.calls[CreateProductFooter.mock.calls.length - 1];
    
    expect(lastCall[0]).toEqual(
      expect.objectContaining({
        isLoading: expect.any(Boolean),
        isFormValid: expect.any(Boolean),
        onSubmit: expect.any(Function),
      })
    );
  });
});
