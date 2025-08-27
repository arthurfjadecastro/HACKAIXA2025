import { simulateAPI } from './simulationAPI';

// Mock timers for faster tests
jest.useFakeTimers();

describe('simulationAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe('simulateAPI', () => {
    it('should simulate API call with amount and months', async () => {
      const amount = '10.000,00';
      const months = 12;
      
      const resultPromise = simulateAPI(amount, months);
      
      // Fast-forward all timers
      jest.runAllTimers();
      
      const result = await resultPromise;
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.months).toBe(months);
      expect(result.amount).toBe(10000);
    });

    it('should calculate installment correctly', async () => {
      const amount = '1.000,00';
      const months = 12;
      
      const resultPromise = simulateAPI(amount, months);
      jest.runAllTimers();
      const result = await resultPromise;
      
      expect(result.installment).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(result.amount);
      expect(result.rate).toBe(1); // 1% rate
    });

    it('should handle different amount formats', async () => {
      const amount1 = '5000,00';
      const amount2 = '5.000,00';
      const months = 6;
      
      const resultPromise1 = simulateAPI(amount1, months);
      jest.runAllTimers();
      const result1 = await resultPromise1;
      
      const resultPromise2 = simulateAPI(amount2, months);
      jest.runAllTimers();
      const result2 = await resultPromise2;
      
      expect(result1.amount).toBe(result2.amount);
      expect(result1.installment).toBe(result2.installment);
    });

    it('should return valid simulation result structure', async () => {
      const resultPromise = simulateAPI('5000,00', 24);
      jest.runAllTimers();
      const result = await resultPromise;
      
      expect(result).toHaveProperty('installment');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('rate');
      expect(result).toHaveProperty('months');
      expect(result).toHaveProperty('amount');
      
      expect(typeof result.installment).toBe('number');
      expect(typeof result.total).toBe('number');
      expect(typeof result.rate).toBe('number');
      expect(typeof result.months).toBe('number');
      expect(typeof result.amount).toBe('number');
    });
  });

  it('should export simulateAPI function', () => {
    expect(typeof simulateAPI).toBe('function');
  });
});
