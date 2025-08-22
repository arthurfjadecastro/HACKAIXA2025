import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LoadingFallback from '../LoadingFallback';

describe('LoadingFallback', () => {
  it('should render with default props', () => {
    render(<LoadingFallback />);
    
    expect(screen.getByTestId('simulation-loading-fallback')).toBeTruthy();
    expect(screen.getByTestId('simulation-loading-fallback-indicator')).toBeTruthy();
    expect(screen.getByText('Carregando simulação...')).toBeTruthy();
  });

  it('should render with custom testID', () => {
    render(<LoadingFallback testID="custom-fallback" />);
    
    expect(screen.getByTestId('custom-fallback')).toBeTruthy();
    expect(screen.getByTestId('custom-fallback-indicator')).toBeTruthy();
  });

  it('should render with custom size', () => {
    render(<LoadingFallback size={300} testID="custom-size-fallback" />);
    
    const container = screen.getByTestId('custom-size-fallback');
    expect(container).toBeTruthy();
  });

  it('should display loading text', () => {
    render(<LoadingFallback />);
    
    const loadingText = screen.getByText('Carregando simulação...');
    expect(loadingText).toBeTruthy();
  });

  it('should render ActivityIndicator', () => {
    render(<LoadingFallback />);
    
    const indicator = screen.getByTestId('simulation-loading-fallback-indicator');
    expect(indicator).toBeTruthy();
  });
});
