import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Text } from '@/design-system/components';
import { FormData, FieldName } from '../types';
import { styles } from '../CreateProduct.styles';

interface CreateProductFormProps {
  formData: FormData;
  updateField: (fieldName: FieldName, value: string | number | boolean | string[]) => void;
  isConvenioAlreadyRegistered: (convenioKey: string) => boolean;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  formData,
  updateField,
  isConvenioAlreadyRegistered,
}) => {
  
  const renderCategoriaSelector = () => (
    <View style={formStyles.section}>
      <Text style={formStyles.sectionTitle}>Categoria do Produto</Text>
      <Text style={formStyles.sectionDescription}>
        Selecione a categoria principal do produto financeiro
      </Text>
      
      <View style={formStyles.radioGroup}>
        {[
          { value: 'CONSIGNADO', label: 'Consignado', description: 'Empréstimos com desconto em folha' },
          { value: 'HABITACAO', label: 'Habitação', description: 'Financiamentos imobiliários (em breve)' },
          { value: 'CLT_SUSPENSO', label: 'CLT Suspenso', description: 'Suspenso conforme MP 1292', disabled: true },
          { value: 'OUTRO', label: 'Outro', description: 'Configuração manual (em breve)', disabled: true }
        ].map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              formStyles.radioOption,
              formData.categoria === option.value && formStyles.radioOptionSelected,
              option.disabled && formStyles.radioOptionDisabled
            ]}
            onPress={() => !option.disabled && updateField('categoria', option.value)}
            disabled={option.disabled}
          >
            <View style={formStyles.radioButton}>
              {formData.categoria === option.value && (
                <View style={formStyles.radioButtonSelected} />
              )}
            </View>
            <View style={formStyles.radioContent}>
              <Text style={option.disabled ? formStyles.radioLabelDisabled : formStyles.radioLabel}>
                {option.label}
              </Text>
              <Text style={option.disabled ? formStyles.radioDescriptionDisabled : formStyles.radioDescription}>
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSubtipoSelector = () => {
    if (formData.categoria !== 'CONSIGNADO') return null;

    return (
      <View style={formStyles.section}>
        <Text style={formStyles.sectionTitle}>Subtipo Consignado</Text>
        <Text style={formStyles.sectionDescription}>
          Escolha o tipo específico de consignado
        </Text>
        
        <View style={formStyles.radioGroup}>
          {[
            { value: 'INSS', label: 'INSS', description: 'Aposentados e pensionistas do INSS' },
            { value: 'CONVENIO', label: 'Convênio', description: 'Servidores públicos e militares' }
          ].map(option => {
            const isSelected = formData.subtipo === option.value;
            const isAlreadyRegistered = option.value === 'INSS' ? isConvenioAlreadyRegistered('inss') : false;
            
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  formStyles.radioOption,
                  isSelected && formStyles.radioOptionSelected,
                  isAlreadyRegistered && formStyles.radioOptionDisabled
                ]}
                onPress={() => !isAlreadyRegistered && updateField('subtipo', option.value)}
                disabled={isAlreadyRegistered}
              >
                <View style={formStyles.radioButton}>
                  {isSelected && (
                    <View style={formStyles.radioButtonSelected} />
                  )}
                </View>
                <View style={formStyles.radioContent}>
                  <Text style={isAlreadyRegistered ? 
                    { ...formStyles.radioLabel, color: '#999', opacity: 0.6 } : 
                    formStyles.radioLabel
                  }>
                    {option.label}
                    {isAlreadyRegistered && ' (Já cadastrado)'}
                  </Text>
                  <Text style={isAlreadyRegistered ? 
                    { ...formStyles.radioDescription, color: '#999', opacity: 0.6 } : 
                    formStyles.radioDescription
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

  const renderConvenioSelector = () => {
    if (formData.subtipo !== 'CONVENIO') return null;

    const conveniosDisponiveis = [
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
      <View style={formStyles.section}>
        <Text style={formStyles.sectionTitle}>Convênio Específico</Text>
        <Text style={formStyles.sectionDescription}>
          Selecione o convênio para preencher automaticamente as configurações
        </Text>
        
        <View style={formStyles.radioGroup}>
          {conveniosDisponiveis.map(convenio => {
            const isSelected = formData.convenio_selected === convenio.key;
            const isAlreadyRegistered = isConvenioAlreadyRegistered(convenio.key);
            
            return (
              <TouchableOpacity
                key={convenio.key}
                style={[
                  formStyles.radioOption,
                  isSelected && formStyles.radioOptionSelected,
                  isAlreadyRegistered && formStyles.radioOptionDisabled
                ]}
                onPress={() => {
                  if (!isAlreadyRegistered) {
                    updateField('convenio_selected', convenio.key);
                  }
                }}
                disabled={isAlreadyRegistered}
              >
                <View style={formStyles.radioButton}>
                  {isSelected && !isAlreadyRegistered && (
                    <View style={formStyles.radioButtonSelected} />
                  )}
                </View>
                <View style={formStyles.radioContent}>
                  <Text style={isAlreadyRegistered ? formStyles.radioLabelDisabled : formStyles.radioLabel}>
                    {convenio.nome}
                    {isAlreadyRegistered && ' (Já cadastrado)'}
                  </Text>
                  <Text style={isAlreadyRegistered ? formStyles.radioDescriptionDisabled : formStyles.radioDescription}>
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

  const renderAutoFilledSummary = () => {
    // Só mostra se um convênio específico foi selecionado
    if (!formData.categoria || !formData.subtipo || formData.categoria === 'HABITACAO') return null;
    
    // Para categoria CONSIGNADO subtipo CONVENIO, só mostra se convenio_selected foi escolhido
    if (formData.categoria === 'CONSIGNADO' && formData.subtipo === 'CONVENIO' && !formData.convenio_selected) {
      return null;
    }

    // Verifica se os dados foram carregados (pelo menos prazo_minimo deve estar definido)
    if (!formData.prazo_minimo) {
      return null;
    }

    return (
      <View style={formStyles.section}>
        <Text style={formStyles.sectionTitle}>Configurações do Produto</Text>
        
        <View style={formStyles.autoFilledContainer}>
          {/* Informações principais em destaque */}
          <View style={formStyles.highlightedInfoContainer}>
            <View style={formStyles.highlightedInfoRow}>
              <Text style={formStyles.highlightedInfoLabel}>Prazo:</Text>
              <Text style={formStyles.highlightedInfoValue}>
                {formData.prazo_minimo} - {formData.prazo_maximo} meses
              </Text>
            </View>
            
            <View style={formStyles.highlightedInfoRow}>
              <Text style={formStyles.highlightedInfoLabel}>Margem Consignável:</Text>
              <Text style={formStyles.highlightedInfoValue}>
                {formData.margem_consignavel}%
              </Text>
            </View>
          </View>

          {/* Taxas por faixa */}
          <View style={formStyles.taxasContainer}>
            <Text style={formStyles.taxasTitle}>Taxas por Faixa (Concessão / Renovação)</Text>
            
            <View style={formStyles.autoFilledRow}>
              <Text style={formStyles.autoFilledLabel}>Faixa A:</Text>
              <Text style={formStyles.autoFilledValue}>
                {formData.taxa_faixa_a_concessao}% / {formData.taxa_faixa_a_renovacao}%
              </Text>
            </View>

            <View style={formStyles.autoFilledRow}>
              <Text style={formStyles.autoFilledLabel}>Faixa B:</Text>
              <Text style={formStyles.autoFilledValue}>
                {formData.taxa_faixa_b_concessao}% / {formData.taxa_faixa_b_renovacao}%
              </Text>
            </View>

            <View style={formStyles.autoFilledRow}>
              <Text style={formStyles.autoFilledLabel}>Faixa C:</Text>
              <Text style={formStyles.autoFilledValue}>
                {formData.taxa_faixa_c_concessao}% / {formData.taxa_faixa_c_renovacao}%
              </Text>
            </View>
          </View>
        </View>

        {formData.observacoes && formData.observacoes.length > 0 && (
          <View style={formStyles.observacoesContainer}>
            <Text style={formStyles.observacoesTitle}>Observações do Convênio:</Text>
            {formData.observacoes.map((obs, index) => (
              <Text key={index} style={formStyles.observacaoItem}>• {obs}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.form}>
      {renderCategoriaSelector()}
      {renderSubtipoSelector()}
      {renderConvenioSelector()}
      {renderAutoFilledSummary()}

      {/* Normativo Legal - Se foi preenchido automaticamente */}
      {formData.categoria === 'CONSIGNADO' && formData.normative && (
        <View style={formStyles.section}>
          <Text style={formStyles.sectionTitle}>Normativo Legal</Text>
          
          <View style={formStyles.normativoContainer}>
            <Text style={formStyles.normativoText}>{formData.normative}</Text>
            <Text style={formStyles.normativoDescription}>
              Normativo aplicável para produtos de crédito consignado
            </Text>
          </View>
        </View>
      )}

      {/* Campos manuais serão implementados no futuro para opção "Outro" */}
      {/* Por enquanto, produtos específicos (CONSIGNADO/HABITACAO) são configurados automaticamente */}
    </View>
  );
};

const formStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#667085',
    marginBottom: 16,
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radioOptionSelected: {
    borderColor: '#005CA9',
    backgroundColor: '#F0F7FF',
  },
  radioOptionDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#005CA9',
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  radioLabelDisabled: {
    color: '#9CA3AF',
  },
  radioDescription: {
    fontSize: 14,
    color: '#667085',
  },
  radioSubInfo: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginTop: 4,
  },
  radioDescriptionDisabled: {
    color: '#D1D5DB',
  },
  autoFilledBadge: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '400',
  },
  autoFilledContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },

  // Container destacado para informações principais
  highlightedInfoContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#28a745',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  highlightedInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f5e8',
  },

  highlightedInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },

  highlightedInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#28a745',
  },

  // Container para as taxas
  taxasContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 6,
    padding: 10,
  },

  taxasTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },

  autoFilledRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  autoFilledLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  autoFilledValue: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  observacoesContainer: {
    marginTop: 16,
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  observacoesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  observacaoItem: {
    fontSize: 13,
    color: '#92400E',
    marginBottom: 4,
  },

  // Estilos para normativo legal
  normativoContainer: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 8,
    padding: 12,
  },

  normativoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3730A3',
    marginBottom: 4,
  },

  normativoDescription: {
    fontSize: 12,
    color: '#6366F1',
    fontStyle: 'italic',
  },
});
