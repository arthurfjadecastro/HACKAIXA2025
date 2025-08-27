import { formatCurrency, formatDate, formatInstallmentNumber } from './utils';

describe('LoanSchedulePanel Utils', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000.50)).toBe('R$\u00a01.000,50');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('R$\u00a00,00');
    });

    it('should format large numbers correctly', () => {
      expect(formatCurrency(1000000.99)).toBe('R$\u00a01.000.000,99');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-500.25)).toBe('-R$\u00a0500,25');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatCurrency(99.99)).toBe('R$\u00a099,99');
    });

    it('should handle very small decimals', () => {
      expect(formatCurrency(0.01)).toBe('R$\u00a00,01');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly in pt-BR format', () => {
      const date = new Date(2024, 0, 15); // Month is 0-indexed
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('should format date with correct day/month padding', () => {
      const date = new Date(2024, 2, 5); // March is month 2
      expect(formatDate(date)).toBe('05/03/2024');
    });

    it('should handle different months correctly', () => {
      const date = new Date(2024, 11, 31); // December is month 11
      expect(formatDate(date)).toBe('31/12/2024');
    });

    it('should handle leap year dates', () => {
      const date = new Date(2024, 1, 29); // February is month 1
      expect(formatDate(date)).toBe('29/02/2024');
    });

    it('should handle year transitions', () => {
      const date = new Date(2025, 0, 1); // January is month 0
      expect(formatDate(date)).toBe('01/01/2025');
    });
  });

  describe('formatInstallmentNumber', () => {
    it('should format first installment correctly', () => {
      expect(formatInstallmentNumber(1)).toBe('1ª parcela');
    });

    it('should format zero index correctly', () => {
      expect(formatInstallmentNumber(0)).toBe('0ª parcela');
    });

    it('should format double digit numbers correctly', () => {
      expect(formatInstallmentNumber(12)).toBe('12ª parcela');
    });

    it('should format large numbers correctly', () => {
      expect(formatInstallmentNumber(360)).toBe('360ª parcela');
    });

    it('should handle negative numbers', () => {
      expect(formatInstallmentNumber(-1)).toBe('-1ª parcela');
    });
  });
});
