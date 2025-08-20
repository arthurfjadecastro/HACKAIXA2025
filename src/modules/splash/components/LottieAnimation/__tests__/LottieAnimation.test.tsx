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
    return <View testID="lottie-view-mock" style={props.style} />;
  });
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('LottieAnimation', () => {
  const mockSource = { test: 'animation' };

  it('should render without errors', () => {
    expect(() => {
      render(
        <LottieAnimation 
          source={mockSource}
          testID="test-animation"
          autoPlay={false}
        />
      );
    }).not.toThrow();
  });

  it('should render with accessibility props', () => {
    expect(() => {
      render(
        <LottieAnimation 
          source={mockSource}
          accessibilityLabel="Test animation"
          testID="test-animation-accessible"
          autoPlay={false}
        />
      );
    }).not.toThrow();
  });
});
