import { renderHook, act } from '@testing-library/react-native';
import { useLoanCalculation } from './useLoanCalculation';
import { Product } from '@/services/products/types';

// Mock product data - usando sempre o mesmo objeto para evitar re-renders
const mockProduct: Product = {
  id: 'test-product',
  name: 'Produto Teste',
  juros: 24, // 24% ao ano
  prazoMinimo: 12,
  prazoMaximo: 60,
  normativo: 'BACEN 4.554',
  active: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  categoria: 'consignado'
};

describe('🧮 useLoanCalculation Hook', () => {
  describe('🚀 Basic Functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: null, amount: '0' })
      );

      expect(result.current.months).toBe(12);
      expect(result.current.inputValue).toBe('12');
      expect(result.current.showValidationWarning).toBe(false);
      expect(result.current.productMinMonths).toBe(12);
      expect(result.current.productMaxMonths).toBe(60);
    });

    it('should format currency correctly', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: null, amount: '0' })
      );

      const formatted1 = result.current.formatCurrency(1500.75);
      const formatted2 = result.current.formatCurrency(0);
      const formatted3 = result.current.formatCurrency(1234567.89);

      expect(formatted1).toContain('1.500,75');
      expect(formatted2).toContain('0,00');
      expect(formatted3).toContain('1.234.567,89');
    });
  });

  describe('� Months Controls', () => {
    it('should handle months increase', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      act(() => {
        result.current.increaseMonths();
      });

      expect(result.current.months).toBe(13);
      expect(result.current.inputValue).toBe('13');
    });

    it('should handle months decrease', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      // First set to a higher value than minimum to allow decrease
      act(() => {
        result.current.handleMonthsChange('15');
      });

      act(() => {
        result.current.decreaseMonths();
      });

      expect(result.current.months).toBe(14); // 15 - 1
    });

    it('should handle months input change', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      act(() => {
        result.current.handleMonthsChange('24');
      });

      expect(result.current.inputValue).toBe('24');
      expect(result.current.months).toBe(24);
      expect(result.current.showValidationWarning).toBe(false);
    });

    it('should show validation warning for out of range values', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      act(() => {
        result.current.handleMonthsChange('100'); // Above max (60)
      });

      expect(result.current.showValidationWarning).toBe(true);
    });

    it('should handle months blur with empty input', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      act(() => {
        result.current.handleMonthsChange('');
      });

      act(() => {
        result.current.handleMonthsBlur();
      });

      expect(result.current.months).toBe(12); // Should reset to min
      expect(result.current.inputValue).toBe('12');
    });
  });

  describe('💰 Product Integration', () => {
    it('should use product limits correctly', () => {
      const customProduct = {
        ...mockProduct,
        prazoMinimo: 6,
        prazoMaximo: 120
      };

      const { result } = renderHook(() => 
        useLoanCalculation({ product: customProduct, amount: '10000' })
      );

      expect(result.current.productMinMonths).toBe(6);
      expect(result.current.productMaxMonths).toBe(120);
    });

    it('should calculate rate from product', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      // 24% annual = 24/100/12 = 0.02 monthly
      expect(result.current.productRateAm).toBeCloseTo(0.02);
    });

    it('should handle null product gracefully', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: null, amount: '10000' })
      );

      expect(result.current.productMinMonths).toBe(12);
      expect(result.current.productMaxMonths).toBe(60);
      expect(result.current.productRateAm).toBeCloseTo(0.0167);
    });
  });

  describe('🧮 Quote Calculation Logic', () => {
    it('should return null quote for empty amount', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '' })
      );

      expect(result.current.quote).toBeNull();
    });

    it('should return null quote for zero amount', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '0' })
      );

      expect(result.current.quote).toBeNull();
    });

    it('should return null quote for invalid amount', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: 'abc' })
      );

      expect(result.current.quote).toBeNull();
    });
  });

  describe('🔄 Edge Cases', () => {
    it('should handle invalid months input', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      act(() => {
        result.current.handleMonthsChange('abc');
      });

      expect(result.current.inputValue).toBe('abc');
      // Months should remain unchanged
      expect(result.current.months).toBe(12);
    });

    it('should handle negative months input', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      act(() => {
        result.current.handleMonthsChange('-5');
      });

      expect(result.current.showValidationWarning).toBe(true);
    });

    it('should not decrease below minimum', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      // Already at minimum (12), trying to decrease
      act(() => {
        result.current.decreaseMonths();
      });

      expect(result.current.months).toBe(12); // Should stay at minimum
    });

    it('should not increase above maximum', () => {
      const { result } = renderHook(() => 
        useLoanCalculation({ product: mockProduct, amount: '10000' })
      );

      // Set to maximum first
      act(() => {
        result.current.handleMonthsChange('60');
      });

      act(() => {
        result.current.increaseMonths();
      });

      expect(result.current.months).toBe(60); // Should stay at maximum
    });
  });
});
