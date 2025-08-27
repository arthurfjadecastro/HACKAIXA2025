import { RouteProps, NavigationProps, SimulationParams, LoanSchedule } from './types';

describe('SimulationResult Types', () => {
  it('should export RouteProps type', () => {
    // Verifica se o tipo existe por meio de type checking
    const testRoute: Partial<RouteProps> = {
      key: 'test-key',
      name: 'SimulationResult'
    };
    expect(testRoute).toBeDefined();
  });

  it('should export NavigationProps type', () => {
    // Teste básico de estrutura do tipo
    const testNavigation: Partial<NavigationProps> = {
      navigate: jest.fn(),
      goBack: jest.fn()
    };
    expect(testNavigation).toBeDefined();
  });

  it('should validate SimulationParams interface structure', () => {
    const testParams: SimulationParams = {
      productId: 'test-product-id',
      amount: '50000',
      months: 24,
      result: {
        rate: 0.15,
        rateAnnual: 0.18,
        amortizationType: 'PRICE'
      }
    };

    expect(testParams.productId).toBe('test-product-id');
    expect(testParams.amount).toBe('50000');
    expect(testParams.months).toBe(24);
    expect(testParams.result.rate).toBe(0.15);
    expect(testParams.result.amortizationType).toBe('PRICE');
  });

  it('should export LoanSchedule type alias', () => {
    // Verifica se o tipo LoanSchedule é exportado
    // Como é um type alias, verificamos sua existência através de TypeScript
    const testSchedule: Partial<LoanSchedule> = {
      schedule: [],
      totalWithInterest: 24000,
      totalInterest: 4000,
      firstInstallment: 1000,
      monthlyInstallment: 1000
    };
    expect(testSchedule).toBeDefined();
  });

  it('should validate optional properties in SimulationParams', () => {
    const minimalParams: SimulationParams = {
      productId: 'minimal-product',
      amount: '10000',
      months: 12,
      result: {
        rate: 0.10
        // rateAnnual e amortizationType são opcionais
      }
    };

    expect(minimalParams.result.rateAnnual).toBeUndefined();
    expect(minimalParams.result.amortizationType).toBeUndefined();
  });
});
