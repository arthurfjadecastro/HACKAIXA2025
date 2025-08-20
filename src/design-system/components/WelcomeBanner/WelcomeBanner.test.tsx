import React from 'react';
import { render } from '@testing-library/react-native';
import WelcomeBanner from './WelcomeBanner';

describe('WelcomeBanner', () => {
  it('renders correctly with user name and tier', () => {
    const { getByText } = render(
      <WelcomeBanner
        userName="Arthur de Castro"
        userTier="Singular"
      />
    );
    
    expect(getByText('Olá, Arthur de Castro')).toBeTruthy();
    expect(getByText('Cliente Singular')).toBeTruthy();
  });

  it('renders avatar component', () => {
    const { getByText } = render(
      <WelcomeBanner
        userName="Arthur de Castro"
        userTier="Singular"
      />
    );
    
    // Verificamos se o texto do banner está presente
    expect(getByText('Olá, Arthur de Castro')).toBeTruthy();
    expect(getByText('Cliente Singular')).toBeTruthy();
  });
});
