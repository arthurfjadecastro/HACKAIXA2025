import ProductDataService from '@/services/products/data';
import { FormData } from '../../../types';

interface UseDataLoadingReturn {
  loadConvenioData: (convenioKey: string, setFormData: React.Dispatch<React.SetStateAction<FormData>>) => Promise<void>;
  loadHabitacaoData: (setFormData: React.Dispatch<React.SetStateAction<FormData>>) => Promise<void>;
  loadOutroTemplate: (setFormData: React.Dispatch<React.SetStateAction<FormData>>) => Promise<void>;
}

export const useDataLoading = (): UseDataLoadingReturn => {
  const productService = ProductDataService.getInstance();

  // Função simplificada para carregar convênio diretamente
  const loadConvenioData = async (
    convenioKey: string,
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
  ) => {
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
      // Silent error handling as in original
    }
  };

  // Função para carregar dados de habitação (sempre SAC)
  const loadHabitacaoData = async (
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
  ) => {
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
      // Silent error handling as in original
    }
  };

  // Função para carregar template de produto OUTRO
  const loadOutroTemplate = async (
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
  ) => {
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
          taxa_percentual: outroData.taxas_personalizadas?.percentual,
          taxa_valor_fixo: outroData.taxas_personalizadas?.valor_fixo,
          taxa_por_unidade: outroData.taxas_personalizadas?.por_unidade,
          taxa_observacao: outroData.taxas_personalizadas?.observacao,
          canais_selecionados: outroData.canais_permitidos,
          faixa_etaria_min: outroData.elegibilidade?.faixa_etaria?.min,
          faixa_etaria_max: outroData.elegibilidade?.faixa_etaria?.max,
          observacoes: outroData.observacoes || [],
          fonte_dados: `Baseado em template ${outroData.nome_exibicao}`
        }));
      }
    } catch (error) {
      // Silent error handling as in original
    }
  };

  return {
    loadConvenioData,
    loadHabitacaoData,
    loadOutroTemplate,
  };
};
