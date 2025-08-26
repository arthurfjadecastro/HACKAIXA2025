import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import { CreateProductForm } from './CreateProductForm';
import { FormData } from '../types';

// Mock do Keyboard
const mockKeyboardDismiss = jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});

describe('CreateProductForm', () => {
  const mockUpdateField = jest.fn();
  const mockHandleBlur = jest.fn();

  const defaultFormData: FormData = {
    categoria: '',
    subtipo: '',
    name: '',
    interestRate: '',
    maxTerm: '',
    normative: '',
  };

  const defaultProps = {
    formData: defaultFormData,
    updateField: mockUpdateField,
    isConvenioAlreadyRegistered: jest.fn(() => false),
    isHabitacaoAlreadyRegistered: jest.fn(() => false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockKeyboardDismiss.mockClear();
  });

  it('renders all input fields correctly', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    expect(getByPlaceholderText('Digite o nome do produto')).toBeTruthy();
    expect(getByPlaceholderText('0,00')).toBeTruthy();
    expect(getByPlaceholderText('12')).toBeTruthy();
    expect(getByPlaceholderText('Digite o normativo')).toBeTruthy();
  });

  it('calls updateField when name input changes', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    const nameInput = getByPlaceholderText('Digite o nome do produto');
    fireEvent.changeText(nameInput, 'Novo Produto');
    
    expect(mockUpdateField).toHaveBeenCalledWith('name', 'Novo Produto');
  });

  it('calls updateField when interest rate input changes', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    const interestRateInput = getByPlaceholderText('0,00');
    fireEvent.changeText(interestRateInput, '5.5');
    
    expect(mockUpdateField).toHaveBeenCalledWith('interestRate', '5.5');
  });

  it('calls updateField when max term input changes', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    const maxTermInput = getByPlaceholderText('12');
    fireEvent.changeText(maxTermInput, '24');
    
    expect(mockUpdateField).toHaveBeenCalledWith('maxTerm', '24');
  });

  it('calls updateField when normative input changes', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    const normativeInput = getByPlaceholderText('Digite o normativo');
    fireEvent.changeText(normativeInput, 'Normativo teste');
    
    expect(mockUpdateField).toHaveBeenCalledWith('normative', 'Normativo teste');
  });

  it('calls handleBlur when name input loses focus', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    const nameInput = getByPlaceholderText('Digite o nome do produto');
    fireEvent(nameInput, 'blur');
    
    expect(mockHandleBlur).toHaveBeenCalledWith('name');
  });

  it('displays form data values', () => {
    const formDataWithValues: FormData = {
      categoria: 'OUTRO',
      subtipo: 'N/A',
      name: 'Produto Teste',
      interestRate: '5.5',
      maxTerm: '12',
      normative: 'Normativo Teste',
    };

    const { getByDisplayValue } = render(
      <CreateProductForm {...defaultProps} formData={formDataWithValues} />
    );
    
    expect(getByDisplayValue('Produto Teste')).toBeTruthy();
    expect(getByDisplayValue('5.5')).toBeTruthy();
    expect(getByDisplayValue('12')).toBeTruthy();
    expect(getByDisplayValue('Normativo Teste')).toBeTruthy();
  });

  it('calls updateField when form fields change', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    // Test all blur handlers
    fireEvent(getByPlaceholderText('Digite o nome do produto'), 'blur');
    expect(mockHandleBlur).toHaveBeenCalledWith('name');
    
    fireEvent(getByPlaceholderText('0,00'), 'blur');
    expect(mockHandleBlur).toHaveBeenCalledWith('interestRate');
    
    fireEvent(getByPlaceholderText('12'), 'blur');
    expect(mockHandleBlur).toHaveBeenCalledWith('maxTerm');
    
    fireEvent(getByPlaceholderText('Digite o normativo'), 'blur');
    expect(mockHandleBlur).toHaveBeenCalledWith('normative');
  });

  it('calls Keyboard.dismiss when normative field submits', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    const normativeInput = getByPlaceholderText('Digite o normativo');
    fireEvent(normativeInput, 'submitEditing');
    
    expect(mockKeyboardDismiss).toHaveBeenCalled();
  });

  it('renders with correct testIDs', () => {
    const { getByTestId } = render(<CreateProductForm {...defaultProps} />);
    
    expect(getByTestId('name-input')).toBeTruthy();
    expect(getByTestId('interest-rate-input')).toBeTruthy();
    expect(getByTestId('max-term-input')).toBeTruthy();
    expect(getByTestId('normative-input')).toBeTruthy();
  });
});
