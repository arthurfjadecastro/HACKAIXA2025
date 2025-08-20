// ========================================
// FORMULÁRIOS
// ========================================

export interface FieldValidation {
  isValid: boolean;
  errorMessage?: string;
}

export interface FormState<T> {
  data: T;
  validation: Record<keyof T, FieldValidation>;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

// ========================================
// API & STORAGE
// ========================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// ========================================
// NAVEGAÇÃO
// ========================================

export interface RootStackParamList {
  Home: undefined;
  ProductList: undefined;
  ProductSimulator: { productId?: string };
}

// ========================================
// UTILITÁRIOS
// ========================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface FormattedCurrency {
  value: number;
  formatted: string;
  symbol: string;
}

export interface FormattedPercentage {
  value: number;
  formatted: string;
  symbol: string;
}
