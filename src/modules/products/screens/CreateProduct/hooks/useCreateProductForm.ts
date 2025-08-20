import { useState, useRef } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FormData, FormErrors, FieldName, UseFormReturn } from '../types';
import { validateField, validateForm, validateAllFields } from '../validations';

const initialFormData: FormData = {
  name: '',
  interestRate: '',
  maxTerm: '',
  normative: '',
};

export const useCreateProductForm = (): UseFormReturn & { scrollViewRef: React.RefObject<ScrollView | null> } => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

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

    // Processar envio
    setIsLoading(true);
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Sucesso!',
        'Produto cadastrado com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao cadastrar produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = validateForm(formData);

  return {
    formData,
    errors,
    touched,
    isLoading,
    isFormValid,
    updateField,
    handleBlur,
    handleSubmit,
    scrollToFirstError,
    scrollViewRef,
  };
};
