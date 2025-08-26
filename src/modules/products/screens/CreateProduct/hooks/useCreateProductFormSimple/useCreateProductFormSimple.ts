import { useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useProducts } from '@/hooks/useProducts';

import { INITIAL_FORM_DATA, UseSimpleFormReturn } from './types';
import { FieldName } from '../../types';
import {
  isConvenioAlreadyRegistered,
  isHabitacaoAlreadyRegistered,
  validateForm
} from './utils';
import {
  useDataLoading,
  useFormUpdate,
  useFormSubmission
} from './hooks';

export const useCreateProductForm = (): UseSimpleFormReturn => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { products } = useProducts();
  
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  
  // Custom hooks for specific responsibilities
  const { loadConvenioData, loadHabitacaoData, loadOutroTemplate } = useDataLoading();
  const { updateFormField } = useFormUpdate();
  const { handleSubmit: submitForm, isLoading: submitting } = useFormSubmission();

  // Wrapper functions for data loading
  const handleConvenioLoad = (convenioKey: string) => {
    loadConvenioData(convenioKey, setFormData);
  };

  const handleHabitacaoLoad = () => {
    loadHabitacaoData(setFormData);
  };

  const handleOutroLoad = () => {
    loadOutroTemplate(setFormData);
  };

  // Main field update function
  const updateField = (fieldName: FieldName, value: string | number | boolean | string[]) => {
    updateFormField(
      fieldName,
      value,
      setFormData,
      handleConvenioLoad,
      handleHabitacaoLoad,
      handleOutroLoad
    );
  };

  // Main form submission function
  const handleSubmit = async () => {
    await submitForm(formData);
  };

  // Validation functions using utilities
  const isConvenioRegistered = (convenioKey: string): boolean => {
    return isConvenioAlreadyRegistered(convenioKey, products);
  };

  const isHabitacaoRegistered = (): boolean => {
    return isHabitacaoAlreadyRegistered(products);
  };

  // Form validation
  const isFormValid = validateForm(formData);

  return {
    formData,
    isLoading: submitting,
    isFormValid,
    updateField,
    handleSubmit,
    scrollViewRef,
    isConvenioAlreadyRegistered: isConvenioRegistered,
    isHabitacaoAlreadyRegistered: isHabitacaoRegistered,
  };
};
