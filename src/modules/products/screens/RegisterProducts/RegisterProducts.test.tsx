import React from 'react';
import { render } from '@testing-library/react-native';
import RegisterProducts from './RegisterProducts';

describe('RegisterProducts', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<RegisterProducts />);
    
    expect(getByText('Register Products')).toBeTruthy();
  });

  it('displays the correct title', () => {
    const { getByText } = render(<RegisterProducts />);
    
    const title = getByText('Register Products');
    expect(title).toBeTruthy();
  });

  it('renders the main container', () => {
    expect(() => render(<RegisterProducts />)).not.toThrow();
  });
});
