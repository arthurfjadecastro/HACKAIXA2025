import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Text, InputField } from '@/design-system/components';
import { FormData, FieldName } from '../types';

interface CreateProductFormProps {
  formData: FormData;
  updateField: (fieldName: FieldName, value: string | number | boolean | string[]) => void;
  isConvenioAlreadyRegistered: (convenioKey: string) => boolean;
  isHabitacaoAlreadyRegistered: () => boolean;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  formData,
  updateField,
  isConvenioAlreadyRegistered,
  isHabitacaoAlreadyRegistered,
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
          { value: 'HABITACAO', label: 'Habitação', description: 'Financiamentos imobiliários', disabled: isHabitacaoAlreadyRegistered() },
          { value: 'CLT_SUSPENSO', label: 'CLT Suspenso', description: 'Suspenso conforme MP 1292', disabled: true },
          { value: 'OUTRO', label: 'Outro', description: 'Produtos genéricos personalizáveis', disabled: false }
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
              <Text style={option.disabled ? 
                { ...formStyles.radioLabel, color: '#999', opacity: 0.6 } : 
                formStyles.radioLabel
              }>
                {option.label}
                {option.disabled && option.value === 'HABITACAO' ? ' (Já cadastrado)' : ''}
                {option.disabled && option.value !== 'HABITACAO' ? ' (Indisponível)' : ''}
              </Text>
              <Text style={option.disabled ? 
                { ...formStyles.radioDescription, color: '#999', opacity: 0.6 } : 
                formStyles.radioDescription
              }>
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

    // Lista de todos os convênios disponíveis no sistema
    const todosConvenios = ['militar', 'funcef', 'tjdft'];
    
    // Verifica se todos os convênios já estão cadastrados
    const todosConveniosCadastrados = todosConvenios.every(convenio => 
      isConvenioAlreadyRegistered(convenio)
    );

