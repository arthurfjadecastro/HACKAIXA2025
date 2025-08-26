export interface FormData {
  // Seleção de categoria/subtipo
  categoria: 'CONSIGNADO' | 'HABITACAO' | 'OUTRO' | '';
  subtipo: 'INSS' | 'CONVENIO' | 'CLT_SUSPENSO' | 'N/A' | '';
  convenio_id?: string;
  convenio_selected?: string; // Para seleção simplificada (militar, funcef, tjdft)
  
  // Campos originais
  name: string;
  interestRate: string;
  maxTerm: string;
  normative: string;
  
  // Campos preenchidos automaticamente - Consignado
  prazo_minimo?: number;
  prazo_maximo?: number;
  margem_consignavel?: number;
  canais_permitidos?: string[];
  taxa_faixa_a_concessao?: number;
  taxa_faixa_a_renovacao?: number;
  taxa_faixa_b_concessao?: number;
  taxa_faixa_b_renovacao?: number;
  taxa_faixa_c_concessao?: number;
  taxa_faixa_c_renovacao?: number;
  portabilidade_prospeccao_min?: number;
  portabilidade_prospeccao_max?: number;
  exige_validacao_remota?: boolean;
  exige_validacao_presencial?: boolean;
  exige_certificacao_digital?: boolean;
  
  // Campos específicos de Habitação
  sistema_amortizacao?: 'SAC' | 'PRICE' | '';
  ltv_max_percentual?: number;
  entrada_min_percentual?: number;
  indexadores_permitidos?: Array<{id: string, descricao: string}>;
  seguros_obrigatorios?: Array<{id: string, descricao: string}>;
  
  // Campos específicos de OUTRO
  subcategoria_outro?: string;
  valor_min?: number;
  valor_max?: number;
  prazo_min_meses?: number;
  prazo_max_meses?: number;
  quantidade_min?: number;
  quantidade_max?: number;
  taxa_percentual?: number;
  taxa_valor_fixo?: number;
  taxa_por_unidade?: number;
  taxa_observacao?: string;
  canais_selecionados?: string[];
  faixa_etaria_min?: number;
  faixa_etaria_max?: number;
  
  // Campos comuns
  observacoes?: string[];
  fonte_dados?: string;
}

export interface FormErrors {
  categoria?: string;
  subtipo?: string;
  convenio_id?: string;
  name?: string;
  interestRate?: string;
  maxTerm?: string;
  normative?: string;
}

export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

export type FieldName = keyof FormData;

export interface UseFormReturn {
  formData: FormData;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isLoading: boolean;
  isFormValid: boolean;
  updateField: (fieldName: FieldName, value: string | number | boolean | string[]) => void;
  handleBlur: (fieldName: FieldName) => void;
  handleSubmit: () => Promise<void>;
  scrollToFirstError: () => void;
}
