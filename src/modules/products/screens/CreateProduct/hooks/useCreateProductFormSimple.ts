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

  const updateField = (fieldName: FieldName, value: string | number | boolean | string[]) => {
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      // Se está selecionando categoria CONSIGNADO, define automaticamente o normativo
      if (fieldName === 'categoria' && value === 'CONSIGNADO') {
        updatedData.normative = 'CO055 - Crédito Consignado';
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
  };

  const handleSubmit = async () => {
    try {
      const productData = {
        name: `${formData.categoria} - ${formData.subtipo}${formData.convenio_selected ? ` - ${formData.convenio_selected}` : ''}`,
        juros: formData.taxa_faixa_a_concessao || 0,
        prazoMaximo: formData.prazo_maximo || 0,
        normativo: formData.normative || '',
        categoria: formData.categoria,
        subtipo: formData.subtipo,
        configuracoes: formData
      };

      await createProduct(productData);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  // Verifica se o formulário está válido (categoria e subtipo selecionados)
  const isFormValid = Boolean(
    formData.categoria && 
    formData.subtipo && 
    (formData.subtipo !== 'CONVENIO' || formData.convenio_selected)
  );

  return {
    formData,
    isLoading: submitting,
    isFormValid,
    updateField,
    handleSubmit,
    scrollViewRef,
    isConvenioAlreadyRegistered,
  };
};
