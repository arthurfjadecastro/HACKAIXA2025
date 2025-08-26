import { FormData } from '../../../types';

export const validateForm = (formData: FormData): boolean => {
  // 1. Categoria deve estar selecionada
  if (!formData.categoria) return false;
  
  // 2. Validações específicas por categoria
  if (formData.categoria === 'HABITACAO') {
    // Habitação só precisa da categoria selecionada (dados carregados automaticamente)
    return true;
  }
  
  if (formData.categoria === 'CONSIGNADO') {
    // Consignado precisa de subtipo
    if (!formData.subtipo) return false;
    
    // Se subtipo é CONVENIO, precisa ter um convênio selecionado
    if (formData.subtipo === 'CONVENIO' && !formData.convenio_selected) return false;
    
    return true;
  }
  
  if (formData.categoria === 'OUTRO') {
    // Nome do produto é obrigatório (sem restrição de tamanho mínimo)
    if (!formData.name || formData.name.trim().length === 0) return false;
    
    // Taxa de juros deve ser válida (maior que 0)
    if (!formData.interestRate || parseFloat(formData.interestRate) <= 0) return false;
    
    // Prazos devem ser válidos
    if (!formData.prazo_min_meses || formData.prazo_min_meses <= 0) return false;
    if (!formData.prazo_max_meses || formData.prazo_max_meses <= 0) return false;
    
    // Prazo máximo deve ser maior que o mínimo
    if (formData.prazo_max_meses <= formData.prazo_min_meses) return false;
    
    // Prazo mínimo deve ser pelo menos 1 mês
    if (formData.prazo_min_meses < 1) return false;
    
    // Prazo máximo não pode exceder 420 meses (35 anos)
    if (formData.prazo_max_meses > 420) return false;
    
    return true;
  }
  
  return false;
};
