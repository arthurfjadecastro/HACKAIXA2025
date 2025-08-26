import { FormData, FieldName } from '../../../types';

export interface CreateProductFormProps {
  formData: FormData;
  updateField: (fieldName: FieldName, value: string | number | boolean | string[]) => void;
  isConvenioAlreadyRegistered: (convenioKey: string) => boolean;
  isHabitacaoAlreadyRegistered: () => boolean;
}

export interface CategoryOption {
  value: string;
  label: string;
  description: string;
  disabled?: boolean;
}
