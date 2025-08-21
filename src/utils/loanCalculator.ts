import { Installment } from '@/components/ExpandPanel';

export interface LoanCalculationInput {
  principal: number;        // valor do empréstimo
  rateMonthly: number;      // taxa mensal (decimal, ex: 0.01 = 1%)
  months: number;           // número de parcelas
  firstDueDate: Date;       // data da primeira parcela
  roundingMode?: 'half-up'; // modo de arredondamento
}

export interface LoanCalculationResult {
  schedule: Installment[];
  totalWithInterest: number;
  monthlyInstallment: number;
  totalInterest: number;
}

/**
 * Calcula cronograma de empréstimo usando Tabela Price
 */
export function calculateLoanSchedule(input: LoanCalculationInput): LoanCalculationResult {
  const { principal, rateMonthly, months, firstDueDate } = input;
  
  // Calcular parcela fixa (Tabela Price)
  const monthlyInstallment = principal * (rateMonthly * Math.pow(1 + rateMonthly, months)) / 
                             (Math.pow(1 + rateMonthly, months) - 1);

  const schedule: Installment[] = [];
  let remainingBalance = principal;
  let accumulatedAmortization = 0;

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

    // Calcular juros do mês
    const interest = remainingBalance * rateMonthly;
    
    // Calcular amortização
    let amortization = monthlyInstallment - interest;
    let installment = monthlyInstallment;

    // Ajuste na última parcela para zerar saldo
    if (i === months) {
      amortization = remainingBalance;
      installment = interest + amortization;
    }

    // Arredondar valores
    const roundedInterest = Math.round(interest * 100) / 100;
    const roundedAmortization = Math.round(amortization * 100) / 100;
    const roundedInstallment = Math.round(installment * 100) / 100;

    remainingBalance -= roundedAmortization;
    accumulatedAmortization += roundedAmortization;

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

  // Calcular totais
  const totalInstallments = schedule.reduce((sum, item) => sum + item.installment, 0);
  const totalInterest = schedule.reduce((sum, item) => sum + item.interest, 0);

  return {
    schedule,
    totalWithInterest: Math.round(totalInstallments * 100) / 100,
    monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

/**
 * Converte taxa anual para mensal
 */
export function convertYearlyToMonthlyRate(yearlyRate: number): number {
  return Math.pow(1 + yearlyRate, 1/12) - 1;
}

/**
 * Converte taxa mensal para anual
 */
export function convertMonthlyToYearlyRate(monthlyRate: number): number {
  return Math.pow(1 + monthlyRate, 12) - 1;
}
