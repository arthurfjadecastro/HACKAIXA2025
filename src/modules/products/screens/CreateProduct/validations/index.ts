import { FormData, FieldName, FieldValidation } from '../types';
import { 
  validateName, 
  validateInterestRate, 
  validateMaxTerm, 
  validateNormative,
  validateCategoria,
  validateSubtipo
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
    case 'categoria':
      return validateCategoria(value);
    case 'subtipo':
      return validateSubtipo(value);
    default:
      return { isValid: true };
  }
};

export const validateForm = (formData: FormData): boolean => {
  // Validações básicas sempre necessárias
  const categoriaValid = validateCategoria(formData.categoria).isValid;
  const subtipoValid = validateSubtipo(formData.subtipo).isValid;
  
  // Se categoria e subtipo estão selecionados, validar campos específicos
  if (categoriaValid && subtipoValid && formData.categoria && formData.subtipo) {
    const nameValid = validateName(formData.name).isValid;
    const normativeValid = validateNormative(formData.normative).isValid;
    
    return nameValid && normativeValid;
  }
  
  return categoriaValid && subtipoValid;
};

export const validateAllFields = (formData: FormData) => {
  const errors: Partial<Record<FieldName, string>> = {};
  
  // Validar categoria e subtipo primeiro
  const categoriaValidation = validateCategoria(formData.categoria);
  if (!categoriaValidation.isValid && categoriaValidation.error) {
    errors.categoria = categoriaValidation.error;
  }
  
  const subtipoValidation = validateSubtipo(formData.subtipo);
  if (!subtipoValidation.isValid && subtipoValidation.error) {
    errors.subtipo = subtipoValidation.error;
  }
  
  // Se categoria e subtipo são válidos e estão preenchidos, validar outros campos
  if (categoriaValidation.isValid && subtipoValidation.isValid && 
      formData.categoria && formData.subtipo) {
    
    const fieldOrder: FieldName[] = ['name', 'normative'];
    
    fieldOrder.forEach(fieldName => {
      const fieldValue = formData[fieldName];
      if (typeof fieldValue === 'string') {
        const validation = validateField(fieldName, fieldValue);
        if (!validation.isValid && validation.error) {
          errors[fieldName] = validation.error;
        }
      }
    });
  }

  return errors;
};
