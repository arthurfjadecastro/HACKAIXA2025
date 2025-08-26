import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/design-system/components';
import { styles } from '../../CreateProductForm.styles';
import { CategoryOption } from '../../types';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  isHabitacaoAlreadyRegistered: () => boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  isHabitacaoAlreadyRegistered,
}) => {
  const categoryOptions: CategoryOption[] = [
    { value: 'CONSIGNADO', label: 'Consignado', description: 'Empréstimos com desconto em folha' },
    { value: 'HABITACAO', label: 'Habitação', description: 'Financiamentos imobiliários', disabled: isHabitacaoAlreadyRegistered() },
    { value: 'CLT_SUSPENSO', label: 'CLT Suspenso', description: 'Suspenso conforme MP 1292', disabled: true },
    { value: 'OUTRO', label: 'Outro', description: 'Produtos genéricos personalizáveis', disabled: false }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categoria do Produto</Text>
      <Text style={styles.sectionDescription}>
        Selecione a categoria principal do produto financeiro
      </Text>
      
      <View style={styles.radioGroup}>
        {categoryOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioOption,
              selectedCategory === option.value && styles.radioOptionSelected,
              option.disabled && styles.radioOptionDisabled
            ]}
            onPress={() => !option.disabled && onCategorySelect(option.value)}
            disabled={option.disabled}
          >
            <View style={styles.radioButton}>
              {selectedCategory === option.value && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
            <View style={styles.radioContent}>
              <Text style={option.disabled ? 
                { ...styles.radioLabel, color: '#999', opacity: 0.6 } : 
                styles.radioLabel
              }>
                {option.label}
                {option.disabled && option.value === 'HABITACAO' ? ' (Já cadastrado)' : ''}
                {option.disabled && option.value !== 'HABITACAO' ? ' (Indisponível)' : ''}
              </Text>
              <Text style={option.disabled ? 
                { ...styles.radioDescription, color: '#999', opacity: 0.6 } : 
                styles.radioDescription
              }>
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
