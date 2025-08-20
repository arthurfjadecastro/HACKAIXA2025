export interface FormData {
  name: string;
  interestRate: string;
  maxTerm: string;
  normative: string;
}

export interface FormErrors {
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
  updateField: (fieldName: FieldName, value: string) => void;
  handleBlur: (fieldName: FieldName) => void;
  handleSubmit: () => Promise<void>;
  scrollToFirstError: () => void;
}
