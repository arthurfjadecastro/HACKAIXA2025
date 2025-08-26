import { useNavigation } from '@react-navigation/native';
import { useCreateProduct } from '../../../../../hooks';
import { FormData } from '../../../types';

interface UseFormSubmissionReturn {
  handleSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export const useFormSubmission = (): UseFormSubmissionReturn => {
  const navigation = useNavigation();
  const { createProduct, loading } = useCreateProduct();

  const handleSubmit = async (formData: FormData) => {
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
      // Error handling is done inside createProduct hook
    }
  };

  return {
    handleSubmit,
    isLoading: loading,
  };
};
