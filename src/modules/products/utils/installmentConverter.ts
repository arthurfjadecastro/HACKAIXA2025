import { LoanInstallment } from '@/services/simulations/calculator';
import { Installment } from '../components';

/**
 * Converte LoanInstallment (formato interno do calculador) para Installment (formato do componente)
 */
export const convertLoanToInstallment = (loanInstallment: LoanInstallment): Installment => {
  return {
    id: loanInstallment.index,
    index: loanInstallment.index,
    dueDate: new Date(loanInstallment.dueDate),
    value: loanInstallment.installment,
    balanceAfterPayment: loanInstallment.remaining,
    interestValue: loanInstallment.interest,
    principalValue: loanInstallment.amortization,
    totalInterest: 0, // Este valor precisa ser calculado acumulativamente
  };
};

/**
 * Converte array de LoanInstallment para array de Installment
 */
export const convertLoanToInstallmentArray = (loanInstallments: LoanInstallment[]): Installment[] => {
  let accumulatedInterest = 0;
  
  return loanInstallments.map((item) => {
    accumulatedInterest += item.interest;
    
    return {
      id: item.index,
      index: item.index,
      dueDate: new Date(item.dueDate),
      value: item.installment,
      balanceAfterPayment: item.remaining,
      interestValue: item.interest,
      principalValue: item.amortization,
      totalInterest: accumulatedInterest,
    };
  });
};
