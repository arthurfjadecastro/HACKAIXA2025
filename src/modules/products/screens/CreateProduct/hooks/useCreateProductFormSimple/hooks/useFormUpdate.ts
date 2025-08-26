import { FormData, FieldName } from '../../../types';

interface UseFormUpdateReturn {
  updateFormField: (
    fieldName: FieldName,
    value: string | number | boolean | string[],
    setFormData: React.Dispatch<React.SetStateAction<FormData>>,
    onConvenioLoad: (convenioKey: string) => void,
    onHabitacaoLoad: () => void,
    onOutroLoad: () => void
  ) => void;
}

export const useFormUpdate = (): UseFormUpdateReturn => {
  const updateFormField = (
    fieldName: FieldName,
    value: string | number | boolean | string[],
    setFormData: React.Dispatch<React.SetStateAction<FormData>>,
    onConvenioLoad: (convenioKey: string) => void,
    onHabitacaoLoad: () => void,
    onOutroLoad: () => void
  ) => {
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      // Se está selecionando categoria CONSIGNADO, define automaticamente o normativo
      if (fieldName === 'categoria' && value === 'CONSIGNADO') {
        updatedData.normative = 'CO055 - Crédito Consignado';
      }
      
      // Se está selecionando categoria HABITACAO, define automaticamente o normativo e carrega dados SAC
      if (fieldName === 'categoria' && value === 'HABITACAO') {
        updatedData.normative = 'HH200 - Financiamento Habitacional';
        updatedData.subtipo = 'N/A'; // Habitação não precisa de subtipo
      }
      
      // Se está selecionando categoria OUTRO, define automaticamente o normativo e subtipo
      if (fieldName === 'categoria' && value === 'OUTRO') {
        updatedData.normative = 'GEN001 - Produtos Genéricos';
        updatedData.subtipo = 'N/A'; // OUTRO não precisa de subtipo
      }
      
      return updatedData;
    });
    
    // Se está selecionando um convênio específico, carrega os dados automaticamente
    if (fieldName === 'convenio_selected' && typeof value === 'string') {
      onConvenioLoad(value);
    }
    
    // Se está selecionando INSS como subtipo, carrega os dados automaticamente
    if (fieldName === 'subtipo' && value === 'INSS') {
      onConvenioLoad('inss');
    }
    
    // Se está selecionando habitação, carrega os dados automaticamente
    if (fieldName === 'categoria' && value === 'HABITACAO') {
      onHabitacaoLoad();
    }
    
    // Se está selecionando OUTRO, carrega o template automaticamente
    if (fieldName === 'categoria' && value === 'OUTRO') {
      onOutroLoad();
    }
  };

  return {
    updateFormField,
  };
};
