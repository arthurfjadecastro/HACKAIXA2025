import React from 'react';
import { render } from '@testing-library/react-native';
import ArthurAvatar from './ArthurAvatar';

describe('ArthurAvatar', () => {
  it('renders correctly with default size', () => {
    const { getByTestId } = render(<ArthurAvatar testID="arthur-avatar" />);
    
    expect(getByTestId('arthur-avatar')).toBeTruthy();
  });

  it('renders correctly with custom size', () => {
    const { getByTestId } = render(<ArthurAvatar size={64} testID="arthur-avatar" />);
    
    expect(getByTestId('arthur-avatar')).toBeTruthy();
  });

  it('applies custom style prop', () => {
    const customStyle = { marginTop: 10 };
    const { getByTestId } = render(<ArthurAvatar style={customStyle} testID="arthur-avatar" />);
    
    expect(getByTestId('arthur-avatar')).toBeTruthy();
  });
});
