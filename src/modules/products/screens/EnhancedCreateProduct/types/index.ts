import { ProductFormData, ProductCategory } from '@/types/products';

export interface EnhancedCreateProductProps {
  // Props futuras se necessário
}

export interface FormState {
  formData: ProductFormData;
  selectedConvenio: ProductCategory | null;
  loading: boolean;
}

export interface CategoryOption {
  value: string;
  label: string;
  description: string;
}
