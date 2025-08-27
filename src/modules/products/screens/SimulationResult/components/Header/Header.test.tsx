import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Header } from './Header';

// Mock do Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, testID }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID || `icon-${name}`}>
        <Text>{name}</Text>
      </View>
    );
  },
}));

// Mock do design system
jest.mock('@/design-system/components', () => ({
  Text: ({ children, style, testID }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText testID={testID} style={style}>{children}</RNText>;
  },
}));

// Mock dos estilos
jest.mock('./Header.styles', () => ({
  styles: {
    header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    headerSpacer: { width: 40 },
  },
}));

describe('Header', () => {
  const mockOnBackPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    expect(screen.getByText('Resultado da Simulação')).toBeTruthy();
    expect(screen.getByTestId('icon-chevron-back')).toBeTruthy();
  });

  it('should call onBackPress when back button is pressed', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    const backButton = screen.getByTestId('icon-chevron-back').parent;
    fireEvent.press(backButton);
    
    expect(mockOnBackPress).toHaveBeenCalledTimes(1);
  });

  it('should render back icon correctly', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    expect(screen.getByTestId('icon-chevron-back')).toBeTruthy();
    expect(screen.getByText('chevron-back')).toBeTruthy();
  });

  it('should render header title correctly', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    expect(screen.getByText('Resultado da Simulação')).toBeTruthy();
  });

  it('should handle multiple back button presses', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    const backButton = screen.getByTestId('icon-chevron-back').parent;
    
    fireEvent.press(backButton);
    fireEvent.press(backButton);
    fireEvent.press(backButton);
    
    expect(mockOnBackPress).toHaveBeenCalledTimes(3);
  });

  it('should render with proper structure', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    // Should have back button, title, and spacer
    expect(screen.getByTestId('icon-chevron-back')).toBeTruthy();
    expect(screen.getByText('Resultado da Simulação')).toBeTruthy();
  });

  it('should handle rapid successive presses', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    const backButton = screen.getByTestId('icon-chevron-back').parent;
    
    for (let i = 0; i < 5; i++) {
      fireEvent.press(backButton);
    }
    
    expect(mockOnBackPress).toHaveBeenCalledTimes(5);
  });

  it('should work with different callback functions', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    const { rerender } = render(<Header onBackPress={callback1} />);
    
    fireEvent.press(screen.getByTestId('icon-chevron-back').parent);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
    
    rerender(<Header onBackPress={callback2} />);
    
    fireEvent.press(screen.getByTestId('icon-chevron-back').parent);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should maintain accessibility with back button', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    const backButton = screen.getByTestId('icon-chevron-back').parent;
    expect(backButton).toBeTruthy();
    
    fireEvent.press(backButton);
    expect(mockOnBackPress).toHaveBeenCalled();
  });

  it('should render all header elements', () => {
    render(<Header onBackPress={mockOnBackPress} />);
    
    // Check all main elements are present
    expect(screen.getByTestId('icon-chevron-back')).toBeTruthy();
    expect(screen.getByText('Resultado da Simulação')).toBeTruthy();
  });

  it('should handle re-rendering correctly', () => {
    const { rerender } = render(<Header onBackPress={mockOnBackPress} />);
    
    expect(screen.getByText('Resultado da Simulação')).toBeTruthy();
    
    const newCallback = jest.fn();
    rerender(<Header onBackPress={newCallback} />);
    
    expect(screen.getByText('Resultado da Simulação')).toBeTruthy();
    fireEvent.press(screen.getByTestId('icon-chevron-back').parent);
    expect(newCallback).toHaveBeenCalledTimes(1);
  });

  it('should maintain component structure after multiple renders', () => {
    const { rerender } = render(<Header onBackPress={mockOnBackPress} />);
    
    for (let i = 0; i < 3; i++) {
      rerender(<Header onBackPress={jest.fn()} />);
      expect(screen.getByText('Resultado da Simulação')).toBeTruthy();
      expect(screen.getByTestId('icon-chevron-back')).toBeTruthy();
    }
  });
});
