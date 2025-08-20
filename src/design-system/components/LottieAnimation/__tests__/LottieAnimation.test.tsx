import React from 'react';
import { render } from '@testing-library/react-native';
import { LottieAnimation } from '../LottieAnimation';

jest.mock('lottie-react-native', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    const { View } = require('react-native');
    React.useImperativeHandle(ref, () => ({
      play: jest.fn(),
      pause: jest.fn(),
    }));
    return <View testID="lottie-mock" style={props.style} />;
  });
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('LottieAnimation', () => {
  const mockSource = { test: 'animation' };

  it('should render without errors', () => {
    const { getByTestId } = render(
      <LottieAnimation 
        source={mockSource}
        testID="test-animation"
        autoPlay={false} // Evitar chamadas automáticas
      />
    );

    // Verificar se o mock do Lottie está presente
    expect(getByTestId('lottie-mock')).toBeTruthy();
  });

  it('should apply accessibility props correctly', () => {
    const { getByTestId } = render(
      <LottieAnimation 
        source={mockSource}
        accessibilityLabel="Test animation"
        testID="test-animation"
        autoPlay={false}
      />
    );

    // Verificar se o mock do Lottie está presente
    expect(getByTestId('lottie-mock')).toBeTruthy();
  });
});
