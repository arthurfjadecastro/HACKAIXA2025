import { simulationsApi, SimulationRequest } from './simulationsApi';

// Mock do loanCalculator
jest.mock('../calculator/loanCalculator', () => ({
  calculateLoanSchedule: jest.fn(() => ({
    schedule: [
      {
        index: 1,
        dueDate: '2024-02-01T00:00:00.000Z',
        installment: 1000,
        interest: 100,
        amortization: 900,
        remaining: 9000,
      }
    ],
    totalWithInterest: 12000,
    totalInterest: 2000,
    firstInstallment: 1000,
    monthlyInstallment: 1000,
  }))
}));

describe('simulationsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSimulation', () => {
    it('should create simulation successfully', async () => {
      const request: SimulationRequest = {
        productId: 'product-1',
        amount: 10000,
        months: 12,
        interestRate: 1.2,
      };

      const result = await simulationsApi.createSimulation(request);

      expect(result).toEqual({
        productId: 'product-1',
        amount: 10000,
        months: 12,
        monthlyPayment: 1000,
        totalPayment: 12000,
        totalInterest: 2000,
        schedule: [
          {
            index: 1,
            dueDate: '2024-02-01T00:00:00.000Z',
            installment: 1000,
            interest: 100,
            amortization: 900,
            remaining: 9000,
          }
        ],
      });
    });

    it('should convert interest rate from percentage to decimal', async () => {
      const { calculateLoanSchedule } = require('../calculator/loanCalculator');
      
      const request: SimulationRequest = {
        productId: 'product-1',
        amount: 10000,
        months: 12,
        interestRate: 1.2, // 1.2%
      };

      await simulationsApi.createSimulation(request);

      expect(calculateLoanSchedule).toHaveBeenCalledWith({
        principal: 10000,
        rateMonthly: 0.012, // convertido para decimal
        months: 12,
        firstDueDate: expect.any(Date),
        amortizationType: 'PRICE'
      });
    });

    it('should simulate API delay', async () => {
      const startTime = Date.now();
      
      const request: SimulationRequest = {
        productId: 'product-1',
        amount: 10000,
        months: 12,
        interestRate: 1.2,
      };

      await simulationsApi.createSimulation(request);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Deve ter esperado pelo menos 2 segundos
      expect(duration).toBeGreaterThanOrEqual(1900); // margem para tolerância
    });

    it('should handle different amounts and terms', async () => {
      const request: SimulationRequest = {
        productId: 'product-2',
        amount: 50000,
        months: 24,
        interestRate: 2.5,
      };

      const result = await simulationsApi.createSimulation(request);

      expect(result.productId).toBe('product-2');
      expect(result.amount).toBe(50000);
      expect(result.months).toBe(24);
    });
  });

  describe('validateSimulationParams', () => {
    it('should validate complete valid params', () => {
      const params: SimulationRequest = {
        productId: 'product-1',
        amount: 10000,
        months: 12,
        interestRate: 1.2,
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(true);
    });

    it('should reject params with zero amount', () => {
      const params = {
        productId: 'product-1',
        amount: 0,
        months: 12,
        interestRate: 1.2,
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(false);
    });

    it('should reject params with negative amount', () => {
      const params = {
        productId: 'product-1',
        amount: -5000,
        months: 12,
        interestRate: 1.2,
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(false);
    });

    it('should reject params with zero months', () => {
      const params = {
        productId: 'product-1',
        amount: 10000,
        months: 0,
        interestRate: 1.2,
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(false);
    });

    it('should reject params with negative months', () => {
      const params = {
        productId: 'product-1',
        amount: 10000,
        months: -12,
        interestRate: 1.2,
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(false);
    });

    it('should accept params with zero interest rate', () => {
      const params = {
        productId: 'product-1',
        amount: 10000,
        months: 12,
        interestRate: 0,
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(true);
    });

    it('should reject params with undefined interest rate', () => {
      const params = {
        productId: 'product-1',
        amount: 10000,
        months: 12,
        // interestRate undefined
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(false);
    });

    it('should reject params with missing amount', () => {
      const params = {
        productId: 'product-1',
        months: 12,
        interestRate: 1.2,
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(false);
    });

    it('should reject params with missing months', () => {
      const params = {
        productId: 'product-1',
        amount: 10000,
        interestRate: 1.2,
      };

      const result = simulationsApi.validateSimulationParams(params);
      expect(result).toBe(false);
    });

    it('should validate partial params correctly', () => {
      const validPartial = {
        amount: 5000,
        months: 6,
        interestRate: 1.5,
      };

      const invalidPartial = {
        amount: 5000,
        // missing months and interestRate
      };

      expect(simulationsApi.validateSimulationParams(validPartial)).toBe(true);
      expect(simulationsApi.validateSimulationParams(invalidPartial)).toBe(false);
    });
  });
});
