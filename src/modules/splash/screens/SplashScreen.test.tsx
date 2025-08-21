import React from 'react';
import { render } from '@testing-library/react-native';
import SplashScreen from './SplashScreen';

// Mock da navegação
const mockNavigate = jest.fn();
const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace,
  }),
  useFocusEffect: jest.fn(),
}));

// Mock do Keyboard
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  dismiss: jest.fn(),
}));

// Mock do LottieAnimation
jest.mock('@/modules/splash/components/LottieAnimation', () => ({
  LottieAnimation: ({ testID, onAnimationFinish }: any) => {
    // Simula o callback de conclusão de animação após um tempo
    if (onAnimationFinish) {
      setTimeout(onAnimationFinish, 100);
    }
    const { createElement } = require('react');
    return createElement('View', { testID });
  },
}));

// Mock do SplashFallback
jest.mock('@/modules/splash/components/SplashFallback', () => ({
  SplashFallback: ({ testID }: any) => {
    const { createElement } = require('react');
    return createElement('View', { testID });
  },
}));

// Mock do setTimeout
jest.useFakeTimers();

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should render correctly', () => {
    const { getByTestId } = render(<SplashScreen />);
    
    expect(getByTestId('splash-screen')).toBeTruthy();
  });

  it('should navigate to Home after timeout', () => {
    render(<SplashScreen />);
    
    // Avança o timer para o timeout de segurança
    jest.advanceTimersByTime(4000);
    
    expect(mockReplace).toHaveBeenCalledWith('Home');
  });

  it('should handle Lottie animation completion', () => {
    render(<SplashScreen />);
    
    // Avança o timer para o callback do Lottie
    jest.advanceTimersByTime(100);
    
    // Avança mais para o setTimeout interno do handleLottieFinish
    jest.advanceTimersByTime(300);
    
    expect(mockReplace).toHaveBeenCalledWith('Home');
  });

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(<SplashScreen />);
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