    return (
      <View style={formStyles.section}>
        <Text style={formStyles.sectionTitle}>Subtipo Consignado</Text>
        <Text style={formStyles.sectionDescription}>
          Escolha o tipo específico de consignado
        </Text>
        
        <View style={formStyles.radioGroup}>
          {[
            { value: 'INSS', label: 'INSS', description: 'Aposentados e pensionistas do INSS' },
            { 
              value: 'CONVENIO', 
              label: 'Convênio', 
              description: todosConveniosCadastrados 
                ? 'Todos os convênios já estão cadastrados' 
                : 'Servidores públicos e militares' 
            }
          ].map(option => {
            const isSelected = formData.subtipo === option.value;
            const isAlreadyRegistered = option.value === 'INSS' ? isConvenioAlreadyRegistered('inss') : false;
            const isDisabled = option.value === 'CONVENIO' ? todosConveniosCadastrados : isAlreadyRegistered;
            
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  formStyles.radioOption,
                  isSelected && formStyles.radioOptionSelected,
                  isDisabled && formStyles.radioOptionDisabled
                ]}
                onPress={() => !isDisabled && updateField('subtipo', option.value)}
                disabled={isDisabled}
              >
                <View style={formStyles.radioButton}>
                  {isSelected && (
                    <View style={formStyles.radioButtonSelected} />
                  )}
                </View>
                <View style={formStyles.radioContent}>
                  <Text style={isDisabled ? 
                    { ...formStyles.radioLabel, color: '#999', opacity: 0.6 } : 
                    formStyles.radioLabel
                  }>
                    {option.label}
                    {isAlreadyRegistered ? ' (Já cadastrado)' : ''}
                    {option.value === 'CONVENIO' && todosConveniosCadastrados ? ' (Todos cadastrados)' : ''}
                  </Text>
                  <Text style={isDisabled ? 
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
                    {isAlreadyRegistered ? ' (Já cadastrado)' : ''}
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
                {(formData.prazo_minimo || 0)} - {(formData.prazo_maximo || 0)} meses
              </Text>
            </View>
            
            <View style={formStyles.highlightedInfoRow}>
              <Text style={formStyles.highlightedInfoLabel}>Margem Consignável:</Text>
              <Text style={formStyles.highlightedInfoValue}>
                {(formData.margem_consignavel || 0)}%
              </Text>
            </View>
          </View>

          {/* Taxas por faixa */}
          <View style={formStyles.taxasContainer}>
            <Text style={formStyles.taxasTitle}>Taxas por Faixa (Concessão / Renovação)</Text>
            
            <View style={formStyles.autoFilledRow}>
              <Text style={formStyles.autoFilledLabel}>Faixa A:</Text>
              <Text style={formStyles.autoFilledValue}>
                {(formData.taxa_faixa_a_concessao || 0)}% / {(formData.taxa_faixa_a_renovacao || 0)}%
              </Text>
            </View>

            <View style={formStyles.autoFilledRow}>
              <Text style={formStyles.autoFilledLabel}>Faixa B:</Text>
              <Text style={formStyles.autoFilledValue}>
                {(formData.taxa_faixa_b_concessao || 0)}% / {(formData.taxa_faixa_b_renovacao || 0)}%
              </Text>
            </View>

            <View style={formStyles.autoFilledRow}>
              <Text style={formStyles.autoFilledLabel}>Faixa C:</Text>
              <Text style={formStyles.autoFilledValue}>
                {(formData.taxa_faixa_c_concessao || 0)}% / {(formData.taxa_faixa_c_renovacao || 0)}%
              </Text>
            </View>
          </View>
        </View>

        {formData.observacoes && formData.observacoes.length > 0 && (
          <View style={formStyles.observacoesContainer}>
            <Text style={formStyles.observacoesTitle}>Observações do Convênio:</Text>
            {formData.observacoes.map((obs, index) => (
              <Text key={index} style={formStyles.observacaoItem}>• {obs || ''}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={formStyles.formContainer}>
      {renderCategoriaSelector()}
      {renderSubtipoSelector()}
      {renderConvenioSelector()}
      {renderAutoFilledSummary()}

      {/* Normativo Legal - Se foi preenchido automaticamente */}
      {(formData.categoria === 'CONSIGNADO' || formData.categoria === 'HABITACAO') && formData.normative && (
        <View style={formStyles.section}>
          <Text style={formStyles.sectionTitle}>Normativo Legal</Text>
          
          <View style={formStyles.normativoContainer}>
            <Text style={formStyles.normativoText}>{formData.normative}</Text>
            <Text style={formStyles.normativoDescription}>
              {formData.categoria === 'CONSIGNADO' 
                ? 'Normativo aplicável para produtos de crédito consignado'
                : 'Normativo aplicável para financiamento habitacional'
              }
            </Text>
          </View>
        </View>
      )}

      {/* Campos manuais para categoria OUTRO */}
      {formData.categoria === 'OUTRO' && (
        <View style={formStyles.section}>
          <Text style={formStyles.sectionTitle}>Configuração de Produto Genérico</Text>
          <Text style={formStyles.sectionDescription}>
            Preencha os campos obrigatórios para criar seu produto personalizado.
          </Text>
          
          {/* Nome do Produto */}
          <View style={formStyles.inputGroup}>
            <InputField
              label="Nome do Produto *"
              placeholder="Ex: Cartão de Crédito Premium"
              value={formData.name || ''}
              onChangeText={(value: string) => updateField('name', value)}
            />
          </View>

          {/* Subcategoria */}
          <View style={formStyles.inputGroup}>
            <InputField
              label="Subcategoria"
              placeholder="Ex: Serviço financeiro"
              value={formData.subcategoria_outro || ''}
              onChangeText={(value: string) => updateField('subcategoria_outro', value)}
            />
          </View>

          {/* Prazos com validação simples */}
          <View style={formStyles.rowContainer}>
            <View style={formStyles.halfWidth}>
              <InputField
                label="Prazo Mínimo (meses) *"
                placeholder="1"
                value={formData.prazo_min_meses?.toString() || ''}
                onChangeText={(value: string) => {
                  if (value === '') {
                    // Campo vazio - permite limpeza
                    updateField('prazo_min_meses', '');
                  } else {
                    // Permite apenas números
                    const cleanValue = value.replace(/[^0-9]/g, '');
                    if (cleanValue !== '') {
                      const numValue = parseInt(cleanValue);
                      updateField('prazo_min_meses', numValue);
                    }
                  }
                }}
                keyboardType="numeric"
              />
              <Text style={formStyles.fieldHint}>
                Mínimo: 1 mês
              </Text>
            </View>
            <View style={formStyles.halfWidth}>
              <InputField
                label="Prazo Máximo (meses) *"
                placeholder="420"
                value={formData.prazo_max_meses?.toString() || ''}
                onChangeText={(value: string) => {
                  if (value === '') {
                    // Campo vazio - usa string vazia para permitir limpeza
                    updateField('prazo_max_meses', '');
                  } else {
                    // Permite apenas números
                    const cleanValue = value.replace(/[^0-9]/g, '');
                    if (cleanValue !== '') {
                      const numValue = parseInt(cleanValue);
                      updateField('prazo_max_meses', numValue);
                    }
                  }
                }}
                keyboardType="numeric"
              />
              <Text style={formStyles.fieldHint}>
                Padrão: 420 meses (35 anos)
              </Text>
            </View>
          </View>

          {/* Avisos de validação */}
          {formData.categoria === 'OUTRO' && formData.prazo_min_meses !== undefined && formData.prazo_min_meses <= 0 ? (
            <View style={formStyles.warningContainer}>
              <Text style={formStyles.warningText}>
                ⚠️ O prazo mínimo deve ser maior que 0
              </Text>
            </View>
          ) : null}
          
          {(formData.prazo_min_meses !== undefined && formData.prazo_max_meses !== undefined && 
           formData.prazo_min_meses >= formData.prazo_max_meses) ? (
            <View style={formStyles.warningContainer}>
              <Text style={formStyles.warningText}>
                ⚠️ O prazo máximo deve ser maior que o mínimo
              </Text>
            </View>
          ) : null}

          {/* Taxa de Juros Anual com tratamento de vírgula/ponto */}
          <View style={formStyles.inputGroup}>
            <InputField
              label="Taxa de Juros Mensal (% a.m.)"
              placeholder="Ex: 12,50 ou 12.50"
              value={formData.interestRate || ''}
              onChangeText={(value: string) => {
                // Converte vírgula para ponto e mantém apenas números e ponto
                const cleanValue = value.replace(',', '.').replace(/[^0-9.]/g, '');
                
                // Evita múltiplos pontos
                const parts = cleanValue.split('.');
                const finalValue = parts.length > 2 
                  ? parts[0] + '.' + parts.slice(1).join('')
                  : cleanValue;
                
                updateField('interestRate', finalValue);
              }}
              keyboardType="numeric"
            />
            <Text style={formStyles.fieldHint}>
              Taxa mensal - aceita vírgula ou ponto como separador decimal
            </Text>
          </View>

    

          {/* Normativo */}
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>Normativo Aplicável</Text>
            <View style={formStyles.normativoContainer}>
              <Text style={formStyles.normativoText}>
                {formData.normative || 'Normativo aplicável para produtos genéricos da categoria OUTRO'}
              </Text>
              <Text style={formStyles.normativoDescription}>
                Normativo aplicável para produtos genéricos da categoria OUTRO
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Por enquanto, produtos específicos (CONSIGNADO/HABITACAO) são configurados automaticamente */}
    </View>
  );
};

const formStyles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20, // Padding lateral para respiro visual
  },
  section: {
    marginBottom: 32, // Espaçamento aumentado entre seções
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12, // Espaçamento aumentado
  },
  sectionDescription: {
    fontSize: 14,
    color: '#667085',
    marginBottom: 20, // Espaçamento aumentado
    lineHeight: 20, // Melhor legibilidade
  },
  radioGroup: {
    gap: 16, // Gap aumentado entre opções
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20, // Padding aumentado para melhor toque
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1, // Sombra sutil no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  radioOptionSelected: {
    borderColor: '#005CA9',
    backgroundColor: '#F0F7FF',
    elevation: 2, // Sombra maior quando selecionado
    shadowOpacity: 0.1,
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

  // Estilos específicos para formulário OUTRO
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  input: {
    fontSize: 14,
    color: '#111827',
  },
  checkboxGroup: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#005CA9',
    borderColor: '#005CA9',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  fieldHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  warningContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
    textAlign: 'center',
  },
});
