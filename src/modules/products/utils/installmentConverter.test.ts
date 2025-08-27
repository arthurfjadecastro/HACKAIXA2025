import { LoanInstallment } from '@/services/simulations/calculator';
import { convertLoanToInstallment, convertLoanToInstallmentArray } from './installmentConverter';

describe('installmentConverter', () => {
  const mockLoanInstallment: LoanInstallment = {
    index: 1,
    dueDate: '2024-02-01T00:00:00.000Z',
    installment: 1000,
    interest: 100,
    amortization: 900,
    remaining: 9000,
  };

  describe('convertLoanToInstallment', () => {
    it('should convert LoanInstallment to Installment correctly', () => {
      const result = convertLoanToInstallment(mockLoanInstallment);

      expect(result.id).toBe(1);
      expect(result.index).toBe(1);
      expect(result.dueDate).toBeInstanceOf(Date);
      expect(result.value).toBe(1000);
      expect(result.balanceAfterPayment).toBe(9000);
      expect(result.interestValue).toBe(100);
      expect(result.principalValue).toBe(900);
      expect(result.totalInterest).toBe(0);
    });

    it('should convert dueDate string to Date object', () => {
      const result = convertLoanToInstallment(mockLoanInstallment);
      
      expect(result.dueDate).toBeInstanceOf(Date);
      expect(result.dueDate.toISOString()).toBe('2024-02-01T00:00:00.000Z');
    });

    it('should handle different installment values', () => {
      const customInstallment: LoanInstallment = {
        index: 5,
        dueDate: '2024-06-01T00:00:00.000Z',
        installment: 1500.50,
        interest: 150.25,
        amortization: 1350.25,
        remaining: 5000.75,
      };

      const result = convertLoanToInstallment(customInstallment);

      expect(result.id).toBe(5);
      expect(result.value).toBe(1500.50);
      expect(result.interestValue).toBe(150.25);
      expect(result.principalValue).toBe(1350.25);
      expect(result.balanceAfterPayment).toBe(5000.75);
    });
  });

  describe('convertLoanToInstallmentArray', () => {
    const mockLoanInstallments: LoanInstallment[] = [
      {
        index: 1,
        dueDate: '2024-02-01T00:00:00.000Z',
        installment: 1000,
        interest: 100,
        amortization: 900,
        remaining: 9000,
      },
      {
        index: 2,
        dueDate: '2024-03-01T00:00:00.000Z',
        installment: 1000,
        interest: 90,
        amortization: 910,
        remaining: 8090,
      },
      {
        index: 3,
        dueDate: '2024-04-01T00:00:00.000Z',
        installment: 1000,
        interest: 80.9,
        amortization: 919.1,
        remaining: 7170.9,
      },
    ];

    it('should convert array of LoanInstallments correctly', () => {
      const result = convertLoanToInstallmentArray(mockLoanInstallments);

      expect(result).toHaveLength(3);
      expect(result[0]?.id).toBe(1);
      expect(result[1]?.id).toBe(2);
      expect(result[2]?.id).toBe(3);
    });

    it('should calculate accumulated interest correctly', () => {
      const result = convertLoanToInstallmentArray(mockLoanInstallments);

      expect(result[0]?.totalInterest).toBe(100); // 100
      expect(result[1]?.totalInterest).toBe(190); // 100 + 90
      expect(result[2]?.totalInterest).toBe(270.9); // 100 + 90 + 80.9
    });

    it('should handle empty array', () => {
      const result = convertLoanToInstallmentArray([]);
      expect(result).toHaveLength(0);
    });

    it('should handle single installment', () => {
      const firstInstallment = mockLoanInstallments[0];
      if (!firstInstallment) return;
      
      const result = convertLoanToInstallmentArray([firstInstallment]);
      
      expect(result).toHaveLength(1);
      expect(result[0]?.totalInterest).toBe(100);
    });

    it('should preserve all original properties', () => {
      const firstInstallment = mockLoanInstallments[0];
      if (!firstInstallment) return;
      
      const result = convertLoanToInstallmentArray([firstInstallment]);
      const first = result[0];

      expect(first?.index).toBe(1);
      expect(first?.dueDate).toBeInstanceOf(Date);
      expect(first?.value).toBe(1000);
      expect(first?.balanceAfterPayment).toBe(9000);
      expect(first?.interestValue).toBe(100);
      expect(first?.principalValue).toBe(900);
    });
  });
});
