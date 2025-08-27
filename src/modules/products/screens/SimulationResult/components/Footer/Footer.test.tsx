import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Footer } from './Footer';

// Mock do design system
jest.mock('@/design-system/components', () => ({
  Button: ({ title, onPress, style, testID }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={testID || 'button'} onPress={onPress} style={style}>
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  },
}));

// Mock dos estilos
jest.mock('./Footer.styles', () => ({
  styles: {
    footer: { padding: 16, backgroundColor: '#fff' },
    newSimulationButton: { backgroundColor: '#005CA9' },
  },
}));

describe('Footer', () => {
  const mockOnNewSimulation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    expect(screen.getByText('Nova Simulação')).toBeTruthy();
    expect(screen.getByTestId('button')).toBeTruthy();
  });

  it('should call onNewSimulation when button is pressed', () => {
    render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    const button = screen.getByTestId('button');
    fireEvent.press(button);
    
    expect(mockOnNewSimulation).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple button presses', () => {
    render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    const button = screen.getByTestId('button');
    
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);
    
    expect(mockOnNewSimulation).toHaveBeenCalledTimes(3);
  });

  it('should render button with correct title', () => {
    render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    expect(screen.getByText('Nova Simulação')).toBeTruthy();
  });

  it('should maintain button functionality after re-render', () => {
    const { rerender } = render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    fireEvent.press(screen.getByTestId('button'));
    expect(mockOnNewSimulation).toHaveBeenCalledTimes(1);
    
    const newMockFn = jest.fn();
    rerender(<Footer onNewSimulation={newMockFn} />);
    
    fireEvent.press(screen.getByTestId('button'));
    expect(newMockFn).toHaveBeenCalledTimes(1);
    expect(mockOnNewSimulation).toHaveBeenCalledTimes(1);
  });

  it('should render with proper structure', () => {
    render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    const button = screen.getByTestId('button');
    expect(button).toBeTruthy();
    expect(button.props.style).toBeDefined();
  });

  it('should handle rapid successive presses', () => {
    render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    const button = screen.getByTestId('button');
    
    // Simulate rapid clicking
    for (let i = 0; i < 5; i++) {
      fireEvent.press(button);
    }
    
    expect(mockOnNewSimulation).toHaveBeenCalledTimes(5);
  });

  it('should work with different callback functions', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    const { rerender } = render(<Footer onNewSimulation={callback1} />);
    
    fireEvent.press(screen.getByTestId('button'));
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
    
    rerender(<Footer onNewSimulation={callback2} />);
    
    fireEvent.press(screen.getByTestId('button'));
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should render button text correctly', () => {
    render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    const buttonText = screen.getByText('Nova Simulação');
    expect(buttonText).toBeTruthy();
  });

  it('should maintain component structure', () => {
    render(<Footer onNewSimulation={mockOnNewSimulation} />);
    
    // Button should be within a View container
    const button = screen.getByTestId('button');
    expect(button.parent).toBeTruthy();
  });
});
