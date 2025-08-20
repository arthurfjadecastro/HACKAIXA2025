import React from 'react';
import { render } from '@testing-library/react-native';
import { LottieAnimation } from '../LottieAnimation';

jest.mock('lottie-react-native', () => {
  const React = require('react');
  return React.forwardRef((_: any, ref: any) => {
    const { View } = require('react-native');
    React.useImperativeHandle(ref, () => ({
      play: jest.fn(),
      pause: jest.fn(),
    }));
    return <View testID="lottie-mock" />;
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

    expect(getByTestId('test-animation')).toBeTruthy();
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

    const container = getByTestId('test-animation');
    expect(container.props.accessible).toBe(true);
    expect(container.props.accessibilityLabel).toBe('Test animation');
  });
});
