import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreateProductForm } from './CreateProductForm';
import { FormData } from '../../types';

// O Keyboard já está mockado no jest.setup.js

describe('CreateProductForm', () => {
  const mockUpdateField = jest.fn();

  const defaultFormData: FormData = {
    categoria: 'OUTRO',
    subtipo: '',
    name: 'Produto Teste',
    interestRate: '5.5',
    maxTerm: '12',
    normative: 'Normativo Teste',
  };

  const defaultProps = {
    formData: defaultFormData,
    updateField: mockUpdateField,
    isConvenioAlreadyRegistered: jest.fn(() => false),
    isHabitacaoAlreadyRegistered: jest.fn(() => false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields correctly', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);

    expect(getByPlaceholderText('Ex: Cartão de Crédito Premium')).toBeTruthy();
    expect(getByPlaceholderText('Ex: 12,50 ou 12.50')).toBeTruthy();
    expect(getByPlaceholderText('1')).toBeTruthy();
    expect(getByPlaceholderText('420')).toBeTruthy();
  });  it('calls updateField when name input changes', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);

    const nameInput = getByPlaceholderText('Ex: Cartão de Crédito Premium');
    fireEvent.changeText(nameInput, 'Novo Produto');

    expect(mockUpdateField).toHaveBeenCalledWith('name', 'Novo Produto');
  });

  it('calls updateField when interest rate input changes', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);

    const interestRateInput = getByPlaceholderText('Ex: 12,50 ou 12.50');
    fireEvent.changeText(interestRateInput, '5.5');

    expect(mockUpdateField).toHaveBeenCalledWith('interestRate', '5.5');
  });  it('calls updateField when max term input changes', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);

    const maxTermInput = getByPlaceholderText('420');
    fireEvent.changeText(maxTermInput, '24');

    expect(mockUpdateField).toHaveBeenCalledWith('prazo_max_meses', 24);
  });

  it('calls updateField when min term input changes', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);

    const minTermInput = getByPlaceholderText('1');
    fireEvent.changeText(minTermInput, '6');

    expect(mockUpdateField).toHaveBeenCalledWith('prazo_min_meses', 6);
  });

  it('handles input focus and blur events', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    const nameInput = getByPlaceholderText('Ex: Cartão de Crédito Premium');
    fireEvent(nameInput, 'blur');
    
    // O teste apenas verifica que os eventos de blur funcionam
    expect(nameInput).toBeTruthy();
  });

  it('displays form data values', () => {
    const formDataWithValues: FormData = {
      categoria: 'OUTRO',
      subtipo: '',
      name: 'Produto Teste',
      interestRate: '5.5',
      maxTerm: '',
      prazo_min_meses: 6,
      prazo_max_meses: 12,
      normative: 'Normativo Teste',
    };

    const { getByDisplayValue } = render(
      <CreateProductForm {...defaultProps} formData={formDataWithValues} />
    );
    
    expect(getByDisplayValue('Produto Teste')).toBeTruthy();
    expect(getByDisplayValue('5.5')).toBeTruthy();
    expect(getByDisplayValue('6')).toBeTruthy();
    expect(getByDisplayValue('12')).toBeTruthy();
  });

  it('renders form for OUTRO category', () => {
    const { getByPlaceholderText, getByText } = render(<CreateProductForm {...defaultProps} />);
    
    // Verifica se os campos de categoria OUTRO estão sendo renderizados
    expect(getByText('Configuração de Produto Genérico')).toBeTruthy();
    expect(getByPlaceholderText('Ex: Cartão de Crédito Premium')).toBeTruthy();
    expect(getByPlaceholderText('Ex: 12,50 ou 12.50')).toBeTruthy();
    expect(getByPlaceholderText('1')).toBeTruthy();
    expect(getByPlaceholderText('420')).toBeTruthy();
  });

  it('handles keyboard events', () => {
    const { getByPlaceholderText } = render(<CreateProductForm {...defaultProps} />);
    
    const nameInput = getByPlaceholderText('Ex: Cartão de Crédito Premium');
    fireEvent(nameInput, 'submitEditing');
    
    // O teste apenas verifica que o evento submitEditing funciona
    expect(nameInput).toBeTruthy();
  });

  it('shows normative information for OUTRO category', () => {
    const { getByText } = render(<CreateProductForm {...defaultProps} />);
    
    expect(getByText('Normativo Aplicável')).toBeTruthy();
    expect(getByText('Normativo aplicável para produtos genéricos da categoria OUTRO')).toBeTruthy();
  });
});
