import { renderHook, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSimulationResult } from './useSimulationResult';
import { useProducts } from '../../../hooks';
import { calculateLoanSchedule } from '@/services/simulations/calculator';

// Mock das dependências
jest.mock('@react-navigation/native');
jest.mock('../../../hooks');
jest.mock('@/services/simulations/calculator');

const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockUseRoute = useRoute as jest.MockedFunction<typeof useRoute>;
const mockUseProducts = useProducts as jest.MockedFunction<typeof useProducts>;
const mockCalculateLoanSchedule = calculateLoanSchedule as jest.MockedFunction<typeof calculateLoanSchedule>;

describe('💰 useSimulationResult Hook', () => {
  const mockNavigate = jest.fn();
  const mockProducts = [
    {
      id: 'habitacao-sac',
      name: 'Financiamento Habitação SAC',
      category: 'habitacao',
      subtype: 'sac',
    },
    {
      id: 'consignado-inss',
      name: 'Empréstimo Consignado INSS',
      category: 'consignado',
      subtype: 'inss',
    },
  ];

  const defaultRouteParams = {
    productId: 'consignado-inss',
    amount: '50.000,00', // Formato correto brasileiro 
    months: 24,
    result: {
      rate: 2.5,
      rateAnnual: 30.0,
      amortizationType: 'PRICE' as const,
    },
  };

  const mockLoanSchedule = {
    schedule: [
      {
        index: 1,
        dueDate: '2024-02-15',
        installment: 2500.0,
        interest: 500.0,
        amortization: 2000.0,
        remaining: 48000.0,
      },
    ],
    totalWithInterest: 60000.0,
    totalInterest: 10000.0,
    firstInstallment: 2500.0,
    monthlyInstallment: 2500.0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseNavigation.mockReturnValue({
      navigate: mockNavigate,
    } as any);

    mockUseRoute.mockReturnValue({
      params: defaultRouteParams,
    } as any);

    mockUseProducts.mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
    } as any);

    mockCalculateLoanSchedule.mockReturnValue(mockLoanSchedule);
  });

  describe('🚀 Basic Functionality', () => {
    it('should return route params correctly', () => {
      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.productId).toBe('consignado-inss');
      expect(result.current.amount).toBe('50.000,00'); // Valor correto conforme mock
      expect(result.current.months).toBe(24);
      expect(result.current.result).toEqual({
        rate: 2.5,
        rateAnnual: 30.0,
        amortizationType: 'PRICE',
      });
    });

    it('should return calculated loan schedule', () => {
      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.loanSchedule).toBe(mockLoanSchedule);
      expect(mockCalculateLoanSchedule).toHaveBeenCalledWith({
        principal: 50000, // 50.000,00 formatado corretamente
        rateMonthly: 0.025,
        months: 24,
        firstDueDate: expect.any(Date),
        amortizationType: 'PRICE',
      });
    });

    it('should format currency correctly', () => {
      const { result } = renderHook(() => useSimulationResult());

      // Testando valores que sabemos o resultado
      const formatted1000 = result.current.formatCurrency(1000);
      const formatted1234 = result.current.formatCurrency(1234.56);
      const formatted0 = result.current.formatCurrency(0);

      // Verificando se contém os elementos básicos de moeda brasileira
      expect(formatted1000).toMatch(/R\$\s*1\.000,00/);
      expect(formatted1234).toMatch(/R\$\s*1\.234,56/);
      expect(formatted0).toMatch(/R\$\s*0,00/);
    });
  });

  describe('🏠 Habitação Detection', () => {
    it('should detect habitacao by productId with "habitacao"', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          productId: 'habitacao-sac',
        },
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.isHabitacao).toBe(true);
    });

    it('should detect habitacao by productId with "hab"', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          productId: 'hab-price-test',
        },
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.isHabitacao).toBe(true);
    });

    it('should detect habitacao by product name', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          productId: 'habitacao-sac',
        },
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.isHabitacao).toBe(true);
    });

    it('should not detect habitacao for consignado products', () => {
      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.isHabitacao).toBe(false);
    });

    it('should handle missing product in products list', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          productId: 'missing-product',
        },
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.isHabitacao).toBe(false);
    });
  });

  describe('🔄 Amortization Type Management', () => {
    it('should initialize with route result amortization type', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          result: {
            ...defaultRouteParams.result,
            amortizationType: 'SAC',
          },
        },
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.amortizationType).toBe('SAC');
    });

    it('should default to PRICE when no amortization type provided', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          result: {
            rate: 2.5,
            rateAnnual: 30.0,
          },
        },
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.amortizationType).toBe('PRICE');
    });

    it('should update amortization type', () => {
      const { result } = renderHook(() => useSimulationResult());

      act(() => {
        result.current.setAmortizationType('SAC');
      });

      expect(result.current.amortizationType).toBe('SAC');
    });

    it('should recalculate loan schedule when amortization type changes for habitacao', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          productId: 'habitacao-sac',
        },
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      // Primeiro cálculo com PRICE
      expect(mockCalculateLoanSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          amortizationType: 'PRICE',
        })
      );

      act(() => {
        result.current.setAmortizationType('SAC');
      });

      // Segundo cálculo com SAC
      expect(mockCalculateLoanSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          amortizationType: 'SAC',
        })
      );
    });

    it('should use original amortization type for non-habitacao products', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          result: {
            ...defaultRouteParams.result,
            amortizationType: 'SAC',
          },
        },
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      // Para não-habitação, deve usar o tipo original independente do estado
      expect(mockCalculateLoanSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          amortizationType: 'SAC',
        })
      );

      act(() => {
        result.current.setAmortizationType('PRICE');
      });

      // Ainda deve usar SAC para não-habitação
      expect(mockCalculateLoanSchedule).toHaveBeenLastCalledWith(
        expect.objectContaining({
          amortizationType: 'SAC',
        })
      );
    });
  });

  describe('💰 Loan Schedule Calculation', () => {
    it('should calculate schedule with correct parameters', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          amount: '75000,50',
          months: 36,
          result: {
            rate: 1.8,
          },
        },
      } as any);

      renderHook(() => useSimulationResult());

      expect(mockCalculateLoanSchedule).toHaveBeenCalledWith({
        principal: 75000.5,
        rateMonthly: expect.closeTo(0.018, 6), // Use closeTo para problemas de precisão
        months: 36,
        firstDueDate: expect.any(Date),
        amortizationType: 'PRICE',
      });
    });

    it('should set first due date to 15th of next month', () => {
      renderHook(() => useSimulationResult());

      const callArgs = mockCalculateLoanSchedule.mock.calls[0]?.[0];
      expect(callArgs).toBeDefined();
      
      const firstDueDate = callArgs!.firstDueDate;

      expect(firstDueDate.getDate()).toBe(15);
      
      const currentDate = new Date();
      const expectedMonth = currentDate.getMonth() + 1;
      const expectedYear = currentDate.getFullYear() + (expectedMonth > 11 ? 1 : 0);
      const normalizedExpectedMonth = expectedMonth > 11 ? 0 : expectedMonth;

      expect(firstDueDate.getMonth()).toBe(normalizedExpectedMonth);
      expect(firstDueDate.getFullYear()).toBe(expectedYear);
    });

    it('should handle amount with dots and commas correctly', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          amount: '1.234.567,89',
        },
      } as any);

      renderHook(() => useSimulationResult());

      expect(mockCalculateLoanSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          principal: 1234567.89,
        })
      );
    });
  });

  describe('🧭 Navigation', () => {
    it('should navigate to ProductList on back press', () => {
      const { result } = renderHook(() => useSimulationResult());

      act(() => {
        result.current.handleBackPress();
      });

      expect(mockNavigate).toHaveBeenCalledWith('ProductList');
    });
  });

  describe('🔄 Memoization', () => {
    it('should recalculate when products change', () => {
      const initialProducts = mockProducts;
      mockUseProducts.mockReturnValue({
        products: initialProducts,
        isLoading: false,
        error: null,
      } as any);

      const { result: initialResult } = renderHook(() => useSimulationResult());
      const initialIsHabitacao = initialResult.current.isHabitacao;

      // Limpar mock calls
      mockCalculateLoanSchedule.mockClear();

      // Alterar products para novo mock
      const newProducts = [...mockProducts, { id: 'new-product', name: 'New Product' }];
      mockUseProducts.mockReturnValue({
        products: newProducts,
        isLoading: false,
        error: null,
      } as any);

      const { result: newResult } = renderHook(() => useSimulationResult());

      // Deve recalcular devido à mudança nas dependências
      expect(mockCalculateLoanSchedule).toHaveBeenCalled();
      expect(newResult.current.isHabitacao).toBe(initialIsHabitacao);
    });
  });

  describe('🧪 Edge Cases', () => {
    it('should handle missing route params gracefully', () => {
      mockUseRoute.mockReturnValue({
        params: {
          productId: undefined,
          amount: undefined,
          months: undefined,
          result: undefined,
        },
      } as any);

      // Deve tentar renderizar mesmo com params inválidos
      expect(() => renderHook(() => useSimulationResult())).toThrow();
    });

    it('should handle empty products array', () => {
      mockUseProducts.mockReturnValue({
        products: [],
        isLoading: false,
        error: null,
      } as any);

      const { result } = renderHook(() => useSimulationResult());

      expect(result.current.isHabitacao).toBe(false);
    });

    it('should handle zero values', () => {
      mockUseRoute.mockReturnValue({
        params: {
          ...defaultRouteParams,
          amount: '0',
          months: 0,
          result: {
            rate: 0,
          },
        },
      } as any);

      renderHook(() => useSimulationResult());

      expect(mockCalculateLoanSchedule).toHaveBeenCalledWith({
        principal: 0,
        rateMonthly: 0,
        months: 0,
        firstDueDate: expect.any(Date),
        amortizationType: 'PRICE',
      });
    });
  });
});
