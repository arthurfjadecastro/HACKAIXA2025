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
  fonte_dados: 'Cadastro automático'
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
  };

  const handleSubmit = async () => {
    try {
      let productName = '';
      
      if (formData.categoria === 'HABITACAO') {
        productName = 'HABITACAO - SAC';
      } else {
        productName = `${formData.categoria} - ${formData.subtipo}${formData.convenio_selected ? ` - ${formData.convenio_selected}` : ''}`;
      }
      
      const productData = {
        name: productName,
        juros: formData.categoria === 'HABITACAO' ? 1.0 : (formData.taxa_faixa_a_concessao || 0),
        prazoMaximo: formData.prazo_maximo || 0,
        normativo: formData.normative || '',
        categoria: formData.categoria,
        subtipo: formData.categoria === 'HABITACAO' ? 'SAC' : formData.subtipo,
        configuracoes: formData
      };

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
