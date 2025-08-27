import React from 'react';
import { render } from '@testing-library/react-native';
import ArthurAvatar from './ArthurAvatar';

describe('ArthurAvatar', () => {
  it('renders correctly with default size', () => {
    const { getByTestId } = render(<ArthurAvatar testID="arthur-avatar" />);
    
    expect(getByTestId('arthur-avatar')).toBeTruthy();
  });

  it('renders correctly with custom size', () => {
    const { getByTestId } = render(<ArthurAvatar size={128} testID="arthur-avatar" />);
    
    expect(getByTestId('arthur-avatar')).toBeTruthy();
  });

  it('applies custom style prop', () => {
    const customStyle = { marginTop: 10 };
    const { getByTestId } = render(<ArthurAvatar style={customStyle} testID="arthur-avatar" />);
    
    expect(getByTestId('arthur-avatar')).toBeTruthy();
  });

  it('renders without testID prop', () => {
    const component = render(<ArthurAvatar />);
    
    expect(component).toBeTruthy();
  });

  it('renders with small size', () => {
    const { getByTestId } = render(<ArthurAvatar size={32} testID="small-avatar" />);
    
    expect(getByTestId('small-avatar')).toBeTruthy();
  });

  it('renders with large size', () => {
    const { getByTestId } = render(<ArthurAvatar size={200} testID="large-avatar" />);
    
    expect(getByTestId('large-avatar')).toBeTruthy();
  });

  it('combines custom style with size prop', () => {
    const customStyle = { backgroundColor: 'red', opacity: 0.8 };
    const { getByTestId } = render(
      <ArthurAvatar size={100} style={customStyle} testID="styled-avatar" />
    );
    
    expect(getByTestId('styled-avatar')).toBeTruthy();
  });
});
