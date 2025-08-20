import React from 'react';
import { View, Keyboard } from 'react-native';

import { InputField } from '@/design-system/components';
import { FormData, FormErrors, FieldName } from '../types';
import { styles } from '../CreateProduct.styles';

interface CreateProductFormProps {
  formData: FormData;
  errors: FormErrors;
  updateField: (fieldName: FieldName, value: string) => void;
  handleBlur: (fieldName: FieldName) => void;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  formData,
  errors,
  updateField,
  handleBlur,
}) => {
  return (
    <View style={styles.form}>
      {/* Nome do produto */}
      <InputField
        label="Nome do produto"
        value={formData.name}
        onChangeText={(value) => updateField('name', value)}
        onBlur={() => handleBlur('name')}
        placeholder="Digite o nome do produto"
        error={errors.name}
        helperText={errors.name || "Informe o nome do produto"}
        testID="name-input"
        returnKeyType="next"
      />

      {/* Taxa de juros */}
      <InputField
        label="Taxa de juros anual (%)"
        value={formData.interestRate}
        onChangeText={(value) => updateField('interestRate', value)}
        onBlur={() => handleBlur('interestRate')}
        placeholder="0,00"
        keyboardType="numeric"
        error={errors.interestRate}
        helperText={errors.interestRate || "Digite uma taxa entre 0 e 100 (até 2 casas decimais)"}
        testID="interest-rate-input"
        returnKeyType="next"
      />

      {/* Prazo máximo */}
      <InputField
        label="Prazo máximo (em meses)"
        value={formData.maxTerm}
        onChangeText={(value) => updateField('maxTerm', value)}
        onBlur={() => handleBlur('maxTerm')}
        placeholder="12"
        keyboardType="numeric"
        error={errors.maxTerm}
        helperText={errors.maxTerm || "Informe um prazo em meses (inteiro ≥ 1)"}
        testID="max-term-input"
        returnKeyType="next"
      />

      {/* Normativo */}
      <InputField
        label="Normativo"
        value={formData.normative}
        onChangeText={(value) => updateField('normative', value)}
        onBlur={() => handleBlur('normative')}
        placeholder="Digite o normativo"
        error={errors.normative}
        helperText={errors.normative || "Informe o normativo"}
        testID="normative-input"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />
    </View>
  );
};
