import { Product } from '@/services/products/productTypes';
import { CONVENIO_MATCHES } from '../types';

export const isConvenioAlreadyRegistered = (convenioKey: string, products: Product[]): boolean => {
  return products.some(product => {
    // Verifica se o nome do produto contém o convênio específico
    const productName = product.name.toLowerCase();
    const searchKey = convenioKey.toLowerCase();
    
    // Mapeia os nomes para identificar convênios específicos
    const searchTerms = CONVENIO_MATCHES[searchKey as keyof typeof CONVENIO_MATCHES] || [searchKey];
    return searchTerms.some(term => productName.includes(term));
  });
};

export const isHabitacaoAlreadyRegistered = (products: Product[]): boolean => {
  return products.some(product => {
    const productName = product.name.toLowerCase();
    return productName.includes('habitação') || productName.includes('habitacao');
  });
};
