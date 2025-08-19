/**
 * Tipos base da aplicação de simulação de empréstimos
 * 
 * @description Definições TypeScript centralizadas para garantir type safety
 * e consistência em toda a aplicação
 */

// ========================================
// PRODUTO DE EMPRÉSTIMO
// ========================================

/**
 * Representa um produto de empréstimo cadastrado
 */
export interface LoanProduct {
  /** Identificador único do produto */
  id: string;
  
  /** Nome do produto (ex: "Crediário Pessoal") */
  name: string;
  
  /** Taxa de juros anual (ex: 0.12 para 12%) */
  annualRate: number;
  
  /** Prazo máximo em meses */
  maxTermMonths: number;
  
  /** Data de criação do produto */
  createdAt: Date;
  
  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Dados para criação de novo produto
 */
export interface CreateLoanProductInput {
  name: string;
  annualRate: number;
  maxTermMonths: number;
}

// ========================================
// SIMULAÇÃO DE EMPRÉSTIMO
// ========================================

/**
 * Parâmetros de entrada para simulação
 */
export interface SimulationInput {
  /** Valor principal do empréstimo */
  principalAmount: number;
  
  /** Taxa de juros anual */
  annualRate: number;
  
  /** Prazo em meses */
  termMonths: number;
  
  /** Sistema de amortização */
  amortizationSystem: AmortizationSystem;
}

/**
 * Resultado consolidado da simulação
 */
export interface SimulationResult {
  /** Parâmetros utilizados */
  input: SimulationInput;
  
  /** Valor da parcela mensal */
  monthlyPayment: number;
  
  /** Valor total a ser pago */
  totalAmount: number;
  
  /** Total de juros pagos */
  totalInterest: number;
  
  /** Tabela de amortização mês a mês */
  amortizationTable: AmortizationEntry[];
  
  /** Data da simulação */
  simulatedAt: Date;
}

/**
 * Entrada da tabela de amortização
 */
export interface AmortizationEntry {
  /** Número da parcela (1, 2, 3...) */
  installmentNumber: number;
  
  /** Saldo devedor no início do período */
  beginningBalance: number;
  
  /** Valor dos juros do período */
  interestAmount: number;
  
  /** Valor da amortização do período */
  principalAmount: number;
  
  /** Valor total da parcela */
  paymentAmount: number;
  
  /** Saldo devedor no final do período */
  endingBalance: number;
}

// ========================================
// SISTEMAS DE AMORTIZAÇÃO
// ========================================

/**
 * Sistemas de amortização suportados
 */
export enum AmortizationSystem {
  /** Sistema de Amortização Constante */
  SAC = 'SAC',
  
  /** Tabela Price (Sistema Francês) */
  PRICE = 'PRICE',
  
  /** Sistema Americano */
  AMERICAN = 'AMERICAN'
}

/**
 * Labels para exibição dos sistemas
 */
export const AmortizationSystemLabels: Record<AmortizationSystem, string> = {
  [AmortizationSystem.SAC]: 'SAC - Sistema de Amortização Constante',
  [AmortizationSystem.PRICE]: 'Price - Sistema Francês',
  [AmortizationSystem.AMERICAN]: 'Americano - Juros no Final'
};

// ========================================
// FORMULÁRIOS
// ========================================

/**
 * Estado de validação de campo
 */
export interface FieldValidation {
  /** Se o campo é válido */
  isValid: boolean;
  
  /** Mensagem de erro (se houver) */
  errorMessage?: string;
}

/**
 * Estado de formulário genérico
 */
export interface FormState<T> {
  /** Dados do formulário */
  data: T;
  
  /** Estado de validação por campo */
  validation: Record<keyof T, FieldValidation>;
  
  /** Se o formulário está sendo submetido */
  isSubmitting: boolean;
  
  /** Se o formulário foi submetido */
  isSubmitted: boolean;
}

// ========================================
// API & STORAGE
// ========================================

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T> {
  /** Dados retornados */
  data: T;
  
  /** Se a operação foi bem-sucedida */
  success: boolean;
  
  /** Mensagem de retorno */
  message?: string;
  
  /** Timestamp da resposta */
  timestamp: Date;
}

/**
 * Erro da API
 */
export interface ApiError {
  /** Código do erro */
  code: string;
  
  /** Mensagem de erro */
  message: string;
  
  /** Detalhes adicionais */
  details?: unknown;
}

// ========================================
// NAVEGAÇÃO
// ========================================

/**
 * Parâmetros das telas da aplicação
 */
export interface RootStackParamList {
  Home: undefined;
  ProductForm: { productId?: string };
  ProductList: undefined;
  Simulation: { productId?: string };
  SimulationResult: { result: SimulationResult };
}

// ========================================
// UTILITÁRIOS
// ========================================

/**
 * Tipo helper para tornar propriedades opcionais
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Tipo helper para tornar propriedades obrigatórias
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Tipo para valores monetários formatados
 */
export interface FormattedCurrency {
  /** Valor numérico original */
  value: number;
  
  /** String formatada para exibição */
  formatted: string;
  
  /** Símbolo da moeda */
  symbol: string;
}

/**
 * Tipo para valores percentuais formatados
 */
export interface FormattedPercentage {
  /** Valor decimal original (0.12 para 12%) */
  value: number;
  
  /** String formatada para exibição */
  formatted: string;
  
  /** Símbolo de porcentagem */
  symbol: string;
}
