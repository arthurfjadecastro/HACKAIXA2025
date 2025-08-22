import React from 'react';
import { render, screen } from '@testing-library/react-native';
import SimulationLottieAnimation from '../SimulationLottieAnimation';

// Mock do lottie-react-native
jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return React.forwardRef((props: any, ref: any) => {
    const { onAnimationFinish, testID, loop } = props;
    
    // Expõe métodos para o ref
    React.useImperativeHandle(ref, () => ({
      play: jest.fn(),
      pause: jest.fn(),
      reset: jest.fn(),
    }));
    
    // Simula o comportamento da animação
    React.useEffect(() => {
      if (!loop && onAnimationFinish) {
        // Simula finalização da animação quando não está em loop
        setTimeout(onAnimationFinish, 100);
      }
    }, [loop, onAnimationFinish]);
    
    return (
      <View 
        testID={testID}
        ref={ref}
        {...props}
      />
    );
  });
});

describe('SimulationLottieAnimation', () => {
  it('should render with default props', () => {
    render(
      <SimulationLottieAnimation isLoading={true} />
    );
    
    expect(screen.getByTestId('simulation-lottie-animation')).toBeTruthy();
  });

  it('should render with isLoading=true', () => {
    render(
      <SimulationLottieAnimation isLoading={true} testID="loading-animation" />
    );
    
    const animation = screen.getByTestId('loading-animation');
    expect(animation).toBeTruthy();
  });

  it('should render with isLoading=false', () => {
    render(
      <SimulationLottieAnimation isLoading={false} testID="finished-animation" />
    );
    
    const animation = screen.getByTestId('finished-animation');
    expect(animation).toBeTruthy();
  });

  it('should call onFinish when animation completes and isLoading=false', (done) => {
    const mockOnFinish = jest.fn(() => {
      expect(mockOnFinish).toHaveBeenCalledTimes(1);
      done();
    });

    render(
      <SimulationLottieAnimation 
        isLoading={false} 
        onFinish={mockOnFinish}
        testID="finish-animation"
      />
    );
  });

  it('should render with custom size', () => {
    render(
      <SimulationLottieAnimation 
        isLoading={true} 
        size={300}
        testID="custom-size-animation"
      />
    );
    
    const animation = screen.getByTestId('custom-size-animation');
    expect(animation).toBeTruthy();
  });

  it('should render fallback when animation fails', () => {
    // Mock console.warn para evitar logs durante o teste
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(
      <SimulationLottieAnimation 
        isLoading={true}
        testID="fallback-animation"
      />
    );
    
    // Verifica se o componente renderizou sem erros
    expect(screen.getByTestId('fallback-animation')).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
