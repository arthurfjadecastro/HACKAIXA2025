import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/design-system/components';
import { styles } from '../../CreateProductForm.styles';

interface ConvenioOption {
  nome: string;
  descricao: string;
  key: string;
}

interface ConvenioSelectorProps {
  subtipo: string;
  selectedConvenio: string;
  onConvenioSelect: (convenio: string) => void;
  isConvenioAlreadyRegistered: (convenioKey: string) => boolean;
}

export const ConvenioSelector: React.FC<ConvenioSelectorProps> = ({
  subtipo,
  selectedConvenio,
  onConvenioSelect,
  isConvenioAlreadyRegistered,
}) => {
  if (subtipo !== 'CONVENIO') return null;

  const conveniosDisponiveis: ConvenioOption[] = [
    { 
      nome: 'Militar', 
      descricao: 'Comando da Aeronáutica - Militar',
      key: 'militar'
    },
    { 
      nome: 'FUNCEF', 
      descricao: 'Empregados da FUNCEF',
      key: 'funcef'
    },
    { 
      nome: 'TJDFT', 
      descricao: 'Tribunal de Justiça do DF e Territórios',
      key: 'tjdft'
    }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Convênio Específico</Text>
      <Text style={styles.sectionDescription}>
        Selecione o convênio para preencher automaticamente as configurações
      </Text>
      
      <View style={styles.radioGroup}>
        {conveniosDisponiveis.map(convenio => {
          const isSelected = selectedConvenio === convenio.key;
          const isAlreadyRegistered = isConvenioAlreadyRegistered(convenio.key);
          
          return (
            <TouchableOpacity
              key={convenio.key}
              style={[
                styles.radioOption,
                isSelected && styles.radioOptionSelected,
                isAlreadyRegistered && styles.radioOptionDisabled
              ]}
              onPress={() => {
                if (!isAlreadyRegistered) {
                  onConvenioSelect(convenio.key);
                }
              }}
              disabled={isAlreadyRegistered}
            >
              <View style={styles.radioButton}>
                {isSelected && !isAlreadyRegistered && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <View style={styles.radioContent}>
                <Text style={isAlreadyRegistered ? styles.radioLabelDisabled : styles.radioLabel}>
                  {convenio.nome}
                  {isAlreadyRegistered ? ' (Já cadastrado)' : ''}
                </Text>
                <Text style={isAlreadyRegistered ? styles.radioDescriptionDisabled : styles.radioDescription}>
                  {convenio.descricao}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
