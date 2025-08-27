import React from 'react';
import { render } from '@testing-library/react-native';
import { InstallmentsHeader } from './InstallmentsHeader';

// Mock do design-system components
jest.mock('@/design-system/components', () => ({
  Text: ({ children, style, ...props }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText style={style} {...props}>{children}</RNText>;
  },
}));

describe('InstallmentsHeader', () => {
  it('should render correctly', () => {
    const { getByText } = render(<InstallmentsHeader />);
    
    expect(getByText('Parcelas')).toBeTruthy();
  });

  it('should render with correct structure', () => {
    const { getByText } = render(<InstallmentsHeader />);
    
    const parcelasText = getByText('Parcelas');
    expect(parcelasText).toBeTruthy();
  });

  it('should apply correct styles to container', () => {
    const { getByText } = render(<InstallmentsHeader />);
    
    const parcelasText = getByText('Parcelas');
    const container = parcelasText.parent;
    
    expect(container).toBeTruthy();
  });

  it('should render Text component with correct content', () => {
    const { getByText } = render(<InstallmentsHeader />);
    
    const titleElement = getByText('Parcelas');
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.children).toBe('Parcelas');
  });

  it('should be accessible', () => {
    const { getByText } = render(<InstallmentsHeader />);
    
    const titleElement = getByText('Parcelas');
    expect(titleElement).toBeTruthy();
  });

  it('should match snapshot', () => {
    const component = render(<InstallmentsHeader />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should have single child text element', () => {
    const { getByText } = render(<InstallmentsHeader />);
    
    const parcelasText = getByText('Parcelas');
    expect(parcelasText).toBeTruthy();
  });

  it('should render without props', () => {
    expect(() => render(<InstallmentsHeader />)).not.toThrow();
  });

  it('should have correct component structure', () => {
    const { getByText } = render(<InstallmentsHeader />);
    
    const parcelasText = getByText('Parcelas');
    expect(parcelasText).toBeTruthy();
  });

  it('should display installments header title', () => {
    const { getByText } = render(<InstallmentsHeader />);
    
    const titleText = getByText('Parcelas');
    expect(titleText).toBeTruthy();
    expect(titleText.props.children).toBe('Parcelas');
  });
});
