import { useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FormData, FieldName } from '../types';
import { useCreateProduct } from '@/hooks/useCreateProduct';
import { useProducts } from '@/hooks/useProducts';
import ProductDataService from '@/services/ProductDataService';

const initialFormData: FormData = {
  categoria: '',
  subtipo: '',
  name: '',
  interestRate: '',
  maxTerm: '',
  normative: '',
  observacoes: [],
  fonte_dados: 'Cadastro automático',
  // Valores padrão para campos de OUTRO
  prazo_min_meses: 1,
  prazo_max_meses: 420
};

interface UseSimpleFormReturn {
  formData: FormData;
  isLoading: boolean;
  isFormValid: boolean;
  updateField: (fieldName: FieldName, value: string | number | boolean | string[]) => void;
  handleSubmit: () => Promise<void>;
  scrollViewRef: React.RefObject<ScrollView | null>;
  isConvenioAlreadyRegistered: (convenioKey: string) => boolean;
  isHabitacaoAlreadyRegistered: () => boolean;
}

export const useCreateProductForm = (): UseSimpleFormReturn => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const { createProduct, loading: submitting } = useCreateProduct();
  const { products } = useProducts();
  const productService = ProductDataService.getInstance();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Função para verificar se um convênio já foi cadastrado
  const isConvenioAlreadyRegistered = (convenioKey: string): boolean => {
    return products.some(product => {
      // Verifica se o nome do produto contém o convênio específico
      const productName = product.name.toLowerCase();
      const searchKey = convenioKey.toLowerCase();
      
      // Mapeia os nomes para identificar convênios específicos
      const convenioMatches = {
        'inss': ['inss', 'aposentados', 'pensionistas'],
        'militar': ['militar', 'aeronáutica', 'comando'],
        'funcef': ['funcef'],
        'tjdft': ['tjdft', 'tribunal']
      };
      
      const searchTerms = convenioMatches[searchKey as keyof typeof convenioMatches] || [searchKey];
      return searchTerms.some(term => productName.includes(term));
    });
  };

  // Função para verificar se já existe produto de habitação cadastrado
  const isHabitacaoAlreadyRegistered = (): boolean => {
    return products.some(product => {
      const productName = product.name.toLowerCase();
      return productName.includes('habitação') || productName.includes('habitacao');
    });
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
      console.error('Erro ao carregar dados do convênio:', error);
    }
  };

  // Função para carregar dados de habitação (sempre SAC)
  const loadHabitacaoDataSimple = async () => {
    try {
      const habitacaoData = await productService.loadHabitacao('sac');
      
      if (habitacaoData) {
        setFormData(prev => ({
          ...prev,
          prazo_minimo: habitacaoData.prazo.minimoMeses,
          prazo_maximo: habitacaoData.prazo.maximoMeses,
          sistema_amortizacao: habitacaoData.sistema_amortizacao,
          ltv_max_percentual: habitacaoData.ltv_limites.financiamento_max_percentual,
          entrada_min_percentual: habitacaoData.ltv_limites.entrada_min_percentual,
          indexadores_permitidos: habitacaoData.indexadores_permitidos,
          seguros_obrigatorios: habitacaoData.seguros_obrigatorios,
          observacoes: habitacaoData.condicoes_gerais || [],
          fonte_dados: `Baseado em ${habitacaoData.nome_exibicao}`
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de habitação:', error);
    }
  };

  // Função para carregar template de produto OUTRO
  const loadOutroTemplateSimple = async () => {
    try {
      const outroData = await productService.loadOutroTemplate();
      
      if (outroData) {
        setFormData(prev => ({
          ...prev,
          subcategoria_outro: outroData.subcategoria,
          valor_min: outroData.limites.valor_min,
          valor_max: outroData.limites.valor_max,
          prazo_min_meses: outroData.limites.prazo_min_meses,
          prazo_max_meses: outroData.limites.prazo_max_meses,
          quantidade_min: outroData.limites.quantidade.min,
          quantidade_max: outroData.limites.quantidade.max,
          taxa_percentual: outroData.taxas_personalizadas.percentual,
          taxa_valor_fixo: outroData.taxas_personalizadas.valor_fixo,
          taxa_por_unidade: outroData.taxas_personalizadas.por_unidade,
          taxa_observacao: outroData.taxas_personalizadas.observacao,
          canais_selecionados: outroData.canais_permitidos,
          faixa_etaria_min: outroData.elegibilidade.faixa_etaria.min,
          faixa_etaria_max: outroData.elegibilidade.faixa_etaria.max,
          exige_validacao_remota_outro: outroData.operacao.exige_validacao_remota,
          exige_validacao_presencial_outro: outroData.operacao.exige_validacao_presencial,
          exige_certificacao_digital_outro: outroData.operacao.exige_certificacao_digital,
          observacoes: outroData.observacoes || [],
          fonte_dados: `Baseado em template ${outroData.nome_exibicao}`
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar template OUTRO:', error);
    }
  };

  const updateField = (fieldName: FieldName, value: string | number | boolean | string[]) => {
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      // Se está selecionando categoria CONSIGNADO, define automaticamente o normativo
      if (fieldName === 'categoria' && value === 'CONSIGNADO') {
        updatedData.normative = 'CO055 - Crédito Consignado';
      }
      
      // Se está selecionando categoria HABITACAO, define automaticamente o normativo e carrega dados SAC
      if (fieldName === 'categoria' && value === 'HABITACAO') {
        updatedData.normative = 'HH200 - Financiamento Habitacional';
        updatedData.subtipo = 'N/A'; // Habitação não precisa de subtipo
      }
      
      // Se está selecionando categoria OUTRO, define automaticamente o normativo e subtipo
      if (fieldName === 'categoria' && value === 'OUTRO') {
        updatedData.normative = 'GEN001 - Produtos Genéricos';
        updatedData.subtipo = 'N/A'; // OUTRO não precisa de subtipo
      }
      
      return updatedData;
    });
    
    // Se está selecionando um convênio específico, carrega os dados automaticamente
    if (fieldName === 'convenio_selected' && typeof value === 'string') {
      loadConvenioDataSimple(value);
    }
    
    // Se está selecionando INSS como subtipo, carrega os dados automaticamente
    if (fieldName === 'subtipo' && value === 'INSS') {
      loadConvenioDataSimple('inss');
    }
    
    // Se está selecionando habitação, carrega os dados automaticamente
    if (fieldName === 'categoria' && value === 'HABITACAO') {
      loadHabitacaoDataSimple();
    }
    
    // Se está selecionando OUTRO, carrega o template automaticamente
    if (fieldName === 'categoria' && value === 'OUTRO') {
      loadOutroTemplateSimple();
    }
  };

  const handleSubmit = async () => {
    try {
      let productName = '';
      
      if (formData.categoria === 'HABITACAO') {
        productName = 'Habitação';
      } else if (formData.categoria === 'OUTRO') {
        // Para OUTRO, usa o nome personalizado que o usuário digitou
        productName = formData.name || `OUTRO - ${formData.subcategoria_outro || 'Serviço Genérico'}`;
      } else {
        productName = `${formData.categoria} - ${formData.subtipo}${formData.convenio_selected ? ` - ${formData.convenio_selected}` : ''}`;
      }
      
      const productData: any = {
        name: productName,
        juros: formData.categoria === 'HABITACAO' ? 1.0 : 
               formData.categoria === 'OUTRO' ? (parseFloat(formData.interestRate) || 1.0) :
               (formData.taxa_faixa_a_concessao || 0),
        prazoMaximo: formData.categoria === 'OUTRO' ? (formData.prazo_max_meses || 0) : (formData.prazo_maximo || 0),
        normativo: formData.normative || '',
        categoria: formData.categoria,
        subtipo: formData.categoria === 'HABITACAO' ? 'SAC' : (formData.categoria === 'OUTRO' ? 'GENERICO' : formData.subtipo),
        configuracoes: formData
      };

      // Adiciona prazoMinimo apenas se for categoria OUTRO e valor válido
      if (formData.categoria === 'OUTRO' && formData.prazo_min_meses && formData.prazo_min_meses > 0) {
        productData.prazoMinimo = formData.prazo_min_meses;
      }

      await createProduct(productData);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  // Verifica se o formulário está válido
  const isFormValid = Boolean(
    formData.categoria && 
    (formData.categoria === 'HABITACAO' || // Habitação não precisa de subtipo
     (formData.categoria === 'OUTRO' && 
      formData.prazo_min_meses && formData.prazo_min_meses > 0 && 
      formData.prazo_max_meses && formData.prazo_max_meses > formData.prazo_min_meses) || // OUTRO precisa de prazos válidos
     (formData.subtipo && 
      (formData.subtipo !== 'CONVENIO' || formData.convenio_selected)))
  );

  return {
    formData,
    isLoading: submitting,
    isFormValid,
    updateField,
    handleSubmit,
    scrollViewRef,
    isConvenioAlreadyRegistered,
    isHabitacaoAlreadyRegistered,
  };
};
