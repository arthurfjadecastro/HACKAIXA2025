import React from 'react';
import { View } from 'react-native';
import { Text, InputField } from '@/design-system/components';
import { styles } from '../../CreateProductForm.styles';
import { FormData, FieldName } from '../../../../types';

interface OutroProductFieldsProps {
  formData: FormData;
  updateField: (fieldName: FieldName, value: string | number | boolean | string[]) => void;
}

export const OutroProductFields: React.FC<OutroProductFieldsProps> = ({
  formData,
  updateField,
}) => {
  if (formData.categoria !== 'OUTRO') return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Configuração de Produto Genérico</Text>
      <Text style={styles.sectionDescription}>
        Preencha os campos obrigatórios para criar seu produto personalizado.
      </Text>
      
      {/* Nome do Produto */}
      <View style={styles.inputGroup}>
        <InputField
          label="Nome do Produto *"
          placeholder="Ex: Cartão de Crédito Premium"
          value={formData.name || ''}
          onChangeText={(value: string) => updateField('name', value)}
        />
      </View>

      {/* Subcategoria */}
      <View style={styles.inputGroup}>
        <InputField
          label="Subcategoria"
          placeholder="Ex: Serviço financeiro"
          value={formData.subcategoria_outro || ''}
          onChangeText={(value: string) => updateField('subcategoria_outro', value)}
        />
      </View>

      {/* Prazos com validação simples */}
      <View style={styles.rowContainer}>
        <View style={styles.halfWidth}>
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
          <Text style={styles.fieldHint}>
            Mínimo: 1 mês
          </Text>
        </View>
        <View style={styles.halfWidth}>
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
          <Text style={styles.fieldHint}>
            Padrão: 420 meses (35 anos)
          </Text>
        </View>
      </View>

      {/* Avisos de validação */}
      {formData.categoria === 'OUTRO' && formData.prazo_min_meses !== undefined && formData.prazo_min_meses <= 0 ? (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ O prazo mínimo deve ser maior que 0
          </Text>
        </View>
      ) : null}
      
      {(formData.prazo_min_meses !== undefined && formData.prazo_max_meses !== undefined && 
       formData.prazo_min_meses >= formData.prazo_max_meses) ? (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ O prazo máximo deve ser maior que o mínimo
          </Text>
        </View>
      ) : null}

      {/* Taxa de Juros Anual com tratamento de vírgula/ponto */}
      <View style={styles.inputGroup}>
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
        <Text style={styles.fieldHint}>
          Taxa mensal - aceita vírgula ou ponto como separador decimal
        </Text>
      </View>

      {/* Normativo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Normativo Aplicável</Text>
        <View style={styles.normativoContainer}>
          <Text style={styles.normativoText}>
            {formData.normative || 'Normativo aplicável para produtos genéricos da categoria OUTRO'}
          </Text>
          <Text style={styles.normativoDescription}>
            Normativo aplicável para produtos genéricos da categoria OUTRO
          </Text>
        </View>
      </View>
    </View>
  );
};
