import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { ProductFormData, ProductCategory } from '@/types/products';
import ProductDataService from '@/services/ProductDataService';

export const useEnhancedCreateProduct = () => {
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

  const productService = ProductDataService.getInstance();

  // Carregar convênios disponíveis
  useEffect(() => {
    loadAvailableConvenios();
  }, []);

  const loadAvailableConvenios = async () => {
    try {
      // Aqui você carregaria os convênios disponíveis
      // const convenios = await productService.getAvailableConvenios();
      // setAvailableConvenios(convenios);
    } catch (error) {
      console.error('Erro ao carregar convênios:', error);
    }
  };

  const updateFormField = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (categoria: string) => {
    setFormData(prev => ({ 
      ...prev, 
      categoria: categoria as any,
      subtipo: '' // Reset subtipo quando categoria muda
    }));
  };

  const handleSubmit = async (onSuccess: () => void) => {
    if (!formData.categoria || !formData.subtipo || !formData.nome.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Aqui integraria com a API para salvar o produto
      
      Alert.alert(
        'Sucesso',
        'Produto cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: onSuccess
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = formData.categoria && formData.subtipo && formData.nome.trim();

  return {
    formData,
    availableConvenios,
    selectedConvenio,
    loading,
    canSubmit,
    updateFormField,
    handleCategorySelect,
    handleSubmit,
    setSelectedConvenio,
  };
};
