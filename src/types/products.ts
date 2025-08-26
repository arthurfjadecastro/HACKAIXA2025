// Tipos para os dados de produtos JSON
export interface ProductCategory {
  id: string;
  categoria: 'CONSIGNADO' | 'HABITACAO';
  subtipo: 'INSS' | 'CONVENIO' | 'CLT_SUSPENSO' | 'N/A';
  nome_exibicao: string;
  status_contratacao: 'ATIVO' | 'SUSPENSO' | 'EM_BREVE';
  prazo: {
    minimoMeses: number;
    maximoMeses: number;
  };
  margem_consignavel_max: number | null;
  canais_permitidos: string[];
  exige_validacao: {
    remota: boolean | null;
    presencial: boolean | null;
    certificacao_digital: boolean | null;
  };
  faixas: {
    [key: string]: {
      concessao_taxa_am: number;
      renovacao_taxa_am: number;
      condicoes_acesso: string[];
    };
  };
  observacoes: string[];
}

export interface ProductIndex {
  version: string;
  itens: {
    id: string;
    path: string;
  }[];
}

// Tipos para formulário de criação de produto
export interface ProductFormData {
  // Seleção de categoria/subtipo
  categoria: 'CONSIGNADO' | 'HABITACAO' | '';
  subtipo: 'INSS' | 'CONVENIO' | 'CLT_SUSPENSO' | 'N/A' | '';
  convenio_id?: string; // Para convênios específicos
  
  // Campos básicos
  nome: string;
  descricao?: string;
  
  // Campos dinâmicos preenchidos automaticamente
  prazo_minimo: number;
  prazo_maximo: number;
  margem_consignavel: number;
  canais_permitidos: string[];
  
  // Taxas por faixa (preenchidas automaticamente)
  taxa_faixa_a_concessao: number;
  taxa_faixa_a_renovacao: number;
  taxa_faixa_b_concessao: number;
  taxa_faixa_b_renovacao: number;
  taxa_faixa_c_concessao: number;
  taxa_faixa_c_renovacao: number;
  
  // Validações
  exige_validacao_remota: boolean;
  exige_validacao_presencial: boolean;
  exige_certificacao_digital: boolean;
  
  // Observações específicas do convênio
  observacoes: string[];
}
