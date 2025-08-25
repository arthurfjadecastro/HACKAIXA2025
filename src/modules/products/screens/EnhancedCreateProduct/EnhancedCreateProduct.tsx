import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStack';
import { Ionicons } from '@expo/vector-icons';

import { Text, Button, TextInput } from '@/design-system/components';
import { ProductFormData, ProductCategory } from '@/types/products';
import ProductDataService from '@/services/ProductDataService';

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

const EnhancedCreateProduct: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const productService = ProductDataService.getInstance();

  const [formData, setFormData] = useState<ProductFormData>({
    categoria: '',
    subtipo: '',
    nome: '',
    descricao: '',
    prazo_minimo: 1,
    prazo_maximo: 96,
    margem_consignavel: 35,
    canais_permitidos: [],
    taxa_faixa_a_concessao: 0,
    taxa_faixa_a_renovacao: 0,
    taxa_faixa_b_concessao: 0,
    taxa_faixa_b_renovacao: 0,
    taxa_faixa_c_concessao: 0,
    taxa_faixa_c_renovacao: 0,
    exige_validacao_remota: true,
    exige_validacao_presencial: false,
    exige_certificacao_digital: false,
    observacoes: [],
    data_atualizacao: new Date().toISOString(),
    fonte_dados: 'Cadastro manual'
  });

  const [availableConvenios, setAvailableConvenios] = useState<ProductCategory[]>([]);
  const [selectedConvenio, setSelectedConvenio] = useState<ProductCategory | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar convênios disponíveis
  useEffect(() => {
    loadAvailableConvenios();
  }, []);

  const loadAvailableConvenios = async () => {
    try {
      const convenios = await productService.getActiveConvenios();
      setAvailableConvenios(convenios);
    } catch (error) {
      console.error('Erro ao carregar convênios:', error);
    }
  };

  // Preencher campos automaticamente baseado na seleção
  useEffect(() => {
    if (formData.categoria === 'CONSIGNADO' && formData.subtipo === 'CONVENIO' && selectedConvenio) {
      autoFillFromConvenio(selectedConvenio);
    } else if (formData.categoria === 'CONSIGNADO' && formData.subtipo === 'INSS') {
      autoFillINSS();
    } else if (formData.categoria === 'CONSIGNADO' && formData.subtipo === 'CLT_SUSPENSO') {
      autoFillCLTSuspenso();
    } else if (formData.categoria === 'HABITACAO') {
      autoFillHabitacao();
    }
  }, [formData.categoria, formData.subtipo, selectedConvenio]);

  const autoFillFromConvenio = (convenio: ProductCategory) => {
    setFormData(prev => ({
      ...prev,
      prazo_minimo: convenio.prazo.minimoMeses,
      prazo_maximo: convenio.prazo.maximoMeses,
      margem_consignavel: convenio.margem_consignavel_max || 30,
      canais_permitidos: convenio.canais_permitidos,
      taxa_faixa_a_concessao: convenio.faixas.A?.concessao_taxa_am || 0,
      taxa_faixa_a_renovacao: convenio.faixas.A?.renovacao_taxa_am || 0,
      taxa_faixa_b_concessao: convenio.faixas.B?.concessao_taxa_am || 0,
      taxa_faixa_b_renovacao: convenio.faixas.B?.renovacao_taxa_am || 0,
      taxa_faixa_c_concessao: convenio.faixas.C?.concessao_taxa_am || 0,
      taxa_faixa_c_renovacao: convenio.faixas.C?.renovacao_taxa_am || 0,
      portabilidade_prospeccao_min: convenio.portabilidade?.prospeccao_taxa_am_intervalo?.[0],
      portabilidade_prospeccao_max: convenio.portabilidade?.prospeccao_taxa_am_intervalo?.[1],
      exige_validacao_remota: convenio.exige_validacao.remota || false,
      exige_validacao_presencial: convenio.exige_validacao.presencial || false,
      exige_certificacao_digital: convenio.exige_validacao.certificacao_digital || false,
      observacoes: convenio.observacoes,
      fonte_dados: `Baseado em ${convenio.nome_exibicao} - ${convenio.auditoria.fonte}`
    }));
  };

  const autoFillINSS = () => {
    setFormData(prev => ({
      ...prev,
      prazo_minimo: 1,
      prazo_maximo: 96,
      margem_consignavel: 35,
      canais_permitidos: ['AGENCIA', 'AG_DIGITAL', 'AUTOSERVICO_ATM_IBC_MBC', 'LOTERICA'],
      taxa_faixa_a_concessao: 1.55,
      taxa_faixa_a_renovacao: 1.55,
      taxa_faixa_b_concessao: 1.58,
      taxa_faixa_b_renovacao: 1.61,
      taxa_faixa_c_concessao: 1.66,
      taxa_faixa_c_renovacao: 1.75,
      portabilidade_prospeccao_min: 1.36,
      portabilidade_prospeccao_max: 1.42,
      exige_validacao_remota: true,
      exige_validacao_presencial: false,
      exige_certificacao_digital: false,
      observacoes: [
        'Respeitar margem disponível do benefício.',
        'Validar extrato de benefício/contracheque antes da simulação.'
      ],
      fonte_dados: 'Tabela INSS padrão'
    }));
  };

  const autoFillCLTSuspenso = () => {
    setFormData(prev => ({
      ...prev,
      prazo_minimo: 0,
      prazo_maximo: 0,
      margem_consignavel: 0,
      canais_permitidos: [],
      taxa_faixa_a_concessao: 0,
      taxa_faixa_a_renovacao: 0,
      taxa_faixa_b_concessao: 0,
      taxa_faixa_b_renovacao: 0,
      taxa_faixa_c_concessao: 0,
      taxa_faixa_c_renovacao: 0,
      exige_validacao_remota: false,
      exige_validacao_presencial: false,
      exige_certificacao_digital: false,
      observacoes: [
        'Suspenso conforme MP 1292 – consignado celetista.',
        'Bloquear jornada de contratação e exibir mensagem orientativa.'
      ],
      fonte_dados: 'MP/Comunicado interno'
    }));
  };

  const autoFillHabitacao = () => {
    setFormData(prev => ({
      ...prev,
      prazo_minimo: 0,
      prazo_maximo: 0,
      margem_consignavel: 0,
      canais_permitidos: ['AGENCIA', 'AG_DIGITAL'],
      taxa_faixa_a_concessao: 0,
      taxa_faixa_a_renovacao: 0,
      taxa_faixa_b_concessao: 0,
      taxa_faixa_b_renovacao: 0,
      taxa_faixa_c_concessao: 0,
      taxa_faixa_c_renovacao: 0,
      exige_validacao_remota: false,
      exige_validacao_presencial: false,
      exige_certificacao_digital: false,
      observacoes: [
        'Categoria habilitada para cadastro de rascunhos.',
        'Simulação será liberada em breve.'
      ],
      fonte_dados: 'Roadmap produto'
    }));
  };

  const handleSubmit = async () => {
    if (!formData.categoria || !formData.subtipo || !formData.nome.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Aqui integraria com a API para salvar o produto
      console.log('Dados do produto:', formData);
      
      Alert.alert(
        'Sucesso',
        'Produto cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoriaSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categoria do Produto</Text>
      <Text style={styles.sectionDescription}>
        Selecione a categoria principal do produto financeiro
      </Text>
      
      <View style={styles.radioGroup}>
        {[
          { value: 'CONSIGNADO', label: 'Consignado', description: 'Empréstimos com desconto em folha' },
          { value: 'HABITACAO', label: 'Habitação', description: 'Financiamentos imobiliários (em breve)' }
        ].map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioOption,
              formData.categoria === option.value && styles.radioOptionSelected
            ]}
            onPress={() => setFormData(prev => ({ 
              ...prev, 
              categoria: option.value as any,
              subtipo: '' // Reset subtipo
            }))}
          >
            <View style={styles.radioButton}>
              {formData.categoria === option.value && (
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

  const renderSubtipoSelector = () => {
    if (formData.categoria !== 'CONSIGNADO') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subtipo Consignado</Text>
        <Text style={styles.sectionDescription}>
          Escolha o tipo específico de consignado
        </Text>
        
        <View style={styles.radioGroup}>
          {[
            { value: 'INSS', label: 'INSS', description: 'Aposentados e pensionistas do INSS' },
            { value: 'CONVENIO', label: 'Convênio', description: 'Servidores públicos e militares' },
            { value: 'CLT_SUSPENSO', label: 'CLT (Suspenso)', description: 'Funcionários CLT - atualmente suspenso' }
          ].map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.radioOption,
                formData.subtipo === option.value && styles.radioOptionSelected,
                option.value === 'CLT_SUSPENSO' && styles.radioOptionDisabled
              ]}
              onPress={() => setFormData(prev => ({ 
                ...prev, 
                subtipo: option.value as any,
                convenio_id: undefined // Reset convênio
              }))}
              disabled={option.value === 'CLT_SUSPENSO'}
            >
              <View style={styles.radioButton}>
                {formData.subtipo === option.value && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <View style={styles.radioContent}>
                <Text style={[
                  styles.radioLabel,
                  option.value === 'CLT_SUSPENSO' && styles.radioLabelDisabled
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.radioDescription,
                  option.value === 'CLT_SUSPENSO' && styles.radioDescriptionDisabled
                ]}>
                  {option.description}
                </Text>
              </View>
              {option.value === 'CLT_SUSPENSO' && (
                <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderConvenioSelector = () => {
    if (formData.subtipo !== 'CONVENIO') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Convênio Específico</Text>
        <Text style={styles.sectionDescription}>
          Selecione o convênio para preencher automaticamente as configurações
        </Text>
        
        <View style={styles.radioGroup}>
          {availableConvenios.map(convenio => (
            <TouchableOpacity
              key={convenio.id}
              style={[
                styles.radioOption,
                selectedConvenio?.id === convenio.id && styles.radioOptionSelected
              ]}
              onPress={() => {
                setSelectedConvenio(convenio);
                setFormData(prev => ({ ...prev, convenio_id: convenio.id }));
              }}
            >
              <View style={styles.radioButton}>
                {selectedConvenio?.id === convenio.id && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <View style={styles.radioContent}>
                <Text style={styles.radioLabel}>{convenio.nome_exibicao}</Text>
                <Text style={styles.radioDescription}>
                  Margem: {convenio.margem_consignavel_max}% | 
                  Prazo: até {convenio.prazo.maximoMeses} meses
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#005CA9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Produto</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {renderCategoriaSelector()}
        {renderSubtipoSelector()}
        {renderConvenioSelector()}

        {/* Campos básicos */}
        {formData.categoria && formData.subtipo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            
            <TextInput
              label="Nome do Produto *"
              value={formData.nome}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
              placeholder="Ex: INSS Premium, Militar Gold"
              style={styles.input}
            />

            <TextInput
              label="Descrição"
              value={formData.descricao || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, descricao: text }))}
              placeholder="Descrição opcional do produto"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </View>
        )}

        {/* Campos preenchidos automaticamente */}
        {formData.categoria && formData.subtipo && formData.categoria !== 'HABITACAO' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Configurações Automáticas
              <Text style={styles.autoFilledBadge}> (Preenchido automaticamente)</Text>
            </Text>
            
            <View style={styles.autoFilledContainer}>
              <View style={styles.autoFilledRow}>
                <Text style={styles.autoFilledLabel}>Prazo:</Text>
                <Text style={styles.autoFilledValue}>
                  {formData.prazo_minimo} - {formData.prazo_maximo} meses
                </Text>
              </View>
              
              <View style={styles.autoFilledRow}>
                <Text style={styles.autoFilledLabel}>Margem Consignável:</Text>
                <Text style={styles.autoFilledValue}>{formData.margem_consignavel}%</Text>
              </View>
              
              <View style={styles.autoFilledRow}>
                <Text style={styles.autoFilledLabel}>Canais:</Text>
                <Text style={styles.autoFilledValue}>
                  {formData.canais_permitidos.length} canais configurados
                </Text>
              </View>

              <View style={styles.autoFilledRow}>
                <Text style={styles.autoFilledLabel}>Taxa Faixa A:</Text>
                <Text style={styles.autoFilledValue}>
                  {formData.taxa_faixa_a_concessao}% / {formData.taxa_faixa_a_renovacao}%
                </Text>
              </View>

              <View style={styles.autoFilledRow}>
                <Text style={styles.autoFilledLabel}>Taxa Faixa B:</Text>
                <Text style={styles.autoFilledValue}>
                  {formData.taxa_faixa_b_concessao}% / {formData.taxa_faixa_b_renovacao}%
                </Text>
              </View>

              <View style={styles.autoFilledRow}>
                <Text style={styles.autoFilledLabel}>Taxa Faixa C:</Text>
                <Text style={styles.autoFilledValue}>
                  {formData.taxa_faixa_c_concessao}% / {formData.taxa_faixa_c_renovacao}%
                </Text>
              </View>
            </View>

            {formData.observacoes.length > 0 && (
              <View style={styles.observacoesContainer}>
                <Text style={styles.observacoesTitle}>Observações do Convênio:</Text>
                {formData.observacoes.map((obs, index) => (
                  <Text key={index} style={styles.observacaoItem}>• {obs}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Botão de salvar */}
        {formData.categoria && formData.subtipo && formData.nome.trim() && (
          <View style={styles.footer}>
            <Button
              title={loading ? "Salvando..." : "Cadastrar Produto"}
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submitButton}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F4F8FB', // Mudado para manter consistência
    // Removido borderBottomWidth e borderBottomColor para consistência
  },
  backButton: {
    padding: 8, // Mantido em 8
    marginLeft: -8, // Adiciona margem negativa para ficar mais à esquerda
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 16,
  },
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
  radioDescriptionDisabled: {
    color: '#D1D5DB',
  },
  input: {
    marginBottom: 16,
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
  footer: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#005CA9',
  },
});

export default EnhancedCreateProduct;
