import { renderHook, act } from '@testing-library/react-native';
import { useStatusRotation } from './useStatusRotation';

// Mock timer functions
jest.useFakeTimers();

// Mock the constants
jest.mock('../types', () => ({
  STATUS_TEXTS: ['Processando...', 'Aguarde...', 'Finalizando...'],
  STATUS_ROTATION_INTERVAL: 1000
}));

describe('useStatusRotation', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize with empty status text', () => {
    const { result } = renderHook(() => useStatusRotation());
    
    expect(result.current.statusText).toBe('');
  });

  it('should start status rotation', () => {
    const { result } = renderHook(() => useStatusRotation());
    
    act(() => {
      result.current.startStatusRotation();
    });
    
    expect(result.current.statusText).toBe('Processando...');
  });

  it('should rotate through statuses', () => {
    const { result } = renderHook(() => useStatusRotation());
    
    act(() => {
      result.current.startStatusRotation();
    });
    
    expect(result.current.statusText).toBe('Processando...');
    
    // Advance timer to trigger first rotation
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.statusText).toBe('Aguarde...');
    
    // Advance timer to trigger second rotation
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.statusText).toBe('Finalizando...');
    
    // Should cycle back to first
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.statusText).toBe('Processando...');
  });

  it('should stop status rotation', () => {
    const { result } = renderHook(() => useStatusRotation());
    
    act(() => {
      result.current.startStatusRotation();
    });
    
    act(() => {
      result.current.stopStatusRotation();
    });
    
    const currentText = result.current.statusText;
    
    // Advance timer - text should not change after stopping
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(result.current.statusText).toBe(currentText);
  });

  it('should provide start and stop functions', () => {
    const { result } = renderHook(() => useStatusRotation());
    
    expect(typeof result.current.startStatusRotation).toBe('function');
    expect(typeof result.current.stopStatusRotation).toBe('function');
  });
});
