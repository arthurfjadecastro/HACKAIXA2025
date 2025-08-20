import React from 'react';
import { render } from '@testing-library/react-native';
import { SplashFallback } from '../SplashFallback';

// Mock do design-system icons
jest.mock('@/design-system/icons', () => ({
  Icon: jest.fn().mockImplementation(({ name, testID }) => {
    const { View } = require('react-native');
    return <View testID={testID || `icon-${name}`} />;
  }),
}));

describe('SplashFallback', () => {
  it('should render without errors', () => {
    const { getByTestId } = render(<SplashFallback />);
    expect(getByTestId('splash-fallback')).toBeTruthy();
  });

  it('should apply accessibility props correctly', () => {
    const { getByTestId } = render(<SplashFallback />);
    
    const container = getByTestId('splash-fallback');
    expect(container.props.accessibilityLabel).toBe('Logo da Caixa');
    expect(container.props.accessibilityRole).toBe('image');
  });

  it('should accept custom testID', () => {
    const { getByTestId } = render(
      <SplashFallback testID="custom-fallback" />
    );
    
    expect(getByTestId('custom-fallback')).toBeTruthy();
  });

  it('should apply custom styling', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <SplashFallback style={customStyle} />
    );
    
    const container = getByTestId('splash-fallback');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });
});
