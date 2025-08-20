import React from 'react';
import { render } from '@testing-library/react-native';
import Divider from './Divider';

describe('Divider', () => {
  it('renders successfully', () => {
    const { toJSON } = render(<Divider />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <Divider 
        color="#FF0000" 
        thickness={2} 
        marginVertical={8} 
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<Divider />);
    }).not.toThrow();
  });
});
