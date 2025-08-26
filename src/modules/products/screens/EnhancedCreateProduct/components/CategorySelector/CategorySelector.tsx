import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/design-system/components';
import { styles } from '../../EnhancedCreateProduct.styles';
import { CategoryOption } from '../../types';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const categoryOptions: CategoryOption[] = [
    { value: 'CONSIGNADO', label: 'Consignado', description: 'Empréstimos com desconto em folha' },
    { value: 'HABITACAO', label: 'Habitação', description: 'Financiamentos imobiliários' }
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
              selectedCategory === option.value && styles.radioOptionSelected
            ]}
            onPress={() => onCategorySelect(option.value)}
          >
            <View style={styles.radioButton}>
              {selectedCategory === option.value && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
            <View style={styles.radioContent}>
              <Text style={styles.radioLabel}>{option.label}</Text>
              <Text style={styles.radioDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
