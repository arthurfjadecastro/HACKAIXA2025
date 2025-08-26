import React from 'react';
import { View } from 'react-native';
import { Text, InputField } from '@/design-system/components';
import { styles } from '../../EnhancedCreateProduct.styles';
import { ProductFormData } from '@/types/products';

interface BasicInfoFieldsProps {
  formData: ProductFormData;
  onUpdateField: (field: keyof ProductFormData, value: any) => void;
  showFields: boolean;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  onUpdateField,
  showFields,
}) => {
  if (!showFields) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informações Básicas</Text>
      
      <InputField
        label="Nome do Produto *"
        value={formData.nome}
        onChangeText={(text: string) => onUpdateField('nome', text)}
        placeholder="Ex: INSS Premium, Militar Gold"
      />

      <View style={styles.input}>
        <InputField
          label="Descrição"
          value={formData.descricao || ''}
          onChangeText={(text: string) => onUpdateField('descricao', text)}
          placeholder="Descrição opcional do produto"
        />
      </View>
    </View>
  );
};
