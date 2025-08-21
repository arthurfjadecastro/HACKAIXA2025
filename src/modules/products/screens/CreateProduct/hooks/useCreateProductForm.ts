import { useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FormData, FormErrors, FieldName, UseFormReturn } from '../types';
import { validateField, validateForm, validateAllFields } from '../validations';
import { useCreateProduct } from '@/hooks/useCreateProduct';

const initialFormData: FormData = {
  name: '',
  interestRate: '',
  maxTerm: '',
  normative: '',
};

export const useCreateProductForm = (): UseFormReturn & { scrollViewRef: React.RefObject<ScrollView | null> } => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const { createProduct, loading: submitting } = useCreateProduct();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = (fieldName: FieldName, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Validar em tempo real se o campo já foi tocado
    if (touched[fieldName]) {
      const validation = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: validation.isValid ? undefined : validation.error,
      }));
    }
  };

  const handleBlur = (fieldName: FieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const validation = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? undefined : validation.error,
    }));
  };

  const scrollToFirstError = () => {
    // Rola para o topo onde estão os campos
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSubmit = async () => {
    // Validar todos os campos
    const newErrors = validateAllFields(formData);

    setErrors(newErrors);
    setTouched({
      name: true,
      interestRate: true,
      maxTerm: true,
      normative: true,
    });

    // Se há erros, rolar para o primeiro erro
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }

    // Criar produto usando o novo sistema
    const result = await createProduct({
      name: formData.name,
      juros: parseFloat(formData.interestRate),
      prazoMaximo: parseInt(formData.maxTerm, 10),
      normativo: formData.normative,
    });

    if (result.success) {
      // Reset form após sucesso
      setFormData(initialFormData);
      setTouched({});
      setErrors({});
      
      // Navegar de volta
      navigation.goBack();
    }
  };

  const isFormValid = validateForm(formData);

  return {
    formData,
    errors,
    touched,
    isLoading: submitting,
    isFormValid,
    updateField,
    handleBlur,
    handleSubmit,
    scrollToFirstError,
    scrollViewRef,
  };
};
