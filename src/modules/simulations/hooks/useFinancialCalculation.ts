import { useMemo } from 'react';
import { calculateLoanSchedule } from '@/utils/loanCalculator';
import { useProducts } from '@/hooks/useProducts';
import ProductDataService from '@/services/ProductDataService';

export interface FinancialCalculationParams {
  productId: string;
  amount: string;
  months: number;
}

export interface FinancialCalculationResult {
  installment: number;
  total: number;
  totalInterest: number;
  rate: number; // Taxa mensal em %
  rateAnnual: number; // Taxa anual em %
  amortizationType: 'PRICE' | 'SAC';
  schedule: any[];
}

export const useFinancialCalculation = (params: FinancialCalculationParams) => {
  const { products } = useProducts();
  const productService = new ProductDataService();

  const calculation = useMemo(async (): Promise<FinancialCalculationResult> => {
    if (!params.productId || !params.amount || !params.months) {
      return {
        installment: 0,
        total: 0,
        totalInterest: 0,
        rate: 0,
        rateAnnual: 0,
        amortizationType: 'PRICE',
        schedule: []
      };
    }

    const numericAmount = parseFloat(params.amount.replace(/\./g, '').replace(',', '.'));
    
    // Buscar produto registrado
    const registeredProduct = products.find(p => p.id === params.productId);
    
    if (!registeredProduct) {
      throw new Error(`Produto ${params.productId} não encontrado`);
    }

    let productData: any = null;
    let rateMonthly: number = 0.0156; // Taxa padrão 1.56% a.m. (conforme exemplo)
    let amortizationType: 'PRICE' | 'SAC' = 'PRICE';

    try {
      // Carregar dados detalhados do produto baseado no tipo
      if (params.productId.includes('consignado_inss')) {
        productData = await productService.loadConvenio('inss');
        rateMonthly = productData.faixas?.A?.concessao_taxa_am / 100 || 0.0156;
        amortizationType = 'PRICE'; // Sempre Price para consignado
      } else if (params.productId.includes('consignado_convenio')) {
        // Determinar qual convênio
        let convenioType = 'militar';
        if (params.productId.includes('funcef')) convenioType = 'funcef';
        else if (params.productId.includes('tjdft')) convenioType = 'tjdft';
        
        productData = await productService.loadConvenio(convenioType);
        rateMonthly = productData.faixas?.A?.concessao_taxa_am / 100 || 0.0156;
        amortizationType = 'PRICE'; // Sempre Price para consignado
      } else if (params.productId.includes('habitacao')) {
        if (params.productId.includes('sac')) {
          productData = await productService.loadHabitacao('sac');
          amortizationType = 'SAC';
        } else {
          productData = await productService.loadHabitacao('price');
          amortizationType = 'PRICE';
        }
        // Para habitação, vamos usar taxa padrão já que não temos faixas definidas
        rateMonthly = 0.008; // 0.8% a.m. para habitação (exemplo)
      } else {
        // Outro produto - usar dados cadastrados
        productData = await productService.loadOutroTemplate();
        rateMonthly = registeredProduct.juros > 10 
          ? (registeredProduct.juros / 100) / 12 
          : registeredProduct.juros / 100;
        amortizationType = 'PRICE'; // Sempre Price para outros
      }
    } catch (error) {
      console.warn('Erro ao carregar dados do produto, usando dados básicos:', error);
      // Fallback para dados básicos do produto registrado
      rateMonthly = registeredProduct.juros > 10 
        ? (registeredProduct.juros / 100) / 12 
        : registeredProduct.juros / 100;
    }

    // Data da primeira parcela (15 do próximo mês)
    const firstDueDate = new Date();
    firstDueDate.setMonth(firstDueDate.getMonth() + 1);
    firstDueDate.setDate(15);

    if (amortizationType === 'PRICE') {
      // Cálculo usando Sistema Price
      const loanSchedule = calculateLoanSchedule({
        principal: numericAmount,
        rateMonthly: rateMonthly,
        months: params.months,
        firstDueDate,
      });

      const rateAnnual = Math.pow(1 + rateMonthly, 12) - 1;

      return {
        installment: loanSchedule.monthlyInstallment,
        total: loanSchedule.totalWithInterest,
        totalInterest: loanSchedule.totalInterest,
        rate: rateMonthly * 100,
        rateAnnual: rateAnnual * 100,
        amortizationType: 'PRICE',
        schedule: loanSchedule.schedule
      };
    } else {
      // Cálculo usando Sistema SAC
      return calculateSACSystem({
        principal: numericAmount,
        rateMonthly: rateMonthly,
        months: params.months,
        firstDueDate,
      });
    }
  }, [params, products]);

  return { calculation };
};

// Função para cálculo SAC
function calculateSACSystem(input: {
  principal: number;
  rateMonthly: number;
  months: number;
  firstDueDate: Date;
}): FinancialCalculationResult {
  const { principal, rateMonthly, months, firstDueDate } = input;
  
  // No SAC, a amortização é constante
  const constantAmortization = principal / months;
  
  const schedule: any[] = [];
  let remainingBalance = principal;
  let totalInstallments = 0;
  let totalInterest = 0;

  // Gerar cronograma mês a mês
  for (let i = 1; i <= months; i++) {
    // Calcular data de vencimento
    const dueDate = new Date(firstDueDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));
    
    // Ajustar para último dia do mês se necessário
    if (dueDate.getDate() !== firstDueDate.getDate()) {
      dueDate.setDate(0); // Último dia do mês anterior
      dueDate.setMonth(dueDate.getMonth() + 1); // Volta para o mês correto
    }

    // Calcular juros do mês sobre o saldo devedor
    const interest = remainingBalance * rateMonthly;
    
    // Parcela = amortização constante + juros
    const installment = constantAmortization + interest;
    
    // Arredondar valores
    const roundedInterest = Math.round(interest * 100) / 100;
    const roundedAmortization = Math.round(constantAmortization * 100) / 100;
    const roundedInstallment = Math.round(installment * 100) / 100;
    
    remainingBalance -= roundedAmortization;
    totalInstallments += roundedInstallment;
    totalInterest += roundedInterest;
    
    // Garantir que saldo não fique negativo
    if (remainingBalance < 0) {
      remainingBalance = 0;
    }

    schedule.push({
      index: i,
      dueDate: dueDate.toISOString(),
      installment: roundedInstallment,
      interest: roundedInterest,
      amortization: roundedAmortization,
      remaining: Math.round(remainingBalance * 100) / 100,
    });
  }

  const rateAnnual = Math.pow(1 + rateMonthly, 12) - 1;

  return {
    installment: schedule[0]?.installment || 0, // Primeira parcela (maior)
    total: Math.round(totalInstallments * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    rate: rateMonthly * 100,
    rateAnnual: rateAnnual * 100,
    amortizationType: 'SAC',
    schedule
  };
}

export default useFinancialCalculation;
