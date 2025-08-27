import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { useSimulationTransition } from './useSimulationTransition';
import { simulateAPI } from '../utils/simulationAPI';
import { useStatusRotation } from './useStatusRotation';

// Mock das dependências
jest.mock('@react-navigation/native');
jest.mock('../utils/simulationAPI');
jest.mock('./useStatusRotation');

const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockSimulateAPI = simulateAPI as jest.MockedFunction<typeof simulateAPI>;
const mockUseStatusRotation = useStatusRotation as jest.MockedFunction<typeof useStatusRotation>;

// Mock dos timers
jest.useFakeTimers();

describe('🎯 useSimulationTransition Hook', () => {
  const mockReplace = jest.fn();
  const mockStartStatusRotation = jest.fn();
  const mockStopStatusRotation = jest.fn();
  
  const defaultProps = {
    productId: 'consignado-inss',
    amount: '50000',
    months: 24
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseNavigation.mockReturnValue({
      replace: mockReplace,
    } as any);

    mockUseStatusRotation.mockReturnValue({
      statusText: 'Validando dados...',
      startStatusRotation: mockStartStatusRotation,
      stopStatusRotation: mockStopStatusRotation,
    });

    mockSimulateAPI.mockResolvedValue({} as any);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe('🎯 Hook Initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      expect(result.current.state).toBe('idle');
      expect(result.current.statusText).toBe('Validando dados...');
      expect(result.current.requestId).toMatch(/^sim_\d+_[a-z0-9]{9}$/);
    });

    it('should generate unique request IDs', () => {
      const { result: result1 } = renderHook(() => useSimulationTransition(defaultProps));
      const { result: result2 } = renderHook(() => useSimulationTransition(defaultProps));

      expect(result1.current.requestId).not.toBe(result2.current.requestId);
    });

    it('should use status rotation hook', () => {
      renderHook(() => useSimulationTransition(defaultProps));

      expect(mockUseStatusRotation).toHaveBeenCalled();
    });
  });

  describe('🎯 Simulation Execution - Success Flow', () => {
    it('should start simulation after initialization delay', async () => {
      renderHook(() => useSimulationTransition(defaultProps));

      // Avançar o timer inicial de 100ms
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockStartStatusRotation).toHaveBeenCalled();
      });
    });

    it('should set loading state when simulation starts', async () => {
      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.state).toBe('loading');
      });
    });

    it('should call simulateAPI with correct parameters', async () => {
      renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalledWith('50000', 24);
      });
    });

    it('should complete successful simulation', async () => {
      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Aguardar API
      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalled();
      });

      // Avançar dwell time
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(result.current.state).toBe('success');
        expect(mockStopStatusRotation).toHaveBeenCalled();
      });
    });

    it('should navigate to SimulationLoading after success', async () => {
      renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalled();
      });

      // Avançar dwell time + navigation delay
      act(() => {
        jest.advanceTimersByTime(3500);
      });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('SimulationLoading', {
          productId: 'consignado-inss',
          amount: '50000',
          months: 24
        });
      });
    });
  });

  describe('🎯 Simulation Execution - Error Flow', () => {
    it('should handle API errors', async () => {
      const apiError = new Error('API Error');
      mockSimulateAPI.mockRejectedValueOnce(apiError);

      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.state).toBe('error');
        expect(mockStopStatusRotation).toHaveBeenCalled();
      });
    });

    it('should handle unknown errors', async () => {
      mockSimulateAPI.mockRejectedValueOnce('Unknown error');

      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.state).toBe('error');
      });
    });

    it('should handle timeout scenario', async () => {
      // Mock API que demora mais que o timeout
      mockSimulateAPI.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 20000))
      );

      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Avançar para o timeout (15s)
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      await waitFor(() => {
        expect(result.current.state).toBe('error');
        expect(mockStopStatusRotation).toHaveBeenCalled();
      });
    });

    it('should clear timeout on successful completion', async () => {
      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalled();
      });

      // Completar simulação rapidamente
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(result.current.state).toBe('success');
      });

      // Timeout não deve ser executado
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      expect(result.current.state).toBe('success');
    });
  });

  describe('🎯 Dwell Time Management', () => {
    it('should respect minimum dwell time', async () => {
      // API rápida (100ms)
      mockSimulateAPI.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // API completa em 100ms
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Estado ainda deve ser loading (dwell de 3s)
      expect(result.current.state).toBe('loading');

      // Avançar para completar dwell
      act(() => {
        jest.advanceTimersByTime(2900);
      });

      await waitFor(() => {
        expect(result.current.state).toBe('success');
      });
    });

    it('should not add extra dwell for slow API', async () => {
      // API lenta (5s)
      mockSimulateAPI.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 5000))
      );

      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // API completa em 5s (acima do dwell mínimo)
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(result.current.state).toBe('success');
      });
    });
  });

  describe('🎯 Navigation Integration', () => {
    it('should pass correct params to navigation', async () => {
      const customProps = {
        productId: 'habitacao-sac',
        amount: '200000',
        months: 360
      };

      renderHook(() => useSimulationTransition(customProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalled();
      });

      act(() => {
        jest.advanceTimersByTime(3500);
      });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('SimulationLoading', customProps);
      });
    });

    it('should use navigation hook correctly', () => {
      renderHook(() => useSimulationTransition(defaultProps));

      expect(mockUseNavigation).toHaveBeenCalled();
    });
  });

  describe('🎯 Status Rotation Integration', () => {
    it('should start status rotation on loading', async () => {
      renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockStartStatusRotation).toHaveBeenCalled();
      });
    });

    it('should stop status rotation on success', async () => {
      renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalled();
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(mockStopStatusRotation).toHaveBeenCalled();
      });
    });

    it('should stop status rotation on error', async () => {
      mockSimulateAPI.mockRejectedValueOnce(new Error('Test error'));

      renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockStopStatusRotation).toHaveBeenCalled();
      });
    });

    it('should return status text from rotation hook', () => {
      mockUseStatusRotation.mockReturnValue({
        statusText: 'Calculando juros...',
        startStatusRotation: mockStartStatusRotation,
        stopStatusRotation: mockStopStatusRotation,
      });

      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      expect(result.current.statusText).toBe('Calculando juros...');
    });
  });

  describe('🎯 Cleanup and Memory Management', () => {
    it('should cleanup timers on unmount', () => {
      const { unmount } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      unmount();

      expect(mockStopStatusRotation).toHaveBeenCalled();
    });

    it('should cleanup initialization timer on unmount', () => {
      const { unmount } = renderHook(() => useSimulationTransition(defaultProps));

      // Desmontar antes do timer inicial
      unmount();

      // Avançar timer - não deve executar simulação
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(mockStartStatusRotation).not.toHaveBeenCalled();
    });

    it('should handle multiple cleanup calls safely', () => {
      const { unmount } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      unmount();
      
      // Múltiplas chamadas não devem causar erro
      expect(() => {
        jest.advanceTimersByTime(1000);
      }).not.toThrow();
    });
  });

  describe('🎯 Edge Cases', () => {
    it('should handle empty productId', async () => {
      const propsWithEmptyId = {
        ...defaultProps,
        productId: ''
      };

      renderHook(() => useSimulationTransition(propsWithEmptyId));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalledWith('50000', 24);
      });
    });

    it('should handle zero amount', async () => {
      const propsWithZeroAmount = {
        ...defaultProps,
        amount: '0'
      };

      renderHook(() => useSimulationTransition(propsWithZeroAmount));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalledWith('0', 24);
      });
    });

    it('should handle zero months', async () => {
      const propsWithZeroMonths = {
        ...defaultProps,
        months: 0
      };

      renderHook(() => useSimulationTransition(propsWithZeroMonths));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalledWith('50000', 0);
      });
    });

    it('should handle very large values', async () => {
      const propsWithLargeValues = {
        productId: 'test',
        amount: '999999999',
        months: 999
      };

      renderHook(() => useSimulationTransition(propsWithLargeValues));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalledWith('999999999', 999);
      });
    });
  });

  describe('🎯 Console Logging', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('should log simulation start', async () => {
      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '🔄 Iniciando simulação:',
          expect.objectContaining({
            requestId: result.current.requestId,
            productId: 'consignado-inss',
            amount: '50000',
            months: 24
          })
        );
      });
    });

    it('should log successful completion', async () => {
      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSimulateAPI).toHaveBeenCalled();
      });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '✅ Simulação concluída:',
          expect.objectContaining({
            requestId: result.current.requestId,
            duration_ms: expect.any(Number)
          })
        );
      });
    });

    it('should log timeout errors', async () => {
      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Trigger timeout
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '⏰ Timeout da simulação:',
          expect.objectContaining({
            requestId: result.current.requestId,
            duration_ms: expect.any(Number),
            reason: 'timeout'
          })
        );
      });
    });

    it('should log API errors', async () => {
      const apiError = new Error('Network error');
      mockSimulateAPI.mockRejectedValueOnce(apiError);

      const { result } = renderHook(() => useSimulationTransition(defaultProps));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          '❌ Erro na simulação:',
          expect.objectContaining({
            requestId: result.current.requestId,
            duration_ms: expect.any(Number),
            error: 'Network error'
          })
        );
      });
    });
  });
});
