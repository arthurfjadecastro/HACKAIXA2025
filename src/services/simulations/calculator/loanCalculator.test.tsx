import {
  calculateLoanSchedule,
  LoanCalculationInput,
  convertYearlyToMonthlyRate,
  convertMonthlyToYearlyRate,
} from './loanCalculator';

describe('loanCalculator', () => {
  const baseInput: LoanCalculationInput = {
    principal: 10000,
    rateMonthly: 0.01, // 1% ao mês
    months: 12,
    firstDueDate: new Date('2023-02-15'),
  };

  describe('calculateLoanSchedule', () => {
    it('should calculate PRICE schedule correctly', () => {
      const result = calculateLoanSchedule(baseInput);

      expect(result.schedule).toHaveLength(12);
      expect(result.totalWithInterest).toBeGreaterThan(baseInput.principal);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.firstInstallment).toBeGreaterThan(0);
      expect(result.monthlyInstallment).toBeGreaterThan(0);
    });

    it('should calculate SAC schedule correctly', () => {
      const sacInput: LoanCalculationInput = {
        ...baseInput,
        amortizationType: 'SAC',
      };

      const result = calculateLoanSchedule(sacInput);

      expect(result.schedule).toHaveLength(12);
      expect(result.totalWithInterest).toBeGreaterThan(baseInput.principal);
      expect(result.totalInterest).toBeGreaterThan(0);
      
      // In SAC, amortization should be constant
      expect(result.schedule.length).toBeGreaterThan(11);
      const firstAmortization = result.schedule[0]?.amortization;
      const lastAmortization = result.schedule[11]?.amortization;
      expect(firstAmortization).toBeDefined();
      expect(lastAmortization).toBeDefined();
      expect(Math.abs(firstAmortization! - lastAmortization!)).toBeLessThan(0.01);
    });

    it('should generate decreasing remaining balance', () => {
      const result = calculateLoanSchedule(baseInput);

      for (let i = 1; i < result.schedule.length; i++) {
        const current = result.schedule[i];
        const previous = result.schedule[i - 1];
        expect(current).toBeDefined();
        expect(previous).toBeDefined();
        expect(current!.remaining).toBeLessThanOrEqual(previous!.remaining);
      }

      // Last installment should have zero remaining balance
      const lastInstallment = result.schedule[result.schedule.length - 1];
      expect(lastInstallment).toBeDefined();
      expect(lastInstallment!.remaining).toBe(0);
    });

    it('should calculate correct total values', () => {
      const result = calculateLoanSchedule(baseInput);

      const calculatedTotal = result.schedule.reduce(
        (sum, installment) => sum + installment.installment,
        0
      );

      expect(Math.abs(calculatedTotal - result.totalWithInterest)).toBeLessThan(0.01);

      const calculatedInterest = result.schedule.reduce(
        (sum, installment) => sum + installment.interest,
        0
      );

      expect(Math.abs(calculatedInterest - result.totalInterest)).toBeLessThan(0.01);
    });

    it('should handle different loan amounts', () => {
      const smallLoan: LoanCalculationInput = {
        ...baseInput,
        principal: 1000,
      };

      const largeLoan: LoanCalculationInput = {
        ...baseInput,
        principal: 100000,
      };

      const smallResult = calculateLoanSchedule(smallLoan);
      const largeResult = calculateLoanSchedule(largeLoan);

      expect(smallResult.monthlyInstallment).toBeLessThan(largeResult.monthlyInstallment);
      expect(smallResult.totalInterest).toBeLessThan(largeResult.totalInterest);
    });

    it('should handle different interest rates', () => {
      const lowRate: LoanCalculationInput = {
        ...baseInput,
        rateMonthly: 0.005, // 0.5%
      };

      const highRate: LoanCalculationInput = {
        ...baseInput,
        rateMonthly: 0.02, // 2%
      };

      const lowResult = calculateLoanSchedule(lowRate);
      const highResult = calculateLoanSchedule(highRate);

      expect(lowResult.totalInterest).toBeLessThan(highResult.totalInterest);
      expect(lowResult.monthlyInstallment).toBeLessThan(highResult.monthlyInstallment);
    });

    it('should handle different loan terms', () => {
      const shortTerm: LoanCalculationInput = {
        ...baseInput,
        months: 6,
      };

      const longTerm: LoanCalculationInput = {
        ...baseInput,
        months: 24,
      };

      const shortResult = calculateLoanSchedule(shortTerm);
      const longResult = calculateLoanSchedule(longTerm);

      expect(shortResult.schedule).toHaveLength(6);
      expect(longResult.schedule).toHaveLength(24);
      expect(shortResult.monthlyInstallment).toBeGreaterThan(longResult.monthlyInstallment);
    });

    it('should generate correct due dates', () => {
      const result = calculateLoanSchedule(baseInput);

      result.schedule.forEach((installment, index) => {
        const dueDate = new Date(installment.dueDate);
        const expectedMonth = baseInput.firstDueDate.getMonth() + index;
        
        expect(dueDate.getFullYear()).toBe(
          baseInput.firstDueDate.getFullYear() + Math.floor(expectedMonth / 12)
        );
        expect(dueDate.getMonth()).toBe(expectedMonth % 12);
      });
    });

    it('should handle edge case with zero interest rate', () => {
      const zeroRateInput: LoanCalculationInput = {
        ...baseInput,
        rateMonthly: 0,
        amortizationType: 'SAC', // SAC handles zero rate correctly
      };

      const result = calculateLoanSchedule(zeroRateInput);

      expect(result.totalInterest).toBe(0);
      expect(result.totalWithInterest).toBeCloseTo(baseInput.principal, 1);
      
      // Each installment should be principal / months
      const expectedInstallment = baseInput.principal / baseInput.months;
      result.schedule.forEach((installment, index) => {
        if (index < result.schedule.length - 1) {
          expect(Math.abs(installment.installment - expectedInstallment)).toBeLessThan(0.01);
        }
      });
    });

    it('should handle single installment loan', () => {
      const singleInstallment: LoanCalculationInput = {
        ...baseInput,
        months: 1,
      };

      const result = calculateLoanSchedule(singleInstallment);

      expect(result.schedule).toHaveLength(1);
      expect(result.schedule[0]).toBeDefined();
      expect(result.schedule[0]!.remaining).toBe(0);
      expect(result.schedule[0]!.amortization).toBe(baseInput.principal);
    });

    it('should validate installment components sum correctly', () => {
      const result = calculateLoanSchedule(baseInput);

      result.schedule.forEach((installment) => {
        const sum = installment.interest + installment.amortization;
        expect(Math.abs(sum - installment.installment)).toBeLessThan(0.01);
      });
    });
  });

  describe('Rate Conversion Functions', () => {
    describe('convertYearlyToMonthlyRate', () => {
      it('should convert yearly rate to monthly rate correctly', () => {
        // 12% ao ano
        const yearlyRate = 0.12;
        const monthlyRate = convertYearlyToMonthlyRate(yearlyRate);
        
        // Verificar se está próximo de 0.949% ao mês (aproximadamente)
        expect(monthlyRate).toBeCloseTo(0.009489, 5);
      });

      it('should handle zero yearly rate', () => {
        const monthlyRate = convertYearlyToMonthlyRate(0);
        expect(monthlyRate).toBe(0);
      });

      it('should handle high yearly rates', () => {
        const yearlyRate = 1.0; // 100% ao ano
        const monthlyRate = convertYearlyToMonthlyRate(yearlyRate);
        
        // 100% ao ano deve resultar em aproximadamente 5.95% ao mês
        expect(monthlyRate).toBeCloseTo(0.0595, 3);
      });

      it('should handle small yearly rates', () => {
        const yearlyRate = 0.06; // 6% ao ano
        const monthlyRate = convertYearlyToMonthlyRate(yearlyRate);
        
        // 6% ao ano deve resultar em aproximadamente 0.487% ao mês
        expect(monthlyRate).toBeCloseTo(0.00487, 4);
      });
    });

    describe('convertMonthlyToYearlyRate', () => {
      it('should convert monthly rate to yearly rate correctly', () => {
        // 1% ao mês
        const monthlyRate = 0.01;
        const yearlyRate = convertMonthlyToYearlyRate(monthlyRate);
        
        // 1% ao mês deve resultar em aproximadamente 12.68% ao ano
        expect(yearlyRate).toBeCloseTo(0.1268, 4);
      });

      it('should handle zero monthly rate', () => {
        const yearlyRate = convertMonthlyToYearlyRate(0);
        expect(yearlyRate).toBe(0);
      });

      it('should handle high monthly rates', () => {
        const monthlyRate = 0.05; // 5% ao mês
        const yearlyRate = convertMonthlyToYearlyRate(monthlyRate);
        
        // 5% ao mês deve resultar em aproximadamente 79.59% ao ano
        expect(yearlyRate).toBeCloseTo(0.7959, 3);
      });

      it('should handle small monthly rates', () => {
        const monthlyRate = 0.005; // 0.5% ao mês
        const yearlyRate = convertMonthlyToYearlyRate(monthlyRate);
        
        // 0.5% ao mês deve resultar em aproximadamente 6.17% ao ano
        expect(yearlyRate).toBeCloseTo(0.0617, 4);
      });

      it('should be inverse of convertYearlyToMonthlyRate', () => {
        const originalYearlyRate = 0.15; // 15% ao ano
        
        // Converter para mensal e depois voltar para anual
        const monthlyRate = convertYearlyToMonthlyRate(originalYearlyRate);
        const backToYearlyRate = convertMonthlyToYearlyRate(monthlyRate);
        
        expect(backToYearlyRate).toBeCloseTo(originalYearlyRate, 6);
      });

      it('should validate compound interest relationship', () => {
        const monthlyRate = 0.02; // 2% ao mês
        const yearlyRate = convertMonthlyToYearlyRate(monthlyRate);
        
        // Fórmula: (1 + monthlyRate)^12 - 1 = yearlyRate
        const expectedYearlyRate = Math.pow(1 + monthlyRate, 12) - 1;
        
        expect(yearlyRate).toBeCloseTo(expectedYearlyRate, 8);
      });
    });

    describe('Rate Conversion Edge Cases', () => {
      it('should handle very small rates', () => {
        const verySmallYearly = 0.0001; // 0.01% ao ano
        const monthlyRate = convertYearlyToMonthlyRate(verySmallYearly);
        const backToYearly = convertMonthlyToYearlyRate(monthlyRate);
        
        expect(backToYearly).toBeCloseTo(verySmallYearly, 8);
      });

      it('should handle precision with realistic banking rates', () => {
        // Taxa típica de empréstimo: 18% ao ano
        const bankingYearlyRate = 0.18;
        const monthlyRate = convertYearlyToMonthlyRate(bankingYearlyRate);
        
        // Deve resultar em aproximadamente 1.39% ao mês
        expect(monthlyRate).toBeCloseTo(0.0139, 4);
        
        // Converter de volta deve dar o valor original
        const backToYearly = convertMonthlyToYearlyRate(monthlyRate);
        expect(backToYearly).toBeCloseTo(bankingYearlyRate, 6);
      });
    });
  });
});
