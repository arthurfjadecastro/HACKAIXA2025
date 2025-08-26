import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BottomSheet from './BottomSheet';
import { Text } from 'react-native';

// Mock das animações
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  RN.Animated.parallel = jest.fn((_animations) => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  RN.Animated.spring = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  return RN;
});

describe('BottomSheet', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    jest.clearAllMocks();
  });

  it('renders successfully when visible', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <BottomSheet visible={false} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(queryByText('Test Content')).toBeFalsy();
  });

  it('renders with custom height', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={mockOnClose} height={400}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('renders backdrop when visible', () => {
    const { getByTestId } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(getByTestId('bottom-sheet-backdrop')).toBeTruthy();
  });

  it('renders container when visible', () => {
    const { getByTestId } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    expect(getByTestId('bottom-sheet-container')).toBeTruthy();
  });

  it('calls onClose when backdrop is pressed', () => {
    const { getByTestId } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    const backdrop = getByTestId('bottom-sheet-backdrop');
    fireEvent.press(backdrop);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('triggers animation when visibility changes from false to true', () => {
    const { rerender } = render(
      <BottomSheet visible={false} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    // Change to visible should trigger handleOpen animation
    rerender(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    // Verify animations were called
    expect(require('react-native').Animated.parallel).toHaveBeenCalled();
  });

  it('triggers animation when visibility changes from true to false', () => {
    const { rerender } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    // Change to hidden should trigger handleClose animation
    rerender(
      <BottomSheet visible={false} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );
    
    // Verify animations and onClose were called
    expect(require('react-native').Animated.parallel).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
