import { calculateLoanSchedule, LoanCalculationInput } from '../calculator/loanCalculator';

export interface SimulationRequest {
  productId: string;
  amount: number;
  months: number;
  interestRate: number;
}

export interface SimulationResult {
  productId: string;
  amount: number;
  months: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: any[];
}

export const simulationsApi = {
  /**
   * Executa simulação de empréstimo
   */
  async createSimulation(request: SimulationRequest): Promise<SimulationResult> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const input: LoanCalculationInput = {
      principal: request.amount,
      rateMonthly: request.interestRate / 100, // converter percentual para decimal
      months: request.months,
      firstDueDate: new Date(),
      amortizationType: 'PRICE'
    };
    
    const calculation = calculateLoanSchedule(input);
    
    return {
      productId: request.productId,
      amount: request.amount,
      months: request.months,
      monthlyPayment: calculation.monthlyInstallment,
      totalPayment: calculation.totalWithInterest,
      totalInterest: calculation.totalInterest,
      schedule: calculation.schedule,
    };
  },
  
  /**
   * Valida parâmetros de simulação
   */
  validateSimulationParams(params: Partial<SimulationRequest>): boolean {
    return !!(
      params.amount && 
      params.amount > 0 &&
      params.months && 
      params.months > 0 &&
      params.interestRate !== undefined &&
      params.interestRate >= 0
    );
  }
};
