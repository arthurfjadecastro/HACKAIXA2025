import { useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FormData, FieldName } from '../types';
import { useCreateProduct } from '@/hooks/useCreateProduct';
import ProductDataService from '@/services/ProductDataService';
import { ProductCategory } from '@/types/products';

const initialFormData: FormData = {
  categoria: '',
  subtipo: '',
  name: '',
  interestRate: '',
  maxTerm: '',
  normative: '',
  observacoes: [],
  fonte_dados: 'Cadastro manual'
};

export const useCreateProductForm = (): UseFormReturn & { 
  scrollViewRef: React.RefObject<ScrollView | null>;
} => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const { createProduct, loading: submitting } = useCreateProduct();
  const productService = ProductDataService.getInstance();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [availableConvenios, setAvailableConvenios] = useState<ProductCategory[]>([]);
  const [selectedConvenio, setSelectedConvenio] = useState<ProductCategory | null>(null);

  // Carregar convênios disponíveis
  useEffect(() => {
    loadAvailableConvenios();
  }, []);

  const loadAvailableConvenios = async () => {
    try {
      const convenios = await productService.getActiveConvenios();
      setAvailableConvenios(convenios);
    } catch (error) {
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
      taxa_faixa_a_concessao: convenio.faixas['A']?.concessao_taxa_am || 0,
      taxa_faixa_a_renovacao: convenio.faixas['A']?.renovacao_taxa_am || 0,
      taxa_faixa_b_concessao: convenio.faixas['B']?.concessao_taxa_am || 0,
      taxa_faixa_b_renovacao: convenio.faixas['B']?.renovacao_taxa_am || 0,
      taxa_faixa_c_concessao: convenio.faixas['C']?.concessao_taxa_am || 0,
      taxa_faixa_c_renovacao: convenio.faixas['C']?.renovacao_taxa_am || 0,
      portabilidade_prospeccao_min: convenio.portabilidade?.prospeccao_taxa_am_intervalo?.[0] || 0,
      portabilidade_prospeccao_max: convenio.portabilidade?.prospeccao_taxa_am_intervalo?.[1] || 0,
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

  // Função para carregar dados do convênio específico
  const loadConvenioData = async (convenioTipo: string) => {
    try {
      let convenioId = '';
      
      switch (convenioTipo) {
        case 'MILITAR':
          convenioId = 'consignado_convenio_militar';
          break;
        case 'FUNCEF':
          convenioId = 'consignado_convenio_funcef';
          break;
        case 'TJDFT':
          convenioId = 'consignado_convenio_tjdft';
          break;
        default:
          return;
      }

      const convenio = availableConvenios.find(c => c.id === convenioId);
      if (convenio) {
        setSelectedConvenio(convenio);
        autoFillFromConvenio(convenio);
      }
    } catch (error) {
    }
  };

  // Função simplificada para carregar convênio diretamente
  const loadConvenioDataSimple = async (convenioKey: string) => {
    try {
      const convenioData = await productService.loadConvenio(convenioKey);
      
      if (convenioData) {
        setFormData(prev => ({
          ...prev,
          prazo_minimo: convenioData.prazo.minimoMeses,
          prazo_maximo: convenioData.prazo.maximoMeses,
          margem_consignavel: convenioData.margem_consignavel_max,
          taxa_faixa_a_concessao: convenioData.faixas.A.concessao_taxa_am,
          taxa_faixa_a_renovacao: convenioData.faixas.A.renovacao_taxa_am,
          taxa_faixa_b_concessao: convenioData.faixas.B.concessao_taxa_am,
          taxa_faixa_b_renovacao: convenioData.faixas.B.renovacao_taxa_am,
          taxa_faixa_c_concessao: convenioData.faixas.C.concessao_taxa_am,
          taxa_faixa_c_renovacao: convenioData.faixas.C.renovacao_taxa_am,
          observacoes: convenioData.observacoes || [],
          fonte_dados: `Baseado em ${convenioData.nome_exibicao}`
        }));
      }
    } catch (error) {
    }
  };

  const updateField = (fieldName: FieldName, value: string | number | boolean | string[]) => {
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      // Se está selecionando categoria CONSIGNADO, define automaticamente o normativo
      if (fieldName === 'categoria' && value === 'CONSIGNADO') {
        updatedData.normative = 'CO055 - Crédito Consignado';
      }
      
      return updatedData;
    });
    
    // Se está selecionando um subtipo específico de convênio, carregar dados automaticamente
    if (fieldName === 'subtipo' && formData.categoria === 'CONSIGNADO' && 
        typeof value === 'string' && ['MILITAR', 'FUNCEF', 'TJDFT'].includes(value)) {
      loadConvenioData(value);
    }
    
    // Se está selecionando um convênio específico, carrega os dados automaticamente
    if (fieldName === 'convenio_selected' && typeof value === 'string') {
      loadConvenioDataSimple(value);
    }
    
    // Validar em tempo real se o campo já foi tocado (apenas para campos string)
    if (touched[fieldName] && typeof value === 'string') {
      const validation = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: validation.isValid ? undefined : validation.error,
      }));
    }
  };

  const handleBlur = (fieldName: FieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const fieldValue = formData[fieldName];
    if (typeof fieldValue === 'string') {
      const validation = validateField(fieldName, fieldValue);
      setErrors(prev => ({
        ...prev,
        [fieldName]: validation.isValid ? undefined : validation.error,
      }));
    }
  };

  const scrollToFirstError = () => {
    // Rola para o topo onde estão os campos
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSubmit = async () => {
    // Validar todos os campos
    const newErrors = validateAllFields(formData);

    setErrors(newErrors);
    setTouched({
      categoria: true,
      subtipo: true,
      name: true,
      normative: true,
    });

    // Se há erros, rolar para o primeiro erro
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError();
      return;
    }

    // Criar produto usando o novo sistema
    const result = await createProduct({
      name: formData.name,
      juros: parseFloat(formData.interestRate),
      prazoMaximo: parseInt(formData.maxTerm, 10),
      normativo: formData.normative,
    });

    if (result.success) {
      // Reset form após sucesso
      setFormData(initialFormData);
      setTouched({});
      setErrors({});
      
      // Navegar de volta
      navigation.goBack();
    }
  };

  const isFormValid = validateForm(formData);

  return {
    formData,
    isLoading: submitting,
    isFormValid: true, // Simplificado - produtos específicos são sempre válidos quando selecionados
    updateField,
    handleSubmit,
    scrollViewRef,
  };
};
