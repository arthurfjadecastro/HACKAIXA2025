import { useState, useEffect } from 'react';
import { QuoteData } from '../types';
import { Product } from '@/services/products/productTypes';

interface UseLoanCalculationProps {
  product: Product | null;
  amount: string;
}

export const useLoanCalculation = ({ product, amount }: UseLoanCalculationProps) => {
  const [months, setMonths] = useState<number>(12);
  const [inputValue, setInputValue] = useState<string>('12');
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [showValidationWarning, setShowValidationWarning] = useState<boolean>(false);

  // Valores padrão do produto
  const productMinMonths = product?.prazoMinimo || 12;
  const productMaxMonths = product?.prazoMaximo || 60;
  const productRateAm = product ? (product.juros / 100 / 12) : 0.0167; // Converter % anual para decimal mensal

  // Formatação de moeda
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Cálculo da simulação
  const calculateQuote = () => {
    if (!amount || !months || isNaN(parseFloat(amount))) {
      setQuote(null);
      return;
    }

    const amountNumber = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    
    if (amountNumber <= 0) {
      setQuote(null);
      return;
    }

    // Cálculo usando tabela PRICE
    const monthlyRate = productRateAm;
    const installment = (amountNumber * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
    const total = installment * months;

    setQuote({
      installment,
      total,
      rate: monthlyRate,
    });
  };

  // Controles de parcelas
  const decreaseMonths = () => {
    if (months > productMinMonths) {
      const newMonths = months - 1;
      setMonths(newMonths);
      setInputValue(newMonths.toString());
      setShowValidationWarning(false);
    }
  };

  const increaseMonths = () => {
    if (months < productMaxMonths) {
      const newMonths = months + 1;
      setMonths(newMonths);
      setInputValue(newMonths.toString());
      setShowValidationWarning(false);
    }
  };

  const handleMonthsChange = (text: string) => {
    setInputValue(text);
    
    if (text === '') {
      setShowValidationWarning(false);
      return;
    }

    const newMonths = parseInt(text);
    if (!isNaN(newMonths)) {
      if (newMonths >= productMinMonths && newMonths <= productMaxMonths) {
        setMonths(newMonths);
        setShowValidationWarning(false);
      } else {
        setShowValidationWarning(true);
      }
    }
  };

  const handleMonthsBlur = () => {
    if (inputValue === '' || isNaN(parseInt(inputValue))) {
      setMonths(productMinMonths);
      setInputValue(productMinMonths.toString());
    }
  };

  // Efeito para recalcular quando valores mudam
  useEffect(() => {
    calculateQuote();
  }, [amount, months, product]);

  // Inicializar com valores mínimos do produto
  useEffect(() => {
    if (product) {
      setMonths(productMinMonths);
      setInputValue(productMinMonths.toString());
    }
  }, [product]);

  return {
    months,
    inputValue,
    quote,
    showValidationWarning,
    productMinMonths,
    productMaxMonths,
    productRateAm,
    formatCurrency,
    decreaseMonths,
    increaseMonths,
    handleMonthsChange,
    handleMonthsBlur,
  };
};
