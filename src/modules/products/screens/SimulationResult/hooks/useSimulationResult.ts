import { useMemo, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useProducts } from '../../../hooks';
import { calculateLoanSchedule } from '@/services/simulations/calculator';
import { RouteProps, NavigationProps, LoanSchedule } from '../types';

interface UseSimulationResultReturn {
  // Route params
  productId: string;
  amount: string;
  months: number;
  result: {
    rate: number;
    rateAnnual?: number;
    amortizationType?: 'PRICE' | 'SAC';
  };
  
  // Computed values
  isHabitacao: boolean;
  loanSchedule: LoanSchedule;
  
  // State
  amortizationType: 'PRICE' | 'SAC';
  setAmortizationType: (type: 'PRICE' | 'SAC') => void;
  
  // Actions
  handleBackPress: () => void;
  formatCurrency: (value: number) => string;
}

export const useSimulationResult = (): UseSimulationResultReturn => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { productId, amount, months, result } = route.params;
  const { products } = useProducts();
  
  // Verificar se é produto de habitação - verifica ID e nome do produto
  const isHabitacao = useMemo(() => {
    // Primeiro verifica se contém habitacao/hab no productId
    if (productId?.toLowerCase().includes('habitacao') || productId?.toLowerCase().includes('hab')) {
      return true;
    }
    
    // Se não encontrou no ID, procura pelo nome do produto registrado
    const registeredProduct = products.find(p => p.id === productId);
    if (registeredProduct) {
      const productName = registeredProduct.name.toLowerCase();
      return productName.includes('habitação') || productName.includes('habitacao');
    }
    
    return false;
  }, [productId, products]);
  
  // Estado para alternar entre PRICE e SAC (apenas para habitação)
  const [amortizationType, setAmortizationType] = useState<'PRICE' | 'SAC'>(
    result.amortizationType || 'PRICE'
  );

  // Calcular cronograma de parcelas (PRICE e SAC para habitação)
  const loanSchedule = useMemo(() => {
    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    const rateMonthly = result.rate / 100; // Converter % para decimal
    
    // Data da primeira parcela (15 do próximo mês)
    const firstDueDate = new Date();
    firstDueDate.setMonth(firstDueDate.getMonth() + 1);
    firstDueDate.setDate(15);
    
    // Para habitação, usar o tipo selecionado, senão usar o padrão
    const typeToUse = isHabitacao ? amortizationType : (result.amortizationType || 'PRICE');
    
    return calculateLoanSchedule({
      principal: numericAmount,
      rateMonthly,
      months,
      firstDueDate,
      amortizationType: typeToUse,
    });
  }, [amount, months, result, isHabitacao, amortizationType]);

  const handleBackPress = () => {
    navigation.navigate('ProductList');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return {
    productId,
    amount,
    months,
    result,
    isHabitacao,
    loanSchedule,
    amortizationType,
    setAmortizationType,
    handleBackPress,
    formatCurrency,
  };
};
