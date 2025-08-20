import { FieldValidation } from '../types';

export const validateName = (value: string): FieldValidation => {
  const trimmedValue = value.trim();
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Nome do produto é obrigatório' };
  }
  
  if (trimmedValue.length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  if (trimmedValue.length > 60) {
    return { isValid: false, error: 'Nome deve ter no máximo 60 caracteres' };
  }
  
  return { isValid: true };
};

export const validateInterestRate = (value: string): FieldValidation => {
  if (!value.trim()) {
    return { isValid: false, error: 'Taxa de juros é obrigatória' };
  }

  const numValue = parseFloat(value.replace(',', '.'));
  
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Digite um número válido' };
  }
  
  if (numValue < 0 || numValue > 100) {
    return { isValid: false, error: 'Taxa deve estar entre 0 e 100' };
  }
  
  // Verificar se tem mais de 2 casas decimais
  const decimalPart = value.split(/[.,]/)[1];
  if (decimalPart && decimalPart.length > 2) {
    return { isValid: false, error: 'Máximo 2 casas decimais' };
  }
  
  return { isValid: true };
};

export const validateMaxTerm = (value: string): FieldValidation => {
  if (!value.trim()) {
    return { isValid: false, error: 'Prazo máximo é obrigatório' };
  }

  const numValue = parseInt(value);
  
  if (isNaN(numValue) || !Number.isInteger(parseFloat(value))) {
    return { isValid: false, error: 'Digite um número inteiro válido' };
  }
  
  if (numValue < 1) {
    return { isValid: false, error: 'Prazo deve ser maior ou igual a 1 mês' };
  }
  
  if (numValue > 360) {
    return { isValid: false, error: 'Prazo deve ser menor ou igual a 360 meses' };
  }
  
  return { isValid: true };
};

export const validateNormative = (value: string): FieldValidation => {
  const trimmedValue = value.trim();
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Normativo é obrigatório' };
  }
  
  if (trimmedValue.length < 2) {
    return { isValid: false, error: 'Normativo deve ter pelo menos 2 caracteres' };
  }
  
  if (trimmedValue.length > 40) {
    return { isValid: false, error: 'Normativo deve ter no máximo 40 caracteres' };
  }
  
  return { isValid: true };
};
