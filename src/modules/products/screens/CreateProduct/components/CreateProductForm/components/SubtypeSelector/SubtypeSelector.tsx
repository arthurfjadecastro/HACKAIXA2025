import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/design-system/components';
import { styles } from '../../CreateProductForm.styles';

interface SubtypeSelectorProps {
  categoria: string;
  selectedSubtipo: string;
  onSubtipoSelect: (subtipo: string) => void;
  isConvenioAlreadyRegistered: (convenioKey: string) => boolean;
}

export const SubtypeSelector: React.FC<SubtypeSelectorProps> = ({
  categoria,
  selectedSubtipo,
  onSubtipoSelect,
  isConvenioAlreadyRegistered,
}) => {
  if (categoria !== 'CONSIGNADO') return null;

  // Lista de todos os convênios disponíveis no sistema
  const todosConvenios = ['militar', 'funcef', 'tjdft'];
  
  // Verifica se todos os convênios já estão cadastrados
  const todosConveniosCadastrados = todosConvenios.every(convenio => 
    isConvenioAlreadyRegistered(convenio)
  );

  const subtypeOptions = [
    { value: 'INSS', label: 'INSS', description: 'Aposentados e pensionistas do INSS' },
    { 
      value: 'CONVENIO', 
      label: 'Convênio', 
      description: todosConveniosCadastrados 
        ? 'Todos os convênios já estão cadastrados' 
        : 'Servidores públicos e militares' 
    }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Subtipo Consignado</Text>
      <Text style={styles.sectionDescription}>
        Escolha o tipo específico de consignado
      </Text>
      
      <View style={styles.radioGroup}>
        {subtypeOptions.map(option => {
          const isSelected = selectedSubtipo === option.value;
          const isAlreadyRegistered = option.value === 'INSS' ? isConvenioAlreadyRegistered('inss') : false;
          const isDisabled = option.value === 'CONVENIO' ? todosConveniosCadastrados : isAlreadyRegistered;
          
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.radioOption,
                isSelected && styles.radioOptionSelected,
                isDisabled && styles.radioOptionDisabled
              ]}
              onPress={() => !isDisabled && onSubtipoSelect(option.value)}
              disabled={isDisabled}
            >
              <View style={styles.radioButton}>
                {isSelected && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <View style={styles.radioContent}>
                <Text style={isDisabled ? 
                  { ...styles.radioLabel, color: '#999', opacity: 0.6 } : 
                  styles.radioLabel
                }>
                  {option.label}
                  {isAlreadyRegistered ? ' (Já cadastrado)' : ''}
                  {option.value === 'CONVENIO' && todosConveniosCadastrados ? ' (Todos cadastrados)' : ''}
                </Text>
                <Text style={isDisabled ? 
                  { ...styles.radioDescription, color: '#999', opacity: 0.6 } : 
                  styles.radioDescription
                }>
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
