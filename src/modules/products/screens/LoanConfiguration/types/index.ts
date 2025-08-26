export interface QuoteData {
  installment: number;
  total: number;
  rate: number;
}

export interface ProductData {
  maxMonths: number;
  minMonths: number;
  rateAm: number;
}

export interface ValidationState {
  showWarning: boolean;
  timeout: NodeJS.Timeout | null;
}

export interface LoanConfigurationProps {
  productId: string;
  amount: string;
}

export interface InstallmentSelectorProps {
  months: number;
  inputValue: string;
  productMinMonths: number;
  productMaxMonths: number;
  showValidationWarning: boolean;
  onMonthsChange: (value: string) => void;
  onDecrease: () => void;
  onIncrease: () => void;
}

export interface AmountSummaryProps {
  amount: string;
  onEdit: () => void;
}

export interface InstallmentValueProps {
  quote: QuoteData | null;
}

export interface FinancialSummaryProps {
  quote: QuoteData | null;
  productRateAm: number;
}

export interface LoanHeaderProps {
  onBackPress: () => void;
}
