import React from 'react';
import { View } from 'react-native';
import { Text } from '@/design-system/components';
import { styles } from '../../CreateProductForm.styles';
import { FormData } from '../../../../types';

interface AutoFilledSummaryProps {
  formData: FormData;
}

export const AutoFilledSummary: React.FC<AutoFilledSummaryProps> = ({
  formData,
}) => {
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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Configurações do Produto</Text>
      
      <View style={styles.autoFilledContainer}>
        {/* Informações principais em destaque */}
        <View style={styles.highlightedInfoContainer}>
          <View style={styles.highlightedInfoRow}>
            <Text style={styles.highlightedInfoLabel}>Prazo:</Text>
            <Text style={styles.highlightedInfoValue}>
              {(formData.prazo_minimo || 0)} - {(formData.prazo_maximo || 0)} meses
            </Text>
          </View>
          
          <View style={styles.highlightedInfoRow}>
            <Text style={styles.highlightedInfoLabel}>Margem Consignável:</Text>
            <Text style={styles.highlightedInfoValue}>
              {(formData.margem_consignavel || 0)}%
            </Text>
          </View>
        </View>

        {/* Taxas por faixa */}
        <View style={styles.taxasContainer}>
          <Text style={styles.taxasTitle}>Taxas por Faixa (Concessão / Renovação)</Text>
          
          <View style={styles.autoFilledRow}>
            <Text style={styles.autoFilledLabel}>Faixa A:</Text>
            <Text style={styles.autoFilledValue}>
              {(formData.taxa_faixa_a_concessao || 0)}% / {(formData.taxa_faixa_a_renovacao || 0)}%
            </Text>
          </View>

          <View style={styles.autoFilledRow}>
            <Text style={styles.autoFilledLabel}>Faixa B:</Text>
            <Text style={styles.autoFilledValue}>
              {(formData.taxa_faixa_b_concessao || 0)}% / {(formData.taxa_faixa_b_renovacao || 0)}%
            </Text>
          </View>

          <View style={styles.autoFilledRow}>
            <Text style={styles.autoFilledLabel}>Faixa C:</Text>
            <Text style={styles.autoFilledValue}>
              {(formData.taxa_faixa_c_concessao || 0)}% / {(formData.taxa_faixa_c_renovacao || 0)}%
            </Text>
          </View>
        </View>
      </View>

      {formData.observacoes && formData.observacoes.length > 0 && (
        <View style={styles.observacoesContainer}>
          <Text style={styles.observacoesTitle}>Observações do Convênio:</Text>
          {formData.observacoes.map((obs: string, index: number) => (
            <Text key={index} style={styles.observacaoItem}>• {obs || ''}</Text>
          ))}
        </View>
      )}
    </View>
  );
};
