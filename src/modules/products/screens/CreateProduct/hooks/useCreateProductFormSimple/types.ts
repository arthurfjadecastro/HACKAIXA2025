import { ScrollView } from 'react-native';
import { FormData, FieldName } from '../../types';

export interface UseSimpleFormReturn {
  formData: FormData;
  isLoading: boolean;
  isFormValid: boolean;
  updateField: (fieldName: FieldName, value: string | number | boolean | string[]) => void;
  handleSubmit: () => Promise<void>;
  scrollViewRef: React.RefObject<ScrollView | null>;
  isConvenioAlreadyRegistered: (convenioKey: string) => boolean;
  isHabitacaoAlreadyRegistered: () => boolean;
}

export interface ConvenioMatches {
  [key: string]: string[];
  inss: string[];
  militar: string[];
  funcef: string[];
  tjdft: string[];
}

export const CONVENIO_MATCHES: ConvenioMatches = {
  'inss': ['inss', 'aposentados', 'pensionistas'],
  'militar': ['militar', 'aeronáutica', 'comando'],
  'funcef': ['funcef'],
  'tjdft': ['tjdft', 'tribunal']
};

export const INITIAL_FORM_DATA: FormData = {
  categoria: '',
  subtipo: '',
  name: '',
  interestRate: '',
  maxTerm: '',
  normative: '',
  observacoes: [],
  fonte_dados: 'Cadastro automático',
  // Valores padrão para campos de OUTRO
  prazo_min_meses: 1,
  prazo_max_meses: 420
};
