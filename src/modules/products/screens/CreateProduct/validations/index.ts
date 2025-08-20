import { FormData, FieldName, FieldValidation } from '../types';
import { 
  validateName, 
  validateInterestRate, 
  validateMaxTerm, 
  validateNormative 
} from './fieldValidations';

export const validateField = (fieldName: FieldName, value: string): FieldValidation => {
  switch (fieldName) {
    case 'name':
      return validateName(value);
    case 'interestRate':
      return validateInterestRate(value);
    case 'maxTerm':
      return validateMaxTerm(value);
    case 'normative':
      return validateNormative(value);
    default:
      return { isValid: true };
  }
};

export const validateForm = (formData: FormData): boolean => {
  const nameValid = validateName(formData.name).isValid;
  const interestRateValid = validateInterestRate(formData.interestRate).isValid;
  const maxTermValid = validateMaxTerm(formData.maxTerm).isValid;
  const normativeValid = validateNormative(formData.normative).isValid;
  
  return nameValid && interestRateValid && maxTermValid && normativeValid;
};

export const validateAllFields = (formData: FormData) => {
  const errors: Partial<Record<FieldName, string>> = {};
  
  const fieldOrder: FieldName[] = ['name', 'interestRate', 'maxTerm', 'normative'];
  
  fieldOrder.forEach(fieldName => {
    const validation = validateField(fieldName, formData[fieldName]);
    if (!validation.isValid && validation.error) {
      errors[fieldName] = validation.error;
    }
  });

  return errors;
};
